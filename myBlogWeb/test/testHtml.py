import requests

if __name__ == '__main__':
    url = 'http://127.0.0.1:7000/blog_detail/?blog_id=9'
    response = requests.get(url)
    
    print(response.text)