var es = require('elasticsearch').Client({
  hosts: 'search-twittmap-4gto3zvwfd3kskoglfphiq4gk4.us-west-2.es.amazonaws.com',
  connectionClass: require('http-aws-es'),
  amazonES: {
    region: 'us-west-2',
    accessKey: 'AKIAI2MD2VFDRQIEYNRA',
    secretKey: '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'
  }
});

// delete index
// es.indices.delete({index: "loldata"}, function (err, data) {
//  if (err) {
//    console.log(err);
//  }
// });

// es.indices.create({
//   index: "loldata",
//   body: {
//     "mappings": {
//       "matchData": {
//         "properties": {
//           "matchCreation": {
//             "type": "date",
//             "format": "YYYY-MM-DD || epoch_millis"
//           }
//         }
//       },
//       "summonerId": {
//         "properties": {
//           "summonerId": {
//             "type": "long"
//           }
//         }
//       },
//       "matchId": {
//         "properties": {
//           "matchId": {
//             "type": "long"
//           }
//         }
//       }
//     }
//   }
// }, function(err, resp, respcode) {
//   console.log(err, resp, respcode);
// });



es.search({
  index: 'loldata',
  type: 'matchData',
  body: {
    "query": {
      "match_all": {}
    }
  }
}, function(error, response) {
  if (error) {
    console.log(error);
  } else {
    console.log(response);
  }
});