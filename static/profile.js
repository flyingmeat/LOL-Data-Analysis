// var myName = {{ name|tojson }};
// console.log(myName);

// console.log(myName);
// console.log(profileData.length);
console.log(matchData);

for (var i = 0; i < heroData.length; i++) {
	var card = document.createElement("div");
	$(card).addClass("card")
			.addClass("hero")
			.css('width', '20rem')
			.append(
				$('<div>', {'class' : 'card-block'}).append(
					$('<h6>', {'class' : 'card-title', 'text' : heroData[i]['championId']})
					)
				)
			.append(
				$('<ul>', {'class' : 'list-group list-group-flush'}).append(
					$('<li>', {'class' : 'list-group-item'}).append(
						$('<div>').append(
							$('<p>', {'text' : 'Champion Level: ' + heroData[i]['championLevel']})
							)
						.append(
							$('<p>', {'text' : 'Champion Points: ' + heroData[i]['championPoints']})
							)
						.append(
							$('<p>', {'text' : 'Last Play Time: ' + (new Date(heroData[i]['lastPlayTime'])).toISOString().slice(0, 10)})
							)
						)
					)
				)
			.append(
				$('<div>', {'class' : 'card-block'}).append(
					$('<a>', {'class' : 'btn btn-primary', 'href' : '#', 'text' : 'Hero Description'})
					)
				);
	$("#heros").append(card);
}

for (var i = 0; i < matchData.length; i++) {
	var card = document.createElement("div");
	$(card).addClass("card")
		.append(
			$('<div>', {'class' : 'card-header', 'text' : "Play time: " + (new Date(matchData[i]['time'])).toISOString().slice(0, 10)})
			)
		.append(
			$('<div>', {'class' : 'card-block'}).append(
				$('<h2>', {'class' : 'card-title', 'text' : matchData[i]['win']})
				)
			)
		.append(
			$('<ul>', {'class' : 'nav nav-tabs', 'id' : 'myTab', 'role' : 'tablist'}).append(
				$('<li>', {'class' : 'nav-item'}).append(
					$('<a>', {
						'class' : 'nav-link', 
						'id' : 'match-tab', 
						'data-toggle' : 'tab',
						'href' : '#match-data' + i,
						'role' : 'tab',
						'aria-controls' : 'match-data',
						'aria-expanded' : 'true',
						'text' : 'Data'
					})
					)
				)
			.append(
				$('<li>', {'class' : 'nav-item'}).append(
					$('<a>', {
						'class' : 'nav-link', 
						'id' : 'player-tab', 
						'data-toggle' : 'tab',
						'href' : '#players' + i,
						'role' : 'tab',
						'aria-controls' : 'players',
						'aria-expanded' : 'false',
						'text' : 'Players'
					})
					)
				)
			)
		.append(
			$('<div>', {'class' : 'tab-content', 'id' : 'myTabContent'}).append(
				$('<div>', {
					'class' : 'tab-pane fade active show container',
					'role' : 'tabpanel',
					'id' : 'match-data' + i,
					'aria-labelledby' : 'data-tab',
					'aria-expanded' : 'true'
				}).append(
					$('<p>', {'id': 'Kill', 'text' : "Kill: " + matchData[i]['kill']})
				)
				.append(
					$('<p>', {'id': 'Death', 'text' : "Kill: " + matchData[i]['death']})
				)
				.append(
					$('<p>', {'id': 'assist', 'text' : "Assists: " + matchData[i]['assist']})	
					)
				)
			.append(
				$('<div>', {
					'class' : 'tab-pane fade container',
					'id' : 'players' + i,
					'role' : 'tabpanel', 
					'aria-labelledby' : 'players-tab',
					'aria-expanded' : 'false' 
				}).append(
					$('<div>', {'class' : 'row'}).append(
						$('<div>', {'class' : 'col-6 container card'}).append(
							$('<p>').append($('<a>', {'href' : '#', 
								'onclick' : 'playerClick(\'' + matchData[i]['players'][0] + '\',\'' + matchData[i]['players_id'][0] + '\')',
							 	'id' : matchData[i]['players_id'][0],
							 	'text' : matchData[i]['players'][0]}))
							)
						.append(
							$('<p>').append($('<a>', {'href' : '#', 
								'onclick' : 'playerClick(\'' + matchData[i]['players'][1] + '\',\'' + matchData[i]['players_id'][1] + '\')',
						 		'id' : matchData[i]['players_id'][1],
						 		'text' : matchData[i]['players'][1]}))
							)
						.append(
							$('<p>').append($('<a>', {'href' : '#', 
								'onclick' : 'playerClick(\'' + matchData[i]['players'][2] + '\',\'' + matchData[i]['players_id'][2] + '\')',
								'id' : matchData[i]['players_id'][2], 
								'text' : matchData[i]['players'][2]}))
							)
						.append(
							$('<p>').append($('<a>', {'href' : '#', 
								'onclick' : 'playerClick(\'' + matchData[i]['players'][3] + '\',\'' + matchData[i]['players_id'][3] + '\')',
								'id' : matchData[i]['players_id'][3], 
								'text' : matchData[i]['players'][3]}))
							)
						.append(
							$('<p>').append($('<a>', {'href' : '#', 
								'onclick' : 'playerClick(\'' + matchData[i]['players'][4] + '\',\'' + matchData[i]['players_id'][4] + '\')',
								'id' : matchData[i]['players_id'][4], 
								'text' : matchData[i]['players'][4]}))
							)
						)
					.append(
						$('<div>', {'class' : 'col-6 container card'}).append(
							$('<p>').append($('<a>', {'href' : '#', 
								'onclick' : 'playerClick(\'' + matchData[i]['players'][5] + '\',\'' + matchData[i]['players_id'][5] + '\')',
								'id' : matchData[i]['players_id'][5], 
								'text' : matchData[i]['players'][5]}))
							)
						.append(
							$('<p>').append($('<a>', {'href' : '#', 
								'onclick' : 'playerClick(\'' + matchData[i]['players'][6] + '\',\'' + matchData[i]['players_id'][6] + '\')',
								'id' : matchData[i]['players_id'][6], 
								'text' : matchData[i]['players'][6]}))
							)
						.append(
							$('<p>').append($('<a>', {'href' : '#', 
								'onclick' : 'playerClick(\'' + matchData[i]['players'][7] + '\',\'' + matchData[i]['players_id'][7] + '\')',
								'id' : matchData[i]['players_id'][7], 
								'text' : matchData[i]['players'][7]}))
							)
						.append(
							$('<p>').append($('<a>', {'href' : '#', 
								'onclick' : 'playerClick(\'' + matchData[i]['players'][8] + '\',\'' + matchData[i]['players_id'][8] + '\')',
								'id' : matchData[i]['players_id'][8], 
								'text' : matchData[i]['players'][8]}))
							)
						.append(
							$('<p>').append($('<a>', {'href' : '#', 
								'onclick' : 'playerClick(\'' + matchData[i]['players'][9] + '\',\'' + matchData[i]['players_id'][9] + '\')',
								'id' : matchData[i]['players_id'][9], 
								'text' : matchData[i]['players'][9]}))
							)
						)
					)
				)
			)
		.append(
			$('<div>', {'class' : 'card-block'}).append(
				$('<a>', {'id' : matchData[i]['match_id'], 
					'onclick' : 'matchClick(\'' + matchData[i]['match_id'] + '\')',
					'class' : 'btn btn-primary', 
					'href' : '/game_matches', 
					'text' : 'Match Detail'})
				)
			);
	$('#matches').append(card);
}

function matchClick(matchId) {
	$('#' + matchId).attr('href', "/game_matches?match_id=" + matchId);
}

function playerClick(player_name, id) {
	// console.log(id);
	$('#' + id).attr('href', "/player_data?user_name=" + player_name);
}
