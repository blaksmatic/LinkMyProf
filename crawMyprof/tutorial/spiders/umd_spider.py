import scrapy
import re
from tutorial.items import ProfessorItem


class umd(scrapy.Spider):
    name = "umd"
    start_urls = [
        "http://www.cs.umd.edu/people/faculty",
    ]
    def parse(self, response):
    	for index in range(1,20):
        	str1=".//*[@id='block-system-main']/div/div/div/div[3]/table[1]/tbody/tr[%d]" % index
        	for index2 in range(1,4):
        		str2="/td[%d]" % index2
        		sel=response.xpath(str1+str2)
        		item = ProfessorItem()
        		item['name']=sel.css(".views-field-field-person-last-name > strong > a::text").extract()[0]
        		item['url']="http://www.cs.umd.edu"+sel.css(".views-field-field-person-last-name > strong > a::attr('href')").extract()[0]
        		item['img']=sel.css(".views-field-field-person-photo a > img::attr('src')").extract()[0]
        		item['title']=sel.css(".views-field-field-faculty-title .field-content::text").extract()[0]
        		if(sel.css(".views-field-field-research-areas .first > a::text")):item['area']=sel.css(".views-field-field-research-areas .first > a::text").extract()[0]
        		if(sel.css(".views-field-field-research-areas .last > a::text")):item['area']=item['area']+", "+sel.css(".views-field-field-research-areas .last > a::text").extract()[0]
        		item['email']=sel.css(".views-field-field-person-last-name > strong > a::attr('href')").re(r"/people/(\w*)")[0]+"@cs.umd.edu"
        		yield item
