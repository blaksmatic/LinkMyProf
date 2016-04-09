import scrapy
from tutorial.items import ProfessorItem


class wisc(scrapy.Spider):
    name = "wisc"
    start_urls = [
        "http://www.cs.wisc.edu/people/faculty",
    ]


    def parse(self, response):
        for sel in response.css(".views-row"):
            item = ProfessorItem()
            item['name'] = sel.css(".views-field-field-full-name a::text").extract()[0]
            item['img'] = sel.css(".views-field-picture a > img::attr('src')").extract()[0]
            item['title'] = sel.css(".views-field-field-title .field-content::text").extract()[0]
            item['email'] = sel.css(".views-field-mail a::text").extract()[0]
            if(sel.css(".views-field-field-office-phone .field-content::text")):item['phone'] = sel.css(".views-field-field-office-phone .field-content::text").re(r"Phone: (.*)")[0]
            item['addr'] = sel.css(".views-field-field-office-number .field-content::text").extract()[0]
            item['area'] = " "
            item['url'] = "http://www.cs.wisc.edu"+sel.css(".views-field-field-full-name a::attr('href')").extract()[0]
            yield item
