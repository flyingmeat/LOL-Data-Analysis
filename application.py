from flask import Flask, jsonify, request
from flask import render_template
from flask import Response
import requests
import json

application = Flask(__name__)
# name = ''
api_key = "api_key=RGAPI-e32c63af-2edc-4e3b-8b57-63887e95fadb"
# hero_query = "https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/71181738?"
hero_query = "https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/"
# summoner_info_query = "https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/" + "jruix?"
summoner_info_query = "https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/"
match_list_query = "https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/230727164?endIndex=15&beginIndex=0&"

main_data = {}

@application.route('/')
def get_index_page():
	return render_template('index.html', data = main_data)

@application.route('/update_data', methods = ['POST'])
def test_route():
	print request.headers
	print json.loads(request.data)
	main_data = json.loads(request.data)
	return Response(status = 200)

@application.route('/player_data')
def player_data():
	name = request.args.get('user_name', 'None')
	name = simplify_name(name)
	profile_data = {}
	hero_data = {}
	match_data = {}

	summnoer_info = requests.get(summoner_info_query + name + "?" + api_key)
	if summnoer_info.status_code != 200:
		return "Error! there is no such summoner! " + str(summnoer_info.status_code)
	profile_data = json.loads(summnoer_info.content)

	recieve = requests.get(hero_query + str(profile_data["id"]) + "?" + api_key)
	if recieve.status_code != 200:
		return "Error!" + str(recieve.status_code)
	hero_data = recieve.content
	# match_data  = requests.get()

	return render_template('my-profile.html', name = name, hero_data = hero_data)

@application.route('/game_matches')
def game_matches():
	return render_template('game_matches.html')

@application.route('/player_name')
def player_name():
	name = request.args.get('name', '2')
	print name
	return jsonify(name)

def simplify_name(name):
	name = name.lower()
	simple_name = ""
	for char in name:
		if char != ' ':
			simple_name += char
	return simple_name

if __name__ == "__main__":
	application.run()