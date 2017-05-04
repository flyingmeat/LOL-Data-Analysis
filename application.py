from flask import Flask, jsonify, request
from flask import render_template
import urllib
import json

application = Flask(__name__)
# name = ''

@application.route('/')
def get_index_page():
	return render_template('index.html')

@application.route('/player_data')
def player_data():
	print 1
	# print name
	return render_template('my-profile.html')

@application.route('/game_matches')
def game_matches():
	match_id = 2482294194
	url = "https://na.api.riotgames.com/api/lol/NA/v2.2/match/" + str(match_id) + "?includeTimeline=true&api_key=RGAPI-e32c63af-2edc-4e3b-8b57-63887e95fadb"
	response = urllib.urlopen(url)
	data = json.loads(response.read())
	return render_template('game_matches.html', data=data)

@application.route('/player_name')
def player_name():
	name = request.args.get('name', '2')
	print name
	return jsonify(name)


if __name__ == "__main__":
	application.run()