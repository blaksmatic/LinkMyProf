import scrapy
import re
from tutorial.items import ProfessorItem


class umich(scrapy.Spider):
    name = "umich"
    start_urls = [
        "http://www.eecs.umich.edu/eecs/faculty/csefaculty.html",
    ]

    def parse(self, response):
    	for index in range(1,204,2):
        	str1=".//*[@id='content_body']/table/tr[%d]" % index
        	sel=response.xpath(str1)
        	item = ProfessorItem()
        	if(sel.css("a::attr('href')")):item['url']=sel.css("a::attr('href')").extract()[0]
        	if(sel.css("a>span::text")):item['name']=sel.css("a>span::text").extract()[0]
        	else:item['name']=sel.css("td:nth-of-type(2)>span::text").extract()[0]
        	str2=sel.re(r"(.*)\s*<b>Division")[0]
        	item['title']=re.sub(r"<br>","",str2)
        	item['img']="http://www.eecs.umich.edu"+sel.css("td>img::attr('src')").extract()[0]
        	item['email']=sel.re(r"Email:</b> (\w*)")[0]+"@umich.edu"
        	if(sel.re(r"Research Interests:</b>(.*)<br>")):item['area']=sel.re(r"Research Interests:</b>(.*)<br>")[0].strip()
        	yield item
