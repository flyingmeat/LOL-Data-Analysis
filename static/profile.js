// var myName = {{ name|tojson }};
// console.log(myName);

// console.log(myName);
// console.log(profileData.length);

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
							$('<p>', {'text' : 'Last Play Time: ' + heroData[i]['lastPlayTime']})
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
