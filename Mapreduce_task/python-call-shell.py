import sys
import os
import shutil
import subprocess
import simplejson
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer

class HttpHandler(BaseHTTPRequestHandler):
	def do_GET(self):
		print self
		print self.path
		self.send_response(200)
		return

	def do_POST(self):
		print self.headers
		content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
		post_data = self.rfile.read(content_length) # <--- Gets the data itself
		json_data = simplejson.loads(post_data)

		if json_data.get("Message") == "Data Ready":
			self.handle_process()
			self.send_response(200)
		else:
			self.send_response(404)

	def handle_process(self):
		if os.path.exists("output"):
			print "it exists!\n"
			shutil.rmtree("output")

		subprocess.call(['java', '-jar', 'target/Mapreduce-task-1.0-SNAPSHOT.jar', 's3n://admin-matchdata/team.txt', \
			's3n://admin-matchdata/champion.txt'])

		banRate_output = self.get_output('output/output-banRate')
		factor_output = self.get_output('output/output-factor/')
		champion_output = self.get_output('output/output-Champion')
		purple_vs_blue_output = self.get_output('output/output-PurpleVsBlue')

		parameters = ['python', 'data_clean.py']
		parameters.append('ban_rate')
		parameters = parameters + banRate_output
		parameters.append('|')
		parameters.append('factor')
		parameters = parameters + factor_output  
		parameters.append('|')
		parameters.append('champion')
		parameters = parameters + champion_output
		parameters.append('|')
		parameters.append('purple_vs_blue')
		parameters = parameters + purple_vs_blue_output

		subprocess.call(parameters)

	def get_output(self, path):
		output_files = []
		for name in os.listdir(path):
			if os.path.isfile(os.path.join(path, name)) and name.startswith('part-'):
				output_files.append(path + "/" + name)
		return output_files

def run():
	print('http server is starting...')

	#ip and port of servr
	#by default http server port is 80
	server_address = ('0.0.0.0', 80)
	httpd = HTTPServer(server_address, HttpHandler)
	print('http server is running...')
	httpd.serve_forever()



if __name__ == '__main__':

	run()

	# if os.path.exists("output"):
	# 	print "it exists!\n"
	# 	shutil.rmtree("output")

	# subprocess.call(['java', '-jar', 'target/Mapreduce-task-1.0-SNAPSHOT.jar', 's3n://admin-matchdata/team.txt', \
	# 	's3n://admin-matchdata/champion.txt'])

	# banRate_output = get_output('output/output-banRate')
	# factor_output = get_output('output/output-factor/')
	# champion_output = get_output('output/output-Champion')
	# purple_vs_blue_output = get_output('output/output-PurpleVsBlue')

	# parameters = ['python', 'data_clean.py']
	# parameters.append('ban_rate')
	# parameters = parameters + banRate_output
	# parameters.append('|')
	# parameters.append('factor')
	# parameters = parameters + factor_output  
	# parameters.append('|')
	# parameters.append('champion')
	# parameters = parameters + champion_output
	# parameters.append('|')
	# parameters.append('purple_vs_blue')
	# parameters = parameters + purple_vs_blue_output

	# subprocess.call(parameters)

	