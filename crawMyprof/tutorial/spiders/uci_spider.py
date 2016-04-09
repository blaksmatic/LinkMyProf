import scrapy
import re
from tutorial.items import ProfessorItem


class uci(scrapy.Spider):
    name = "uci"
    start_urls = [
        "http://www.cs.uci.edu/faculty/index.php",
    ]
    def parse(self, response):
    	for sel in response.css("tr"):
    		item = ProfessorItem()
    		item['name']=sel.css("a::text").extract()[0].strip()
    		item['img']=sel.css("img::attr('src')").extract()[0]
    		item['url']=sel.css("a::attr('href')").extract()[0]
    		item['title']=sel.css("td:nth-of-type(2)>strong::text").extract()[0]
    		item['email']=sel.css(".small_font a::text").extract()[0]
    		item['area']=sel.css(".small_font").re(r"Area: </strong>(.*)</span>")[0].replace(u'<br>',u',')
    		yield item