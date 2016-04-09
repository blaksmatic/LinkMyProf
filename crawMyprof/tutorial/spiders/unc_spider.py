import scrapy
from tutorial.items import ProfessorItem


class unc(scrapy.Spider):
    name = "unc"
    start_urls = [
        "http://cs.unc.edu/people-page/faculty/",
    ]

    def parse(self, response):
    	for sel in response.css(".uncperson"):
    		item = ProfessorItem()
    		item['name']=sel.css("h3 a::text").extract()[0]
    		item['url']=sel.css("h3 a::attr('href')").extract()[0]
    		item['img']=sel.css("a>img::attr('src')").extract()[0]
    		item['title']=" ".join(sel.css("span::text").extract()).replace(u'\n', u'')
    		item['email']=sel.re(r">(.*)\(at\)")[0].strip()+"@cs.unc.edu"
    		if(sel.re(r"Ph.D.(.*)")):item['area']=sel.re(r"Ph.D.(.*)")[0]
    		else:item['area']=sel.re(r"M.S.(.*)")[0]
    		#else:item['area']=sel.re(r"Ph.D..*\d{4}(.*)</p>")[0].strip()
    		yield item