from flask import Flask, jsonify, request
from flask import render_template
import requests

application = Flask(__name__)
# name = ''
api_key = "api_key=RGAPI-e32c63af-2edc-4e3b-8b57-63887e95fadb"
hero_query = "https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/71181738?"
summoner_info_query = "https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/jruix?"
match_list_query = "https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/230727164?endIndex=15&beginIndex=0&"

@application.route('/')
def get_index_page():
	return render_template('index.html')

@application.route('/player_data')
def player_data():
	name = request.args.get('user_name', 'None')
	profile_data = requests.get(hero_query + api_key).content
	match_data  = requests.get()

	return render_template('my-profile.html', name = name, data = profile_data)

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