import scrapy
import re
from tutorial.items import ProfessorItem


class usc(scrapy.Spider):
    name = "usc"
    start_urls = [
        "http://www.cs.usc.edu/faculty_staff/faculty/",
    ]

    def parse(self, response):
    	for index in range(2,137):
    		str1=".//*[@id='container']/div/div/div[2]/div[2]/div/div/table[1]/tbody/tr[%d]" % index
    		sel=response.xpath(str1)
        	if(sel.css(".tdstyle2").re(r"(.*Professor.*)<br>")and sel.css(".tdstyle2 a:nth-of-type(2)::text")):
        		item = ProfessorItem()
        		item['name']=sel.css(".tdstyle2 a::text").extract()[0].strip()
        		item['email']=sel.css(".tdstyle2 a:nth-of-type(2)::text").extract()[0]
        		item['area']=sel.css(".tdstyle3::text").extract()[0]
        		item['url']=sel.css(".tdstyle2 a::attr('href')").extract()[0]
        		item['img']="http://www.cs.usc.edu"+sel.css(".tdstyle1 img::attr('src')").extract()[0]
        		item['title']=sel.css(".tdstyle2").re(r"(.*Professor.*)<br>")[0].strip()
        		yield item
