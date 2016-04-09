import scrapy
import re
from tutorial.items import ProfessorItem


class umass(scrapy.Spider):
    name = "umass"
    start_urls = [
        "https://www.cics.umass.edu/faculty/faculty-directory",
    ]

    def parse(self, response):
    	for sel in response.css(".view-content .views-row"):
    		item = ProfessorItem()
    		item['name']=sel.css(".field-name-title .even::text").extract()[0]
    		item['title']=sel.css(".field-name-field-position .even::text").extract()[0]
    		item['email']=sel.css(".field-name-field-email .even a::text").extract()[0]
    		item['img']=sel.css(".field-name-field-image .even a>img::attr('src')").extract()[0]
    		item['url']="https://www.cics.umass.edu"+sel.css(".field-name-field-image .even a::attr('href')").extract()[0]
    		url = item['url']
        	request = scrapy.Request(url, callback=self.parse_prof_homepage)
        	request.meta['item'] = item
        	yield request
    		#yield item
    def parse_prof_homepage(self, response):
        item = response.meta['item']
        if(response.css(".content").re(r"Interests</div></h2><p>(.*?)</p>")):item['area']=response.css(".content").re(r"Interests</div></h2><p>(.*?)</p>")[0]
        return item