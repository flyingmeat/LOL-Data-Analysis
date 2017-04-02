$('#name-btn').click(function() {
	name = $('#name-bar').val();
	console.log(name);
	// $.ajax({
	// 	type: "POST",
	// 	url: "/player_name",
	// 	data: {"name": name},
	// 	success: function(data) {
	// 		console.log(data);
	// 	},
	// 	dataType: "json"
	// });
	$.getJSON('/player_name', {
        name: name
      }, function(data) {
        console.log(data)
      });
});