import scrapy
from tutorial.items import ProfessorItem


class rice(scrapy.Spider):
    name = "rice"
    start_urls = [
        "http://www.cs.rice.edu/people/faculty/",
    ]

    def parse(self, response):
    	for sel in response.css(".faculty"):
    		item = ProfessorItem()
    		item['name']=sel.css(".name strong>a::text").extract()[0]
    		item['url']=sel.css(".name strong>a::attr('href')").extract()[0]
    		item['title']=sel.css(".title::text").extract()[0].strip()
    		item['img']="http://www.cs.rice.edu"+sel.css(".photo a>img::attr('src')").extract()[0]
    		item['email']=sel.css(".contact_info").re(r"Email: </strong>(.*?)<")[0]+"@rice.edu"
    		item['area']=sel.css(".contact_info").re(r"Research Interests: </strong>(.*?)<")[0]
    		yield item