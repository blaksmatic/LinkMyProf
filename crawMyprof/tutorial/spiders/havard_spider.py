import scrapy
import re
from tutorial.items import ProfessorItem


class harvard(scrapy.Spider):
    name = "harvard"
    start_urls = [
        "http://www.seas.harvard.edu/computer-science/people",
    ]
    def parse(self, response):
    	for sel in response.css(".views-row"):
            item = ProfessorItem()
            item['name']=sel.css(".views-field-nothing a:nth-of-type(2)::text").extract()[0]
            item['url']="http://www.seas.harvard.edu"+sel.css(".views-field-nothing a:nth-of-type(1)::attr('href')").extract()[0]
            item['title']=sel.css(".views-field-field-primary-title >strong::text").extract()[0]
            item['email']=sel.css(".views-field-field-email .field-content >a::text").extract()[0]
            item['img']=sel.css(".views-field-field-image .field-content >img::attr('src')").extract()[0]
            url = item['url']
            request = scrapy.Request(url, callback=self.parse_prof_homepage)
            request.meta['item'] = item
            yield request
    def parse_prof_homepage(self, response):
        item = response.meta['item']
        for sel2 in response.css(".view-display-id-block_2 .view-content .item-list"):
        	if(sel2.css("h3::text").extract()[0]=="Computer Science"):
        		item['area']=""
        		for sel3 in sel2.css(".views-row"):
        			item['area']=item['area']+sel3.css(".field-content::text").extract()[0]

        return item