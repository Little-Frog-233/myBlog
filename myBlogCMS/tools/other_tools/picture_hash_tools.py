import datetime
import random

english_lower_list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
english_upper_list = [i.upper() for i in english_lower_list]
english_list = english_lower_list + english_upper_list

def getHash():
	date = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
	middle = ''.join(random.sample(english_list, 10))
	tail = str(random.randint(1,10000))
	hash_id = date + middle + tail
	return hash_id