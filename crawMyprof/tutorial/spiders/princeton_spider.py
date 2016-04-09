import scrapy
from tutorial.items import ProfessorItem


class princeton(scrapy.Spider):
    name = "princeton"
    start_urls = [
        "https://www.cs.princeton.edu/people/faculty",
    ]

    def parse(self, response):
        for sel in response.css(".person"):
            item = ProfessorItem()
            if(sel.css(".person-name a::text")):
                item['name']=sel.css(".person-name a::text").extract()[0].strip()
                item['url']="https://www.cs.princeton.edu"+sel.css(".person-name a::attr('href')").extract()[0]
                item['img']="https://www.cs.princeton.edu"+sel.css("img::attr('src')").extract()[0]
                item['title']=sel.css(".person-title::text").extract()[0].strip()
                item['email']=sel.css(".person-name a::attr('href')").re(r"profile/(.*)")[0]+"@cs.princeton.edu"
                if(sel.css(".person-research-interests").re(r"Research Interests:")):item['area']=sel.css(".person-research-interests::text").extract()[1].strip()
            yield item