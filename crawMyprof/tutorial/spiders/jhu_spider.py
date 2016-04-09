import scrapy
from tutorial.items import ProfessorItem


class jhu(scrapy.Spider):
    name = "jhu"
    start_urls = [
        "http://www.cs.jhu.edu/faculty/",
    ]

    def parse(self, response):
    	for sel in response.css(".faculty-member-card"):
    		item = ProfessorItem()
    		if(sel.css(".faculty-image > img::attr('alt')")):
    			item['name']=sel.css(".faculty-image > img::attr('alt')").extract()[0]
    		else:
    			item['name']=sel.css("h3 a::text").extract()[0]
    		if(sel.css("h6::text")):
    			item['title']=sel.css("h6::text").extract()[0]
    		else:
    			item['title']=sel.css("h6 strong::text").extract()[0]
    		item['url']=sel.css(".more::attr('href')").extract()[0]
    		url = item['url']
    		request = scrapy.Request(url, callback=self.parse_prof_homepage)
    		request.meta['item'] = item
    		yield request
    def parse_prof_homepage(self, response):
        item = response.meta['item']
        if(response.css(".primary img::attr('src')")):item['img']=response.css(".primary img::attr('src')").extract()[0]
        item['area']=",".join(response.css(".research-areas ul li::text").extract())
        item['email']=response.css(".faculty-info").re(r"mailto:(\w*)")[0]+"@cs.jhu.edu"
        return item