import requests

def check_wayback_machine(url):
    wayback_url = f"http://archive.org/wayback/available?url={url}"
    response = requests.get(wayback_url)
    data = response.json()
    
    if data['archived_snapshots']:
        timestamp = data['archived_snapshots']['closest']['timestamp']
        print(f"{url}: disponível na Wayback Machine em {timestamp}")
    else:
        print(f"{url}: não encontrado na Wayback Machine")

def main(urls):
    for url in urls:
        check_wayback_machine(url)

if __name__ == "__main__":
    # Adicione suas URLs aqui
    url_list = [
        "www.sindiconet.com.br",
        "www.exemplo1.com",
        "www.exemplo2.com"
    ]
    
    main(url_list)
