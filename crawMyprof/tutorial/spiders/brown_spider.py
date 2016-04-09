import scrapy
from tutorial.items import ProfessorItem


class brown(scrapy.Spider):
    name = "brown"
    start_urls = [
        "http://cs.brown.edu/people/faculty/",
    ]


    def parse(self, response):
    	for sel in response.xpath(".//*[@id='content']/ul[1]/li"):
    		item = ProfessorItem()
    		if(sel.css("img")):item['img']="http://cs.brown.edu"+sel.css("img::attr('srcset')").re(r"90w, (.*jpg) 180w")[0]
    		item['name']=sel.css(".profile-name::text").extract()[0]
    		item['title']=sel.css(".profile-title::text").extract()[0]
    		if(sel.css(".profile-areas::text")):item['area']=sel.css(".profile-areas::text").extract()[0].strip()
    		if(sel.css(".profile-link a:nth-of-type(2)::attr('href')")):item['url']=sel.css(".profile-link a:nth-of-type(2)::attr('href')").extract()[0]
    		item['email']=sel.css(".profile-link a:nth-of-type(1)::attr('href')").re(r"faculty/(\w*)")[0]+"@cs.brown.edu"
    		url="http://cs.brown.edu"+sel.css(".profile-link a:nth-of-type(1)::attr('href')").extract()[0]
    		'''request = scrapy.Request(url, callback=self.parse_prof_homepage)
    		request.meta['item'] = item
    		yield request'''
    		yield item

	'''def parse_prof_homepage(self, response):
		item = response.meta['item']
		item['email']=response.css("td::text").extract()[1]+response.css("td::text").extract()[2]
		return item'''