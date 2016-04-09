import scrapy
import re
from tutorial.items import ProfessorItem


class duke(scrapy.Spider):
    name = "duke"
    start_urls = [
        "http://www.cs.duke.edu/people/faculty/",
    ]

    def parse(self, response):
    	for index in range(2,47):
    		str1=".//*[@id='Content']/table/tr[%d]" % index
        	sel=response.xpath(str1)
        	item = ProfessorItem()
        	item['name']=sel.css(".PeopleName a::text").extract()[0]
        	item['title']=sel.css(".ListTitle::text").extract()[0]
        	item['email']=sel.css(".SubLine").re(r"Email(.*)</span>")[0]
        	item['img']=sel.css(".Thumbnail::attr('src')").extract()[0]
        	item['url']="http://www.cs.duke.edu/people/faculty/"+sel.css(".PeopleName a::attr('href')").extract()[0]
        	url = item['url']
        	request = scrapy.Request(url, callback=self.parse_prof_homepage)
        	request.meta['item'] = item
        	yield request
    def parse_prof_homepage(self, response):
        item = response.meta['item']
        if(response.xpath(".//*[@id='Content']").re(r"Research</p>\n(.*)")):item['area']=response.xpath(".//*[@id='Content']").re(r"Research</p>\n(.*)")[0]
        return item