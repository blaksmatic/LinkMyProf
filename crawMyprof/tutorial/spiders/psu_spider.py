import scrapy
import re
from tutorial.items import ProfessorItem


class psu(scrapy.Spider):
    name = "psu"
    start_urls = [
        "http://www.eecs.psu.edu/departments/faculty-staff-list.aspx",
    ]

    def parse(self, response):
        for sel in response.css("#directory_results_individual"):
            item = ProfessorItem()
            item['name']=sel.css("h3 a::text").extract()[0].replace(u'\xa0',u' ')
            item['img']="www.eecs.psu.edu"+sel.css("#individual_photo img::attr('src')").extract()[0]
            item['title']=sel.css(".title::text").extract()[0]
            item['url']="http://www.eecs.psu.edu/departments/"+sel.css("h3 a::attr('href')").extract()[0]
            item['email']=sel.css(".email::text").extract()[0]
            if(sel.css("em::text")):item['area']=sel.css("em::text").extract()[0]
            yield item