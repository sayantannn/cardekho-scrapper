import requests
from bs4 import BeautifulSoup

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
}

url = "https://www.cardekho.com/upcomingcars"
response = requests.get(url, headers=headers)

soup = BeautifulSoup(response.content, 'html.parser')
list=[]

para = soup.find_all('p')
for par in para:
    list.append(par.get_text())


paragraphs = soup.find_all('body')
for paragraph in paragraphs:
    list.append(paragraph.get_text())
print(list)

images = soup.find_all('img')
for image in images:
    image_url = image.get('src')
    print(image_url)
    if image_url and image_url.startswith('http'):
        image_response = requests.get(image_url, headers=headers)
        with open(image_url.split('/')[-1], 'wb') as f:
            f.write(image_response.content)


file_path = "/content/sample_data/file.json" 

json_data = json.dumps(list)

with open(file_path, 'w') as file:
    file.write(json_data)

print("JSON data saved to:", file_path)