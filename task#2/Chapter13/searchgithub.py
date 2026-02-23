import requests,sys,bs4,webbrowser
if len(sys.argv)<2:
    print('Usage: searchgithub.py [search keyword]')
    sys.exit()
search=''.join(sys.argv[1:])
response=requests.get("https://github.com/search?q="+search)
response.raise_for_status()
soup=bs4.BeautifulSoup(response.text,'html.parser')
repos=soup.select('a.v-align-middle')
if len(repos)==0:
    print('No results found')
else:
    results=min(5,len(repos))
    for i in range(results):
        webbrowser.open('https://github.com'+repos[i].get('href'))
