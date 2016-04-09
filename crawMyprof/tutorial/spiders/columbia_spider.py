import scrapy
import re
from tutorial.items import ProfessorItem


class columbia(scrapy.Spider):
    name = "columbia"
    start_urls = [
        "http://www.cs.columbia.edu/people/faculty",
    ]

    def parse(self, response):
    	for index in range(1,118,2):
    		str1=".//*[@id='content']/table[1]/tr[%d]" % index
        	sel=response.xpath(str1)
        	item = ProfessorItem()
        	item['name']=sel.css("a::text").extract()[0].strip()
        	item['url']=sel.css("a::attr('href')").extract()[0]
        	item['img']="http://www.cs.columbia.edu"+sel.css("img::attr('src')").extract()[0]
        	if(sel.re(r"<br>(.*)</font>")):item['title']=sel.re(r"<br>(.*)</font>")[0]
        	item['email']=sel.re(r"hideemail\('', '(\w*)")[0]+"@columbia.edu"#+sel.re(r"hideemail.*\'.'(.*)columbia")
        	item['area']=sel.re(r"Research Interests:</b> (.*)<br>")[0]
    		yield item