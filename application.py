from flask import Flask, jsonify, request
from flask import render_template
from flask import Response

import urllib
import json
import requests
import json

application = Flask(__name__)
# name = ''
api_key = "api_key=RGAPI-e32c63af-2edc-4e3b-8b57-63887e95fadb"
# hero_query = "https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/71181738?"
hero_query = "https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/"
# summoner_info_query = "https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/" + "jruix?"
summoner_info_query = "https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/"
# match_list_query = "https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/230727164?endIndex=15&beginIndex=0&"
match_list_query = "https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/"
# match_detail_query = "https://na1.api.riotgames.com/lol/match/v3/matches/2493757882?"
match_detail_query = "https://na1.api.riotgames.com/lol/match/v3/matches/"
main_data = {}

@application.route('/')
def get_index_page():
	print main_data
	return render_template('index.html', data = main_data)

@application.route('/update_data', methods = ['POST'])
def test_route():
	global main_data
	main_data = json.loads(request.data)
	print main_data
	return Response(status = 200)

@application.route('/player_data')
def player_data():
	name = request.args.get('user_name', 'None')
	name = simplify_name(name)
	print name
	profile_data = {}
	hero_data = {}
	match_data = {}
	match_details = []

	summnoer_info = requests.get(summoner_info_query + name + "?" + api_key)
	if summnoer_info.status_code != 200:
		return "Error! there is no such summoner! " + str(summnoer_info.status_code)
	profile_data = json.loads(summnoer_info.content)

	hero_response = requests.get(hero_query + str(profile_data["id"]) + "?" + api_key)
	if hero_response.status_code != 200:
		return "Error!" + str(hero_response.status_code)
	hero_data = json.loads(hero_response.content)

	match_data_response  = requests.get(match_list_query + str(profile_data["accountId"]) + "?endIndex=6&beginIndex=0&" + api_key)
	if match_data_response.status_code != 200:
		return "Error!" + str(match_data_response.status_code)
	match_data = json.loads(match_data_response.content)

	for match_info in match_data["matches"]:
		match_details.append(handle_match(match_info, profile_data["accountId"]))
	print match_details


	return render_template('my-profile.html', name = name, hero_data = hero_data, match_data = match_details)

@application.route('/game_matches')
def game_matches():
	# match_id = 2482294194
	match_id = request.args.get('match_id', 'None')
	print match_id
	url = "https://na.api.riotgames.com/api/lol/NA/v2.2/match/" + str(match_id) + "?includeTimeline=true&api_key=RGAPI-e32c63af-2edc-4e3b-8b57-63887e95fadb"
	response = urllib.urlopen(url)
	data = json.loads(response.read())
	return render_template('game_matches.html', data=data)

@application.route('/player_name')
def player_name():
	name = request.args.get('name', '2')
	print name
	return jsonify(name)

def handle_match(match, account_id):
	result = {}
	result["players"] = []
	result["players_id"] = []
	champion_id = match["champion"]
	match_id = match["gameId"]
	participant_id = 1
	match_data_detail_response = requests.get(match_detail_query + str(match_id) + "?" + api_key)
	if match_data_detail_response.status_code != 200:
		print "Fail " + str(match_id)
		return
	match_data_detail = json.loads(match_data_detail_response.content)
	for participant in match_data_detail["participantIdentities"]:
		result["players"].append(participant["player"]["summonerName"])
		result["players_id"].append(participant["player"]["accountId"])
		if participant["player"]["accountId"] == account_id:
			participant_id = participant["participantId"]
	detail_info = match_data_detail["participants"][participant_id - 1]
	if detail_info["stats"]["win"]:
		result["win"] = "Win"
	else:
		result["win"] = "Lost"
	# result["win"] = detail_info["win"]
	result["kill"] = detail_info["stats"]["kills"]
	result["death"] = detail_info["stats"]["deaths"]
	# result["K/D"] = str('%1.3f' % (float(detail_info["stats"]["kills"]) / float(detail_info["stats"]["deaths"])))
	result["assist"] = detail_info["stats"]["assists"]
	result["time"] = match["timestamp"]
	result["match_id"] = match_id
	# print result
	return result


def simplify_name(name):
	name = name.lower()
	simple_name = ""
	for char in name:
		if char != ' ':
			simple_name += char
	return simple_name

if __name__ == "__main__":
	application.run()