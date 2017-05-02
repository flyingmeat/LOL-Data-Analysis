from flask import Flask, jsonify, request
from flask import render_template
import requests

application = Flask(__name__)
# name = ''

@application.route('/')
def get_index_page():
	return render_template('index.html')

@application.route('/player_data')
def player_data():
	name = request.args.get('user_name', 'None')
	print requests.get("https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/jruix?api_key=RGAPI-e32c63af-2edc-4e3b-8b57-63887e95fadb").content
	# print name
	return render_template('my-profile.html')

@application.route('/game_matches')
def game_matches():
	return render_template('game_matches.html')

@application.route('/player_name')
def player_name():
	name = request.args.get('name', '2')
	print name
	return jsonify(name)


if __name__ == "__main__":
	application.run()