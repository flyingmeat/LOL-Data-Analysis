var queueModule = require('queue-fifo');
var LolApi = require('leagueapi');
var Elasticsearch = require('aws-es');
var config = require('./config.json');
var championList = require('./championList.json');
var epoch = require('epoch.js');

// fs write stream config
var fs = require("fs");

// Later.js config
var later = require('later');
later.date.UTC();
var textSched = later.parse.text('every 1 day'); // every 1 day

// AWS S3 config
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
var s3 = new AWS.S3();

// temp: 2nd es client
var es = require('elasticsearch').Client({
  hosts: config.host,
  connectionClass: require('http-aws-es'),
  amazonES: {
    region: 'us-west-2',
    accessKey: config.accessKeyId,
    secretKey: config.secretAccessKey
  }
});

// AWS SNS config
var sns = new AWS.SNS();

// LOLApi config
LolApi.init(config.lolKey, 'na');
LolApi.setRateLimit(10, 500);
// AWS ES config
var Elasticsearch = require('aws-es');
var elasticsearch = new Elasticsearch({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  service: 'es',
  region: "us-west-2",
  host: config.host
});
// queue config
var queue = new queueModule();
queue.enqueue(2484277625); // a start point

// BFS
setInterval(function() {
  if (queue.isEmpty()) {
    console.log("Queue is empty now!");
    return;
  }

  var matchId = queue.dequeue();

  // retrieve match data
  LolApi.getMatch(matchId, false, 'na', function(err, matchData) {
    console.log("Retrieving match data for matchId: " + matchId + "... (Queue Size: " + queue.size() + ")");

    if (err) {
      console.log("Error: API Limits");
    } else if (matchData === null || matchData === undefined) {
      console.log("Error: data retrieved is null or undefined");
    } else {

      // 1. index matchId to AWS ES
      elasticsearch.index({
        index: 'loldata',
        type: 'matchId',
        body: {
          matchId: matchId
        }
      }, function(err, data) {
        if (err) {
          console.log("Error: fail to index matchId to AWS ES", err);
        } else {
          console.log("Step 1: index matchId to AWS ES ==> " + matchId);
        }
      });

      // 2. index all match data to AWS ES
      var matchDetailData = constructMatchData(matchData);

      elasticsearch.index({
        index: 'loldata',
        type: 'matchData',
        body: matchDetailData
      }, function(err, data) {
        if (err) {
          console.log("Error: fail to index matchData to AWS ES", err);
        } else {
          console.log("Step 2: index match data to AWS ES ==> " + matchDetailData.matchId);
        }
      });

      // 3. index summonerId to ES and refill the queue
      for (var i = 0; i < matchData.participantIdentities.length; i++) {
        var participantId = matchData.participantIdentities[i].player.summonerId;

        (function(participantId) {
          elasticsearch.search({
            index: 'loldata',
            type: 'summonerId',
            size: 1,
            body: {
              query: {
                term: {
                  "summonerId": participantId
                }
              }
            }
          }, function(err, data) {
            if (err) {
              console.log("Error: fail to search summonerId from AWS ES", err);
            } else {
              if (data.hits.hits.length === 0) {

                if (queue.size() < 100) {
                  // index summonerId to AWS ES
                  elasticsearch.index({
                    index: 'loldata',
                    type: 'summonerId',
                    body: {
                      summonerId: participantId
                    }
                  }, function(err, data) {
                    if (err) {
                      console.log("Error: fail to index summonerId to AWS ES", err);
                    } else {
                      console.log("Step 3: index summonerId(" + participantId + ") to AWS ES and push item into queue...\n");
                    }
                  });

                  // push new matchId into queue
                  var options = {
                    beginIndex: 1,
                    endIndex: 10
                  };

                  LolApi.getMatchHistory(participantId, options, 'na', function(err, data) {
                    if (err) {
                      console.log("Error: fail to fetch match list for summonerId ==> " + participantId);
                    } else {
                      var matchArray = data.matches;

                      if (matchArray !== undefined) {
                        for (var j = 0; j < matchArray.length; j++) {
                          var mId = matchArray[j].matchId;

                          (function(mId) {
                            elasticsearch.search({
                              index: 'loldata',
                              type: 'matchId',
                              size: 1,
                              body: {
                                query: {
                                  term: {
                                    "matchId": mId
                                  }
                                }
                              }
                            }, function(err, data) {
                              if (err) {
                                console.log("Error: fail to search matchId from AWS ES");
                              } else {
                                if (data.hits.hits.length === 0) {
                                  if (queue.size() < 100) {
                                    console.log("Queue enqueue =====> " + mId);
                                    queue.enqueue(mId);
                                  }
                                }
                              }
                            });
                          })(mId);
                        }
                      }
                    }
                  });
                }
              }
            }
          });
        })(participantId);
      }
    }
  });

}, 1000);

// Function: construct match data
function constructMatchData(data) {

  var matchData = {
    matchId: data.matchId,
    matchCreation: epoch(data.matchCreation).format('YYYY-MM-DD'),
    participants: [],
    teams: [{
      teamId: data.teams[0].teamId,
      winner: data.teams[0].winner,
      firstBlood: data.teams[0].firstBlood,
      firstTower: data.teams[0].firstTower,
      firstInhibitor: data.teams[0].firstInhibitor,
      firstBaron: data.teams[0].firstBaron,
      dragonKills: data.teams[0].dragonKills,
      baronKills: data.teams[0].baronKills,
      bans: []
    }, {
      teamId: data.teams[1].teamId,
      winner: data.teams[1].winner,
      firstBlood: data.teams[1].firstBlood,
      firstTower: data.teams[1].firstTower,
      firstInhibitor: data.teams[1].firstInhibitor,
      firstBaron: data.teams[1].firstBaron,
      dragonKills: data.teams[1].dragonKills,
      baronKills: data.teams[1].baronKills,
      bans: []
    }]
  };

  // fill participants array
  for (var i = 0; i < data.participants.length; i++) {
    var participant = data.participants[i];

    // calculate KDA
    var kda = 0;
    if (participant.stats.deaths === 0) {
      kda = (participant.stats.kills + participant.stats.assists) === 0 ? 0 : 20;
    } else {
      kda = (participant.stats.kills + participant.stats.assists) / participant.stats.deaths;
    }

    var championData = {
      name: championList[participant.championId].name,
      winner: participant.stats.winner,
      lane: participant.timeline.lane,
      kills: participant.stats.kills,
      kda: kda.toFixed(2),
      quadraKills: participant.stats.quadraKills,
      pentaKills: participant.stats.pentaKills,
      firstBlood: participant.stats.firstBloodKill
    };

    matchData.participants.push(championData);
  }

  // fill bans array of 2 teams
  if (data.teams[0].bans !== undefined) {
    for (var i = 0; i < data.teams[0].bans.length; i++) {
      // 注意 push 进去的是个 object, 带 name + key
      matchData.teams[0].bans.push(championList[data.teams[0].bans[i].championId]);
    }
  }

  if (data.teams[1].bans !== undefined) {
    for (var i = 0; i < data.teams[1].bans.length; i++) {
      matchData.teams[1].bans.push(championList[data.teams[1].bans[i].championId]);
    }
  }

  return matchData;
}

var deleteAllTypeRecordsFromES = function(typeName) {
  es.deleteByQuery({
    index: 'loldata',
    type: typeName,
    body: {
      "query": {
        "match_all": {}
      }
    }
  }, function(error, response) {
    if (error) {
      console.log("Error: Fail to delete " + typeName + " type records!", error);
    }
  });
};

var cleanDataAndUploadToS3 = function() {

  // delete team.txt (fast)
  fs.unlink('./clean_data/team.txt', function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('team.txt deleted successfully');
  });

  // delete champion.txt (slow)
  fs.unlink('./clean_data/champion.txt', function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('champion.txt deleted successfully');

    // clean data and write to files
    var globalCount = 0;
    var championStream = fs.createWriteStream("./clean_data/champion.txt", {
      "flags": "a"
    });
    var teamStream = fs.createWriteStream("./clean_data/team.txt", {
      "flags": "a"
    });

    es.search({
      index: 'loldata',
      type: 'matchData',
      scroll: '10s', // keep the search results "scrollable" for 10 seconds
      size: 1000,
      body: {
        "query": {
          "match_all": {}
        }
      }
    }, function getMoreUntilDone(error, response) {
      response.hits.hits.forEach(function(hit) {
        globalCount++;

        // 1. champion.txt
        var championData = hit._source.participants;
        championData.forEach(function(chmp) {
          (function(championName, winner, lane, kills, kda, quadraKills, pentaKills, firstBloodKill) {
            var result = (winner === true ? "win" : "lose");
            championStream.write(championName + "\t" + result + "\t" + lane + "\t" + kills + "\t" + kda + "\t" + quadraKills + "\t" + pentaKills + "\t" + firstBloodKill + "\n");
          })(chmp.name, chmp.winner, chmp.lane, chmp.kills, chmp.kda, chmp.quadraKills, chmp.pentaKills, chmp.firstBlood);
        });

        // 2. team.txt
        var teamData = hit._source.teams;
        teamData.forEach(function(t) {
          (function(teamId, winner, firstBlood, firstTower, firstInhibitor, firstBaron, dragonKills, baronKills, banArray) {
            var result = (winner === true ? "win" : "lose");
            var line = teamId + "\t" + result + "\t" + firstBlood + "\t" + firstTower + "\t" + firstInhibitor + "\t" + firstBaron + "\t" + dragonKills + "\t" + baronKills;

            if (banArray.length !== 0) {
              banArray.forEach(function(b) {
                line += "\t" + b.name;
              });
            }

            teamStream.write(line + "\n");
          })(t.teamId, t.winner, t.firstBlood, t.firstTower, t.firstInhibitor, t.firstBaron, t.dragonKills, t.baronKills, t.bans);
        });

      });

      if (response.hits.total !== globalCount) {
        // ask elasticsearch for the next set of hits from this search
        es.scroll({
          scrollId: response._scroll_id,
          scroll: '10s'
        }, getMoreUntilDone);

        console.log("Amount of matches retrieved: " + globalCount);
      } else {
        console.log("champion.txt and team.txt are ready!");

        // delete all records in loldata index to keep data fresh
        deleteAllTypeRecordsFromES("summonerId");
        deleteAllTypeRecordsFromES("matchId");
        deleteAllTypeRecordsFromES("matchData");
      }
    });

    // give 150s to prepare 2 files
    setTimeout(function() {
      console.log("Ready to upload to S3...");

      // Read in the file, convert it to base64, store to S3
      fs.readFile('./clean_data/team.txt', function(err, data) {
        if (err) {
          throw err;
        }

        var base64data = new Buffer(data, 'binary');

        s3.putObject({
          Bucket: 'admin-matchdata',
          Key: 'team.txt',
          Body: base64data,
          ACL: 'public-read'
        }, function(resp) {
          console.log('Successfully uploaded team.txt.');
        });

      });

      fs.readFile('./clean_data/champion.txt', function(err, data) {
        if (err) {
          throw err;
        }

        var base64data = new Buffer(data, 'binary');

        s3.putObject({
          Bucket: 'admin-matchdata',
          Key: 'champion.txt',
          Body: base64data,
          ACL: 'public-read'
        }, function(resp) {
          console.log('Successfully uploaded champion.txt.');

          // after upload 2 files, use SNS to notificate web server
          var snsParams = {
            TopicArn: "arn:aws:sns:us-west-2:269029038110:twitterChannel",
            Message: "Data Ready"
          };

          sns.publish(snsParams, function(err, res) {
            if (err) {
              console.log(err.stack);
              return;
            }
            console.log("SNS: Message Published!");
          });

        });
      });

    }, 1000 * 150);

  });
};

// set Later.js timer (Interval)
var timer = later.setInterval(cleanDataAndUploadToS3, textSched);