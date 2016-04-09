import scrapy
import re
from tutorial.items import ProfessorItem


class yale(scrapy.Spider):
    name = "yale"
    start_urls = [
        "http://cpsc.yale.edu/people/faculty",
    ]

    def parse(self, response):
    	for index in range(1,21):
    		str1=".//*[@id='block-system-main']/div/div/div/div[2]/table/tbody/tr[%d]" % index
    		sel=response.xpath(str1)
    		item = ProfessorItem()
    		item['area']=""
    		item['name']=sel.css(".views-field-name a:nth-of-type(1)::text").extract()[0]
    		item['email']=sel.css(".views-field-name a:nth-of-type(2)::text").extract()[0]
    		item['title']=sel.css(".views-field-name").re(r"<br>(.*Professor.*?)<br>")[0]
    		item['img']=sel.css(".views-field-picture a>img::attr('src')").extract()[0]
    		item['url']="http://cpsc.yale.edu"+sel.css(".views-field-picture a::attr('href')").extract()[0]
    		yield item