headers={"User-Agent":"Mozilla/5.0"}
import requests,sys,bs4,webbrowser,os
if len(sys.argv)<2:
    print('Usage:searchgithub.py keyword')
    sys.exit()
repos=[]
search='+'.join(sys.argv[1:])
response=requests.get("https://github.com/search?q="+search,headers=headers)
response.raise_for_status()
soup=bs4.BeautifulSoup(response.text,'html.parser')
links = soup.select('a[href^="/"]')
for l in links:
    href=l.get('href')
    if href.count("/") == 2:
        repos.append(href)
if len(repos)==0:
    print('No results found')
else:
    results=min(5,len(repos))
    for i in range(results):
        webbrowser.open('https://github.com'+repos[i])

