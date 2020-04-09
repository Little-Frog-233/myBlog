#coding:utf-8
import requests

if __name__ == '__main__':
	# url = 'http://127.0.0.1:5000/api/restful/picture/'
	# params = {
	# 	'filename': '20200316153057MLUysBQXOK6628.jpg'
	# }
	# response = requests.delete(url, params=params)
	# print(response.json())
	url = 'http://127.0.0.1:5000/api/restful/blog_list/'
	params = {
		# 'category': '生活'
	}
	headers = {
		'Cookie': 'csrftoken=N09YFtUxKazY6RiaSyk7fkYRGUHl2dgDtgoaODkMgWTTzHfy4OP9WZIhPd8k6zGy; UM_distinctid=16e24d8c7216db-01b3104ea181d8-123b6a5a-1fa400-16e24d8c722ad9; CNZZDATA5406879=cnzz_eid%3D1206128317-1572575275-%26ntime%3D1572575275; session=.eJxNjcEOwiAQRP9lzx6AgGB_hizs2hKFNhQSjfHfxXrxNvMmL_MCv3HNWLg0mFrtfIKIW4sLwgTx8cwwwF6vvq03LoOpcA5onBNkw0WTs1ppaYIhq1mipiiCMFHR8NLukXIaljzKfZ2_5ffSd_aJjmnE-p8LZh5Ptae4cJnh_QF3izWA.XnCX7w.FCdB9i152Uqy5oo7tgwC6TAFybE'
	}
	response = requests.get(url, params=params, headers=headers)
	print(response.json())