import scrapy
import re
from tutorial.items import ProfessorItem


class nyu(scrapy.Spider):
    name = "nyu"
    start_urls = [
        "http://www.cs.nyu.edu/dynamic/people/faculty/",
    ]

    def parse(self, response):
    	for index in range(1,50):
    		str1=".//*[@id='wrap']/div/div/div[2]/div/div/div[3]/ul/li[%d]" % index
    		sel=response.xpath(str1)
    		item = ProfessorItem()
    		if(sel.css(".name a::text")):
    			item['name']=sel.css(".name a::text").extract()[0]
    			item['url']=sel.css(".name a::attr('href')").extract()[0]
    		else:
    			item['name']=sel.css(".name::text").extract()[0]
    		item['title']=sel.css(".title::text").extract()[0]
    		item['img']="http://www.cs.nyu.edu"+sel.css("img::attr('src')").extract()[0]
    		item['email']=sel.css(".info").re(r"Email:(.*)<br>")[0]
    		item['area']=sel.css(".info").re(r"<br> \n(.*?)\n")[1].strip()
    		yield item