import os
import sys
import requests
import json
from itertools import groupby

class Get_file(object):
	def __init__(self):
		# self.factor_pathes = factor_pathes
		pass
	def file_filter(self, pathes, name, result, start_index, end_index):
		result[name] = []
		for path in pathes:
			print path
			with open(path) as file:
				for line in file:
					new_line = line[1:-2]
					key_value = new_line.split(",")
					values = key_value[1].split("\t")
					# print values
					count = values[-1]
					curr_result = []
					for i in range(start_index, end_index):
						curr_result.append(str('%1.3f' % (float(values[i]) / float(count))))

					if end_index < len(values) - 1:	
						for i in range(end_index, len(values) - 1):
							curr_result.append(values[i])
					if name == 'champion' or name == 'ban_rate':
						curr_result.append(values[-1])
					result[name].append({"name": key_value[0], "data" : curr_result})
				file.close()


if __name__ == '__main__':
	# print 123
	parameters = [list(group) for k, group in groupby(sys.argv[1:], lambda x : x == '|') if not k]
	# print parameters
	get_file = Get_file()
	result = {}
	for parameter in parameters:
		if parameter[0] == 'ban_rate':
			get_file.file_filter(parameter[1:], 'ban_rate', result, 0, 0)
		elif parameter[0] == 'factor':
			get_file.file_filter(parameter[1:], 'factor', result, 0, 6)
		elif parameter[0] == 'champion':
			get_file.file_filter(parameter[1:], 'champion', result, 0, 4)
		else:
			get_file.file_filter(parameter[1:], 'purple_vs_blue', result, 0, 1)
	for attribute in result:
		print '------------------------------------'
		print attribute
		print result[attribute]

	headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
	requests.post('http://lol-data.nf33fef35j.us-west-2.elasticbeanstalk.com/update_data', data=json.dumps(result), headers=headers)




