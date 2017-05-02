console.log($('#name-btn').attr('href'));
console.log("123");

$('#name-btn').click(function() {
	name = $('#name-bar').val();
	console.log(name);
	$('#name-btn').attr('href', "/player_data?user_name=" + name);
});
