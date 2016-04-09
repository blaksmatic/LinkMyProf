import scrapy
from tutorial.items import ProfessorItem


class ucla(scrapy.Spider):
    name = "ucla"
    start_urls = [
        "http://www.cs.ucla.edu/faculty/",
    ]

    def parse(self, response):
        for sel in response.xpath(".//*[@id='post-538']/div/p"):
            item = ProfessorItem()
            if(sel.xpath("./strong/a/text()")):item['name'] = sel.xpath("./strong/a/text()").extract()[0].strip()
            if(sel.re(r"</strong>\s*, (.*)<br>")):item['title'] = sel.re(r"</strong>\s*, (.*)<br>")[0]
            if(sel.re(r"<em>Research</em>: (.*)<br>")):item['area'] = sel.re(r"<em>Research</em>: (.*)<br>")[0].strip()
            if(sel.re(r"email: (\w*)")):item['email'] = sel.re(r"email: (\w*)")[0]+"@ucla.edu"#ennifer
            if(sel.xpath("./strong").re(r"href=.*~(\w*)")):item['url'] = "www.cs.ucla.edu/~"+sel.xpath("./strong").re(r"href=.*~(\w*)")[0]#4geren
            if(sel.css("a > img::attr('src')")):item['img'] = sel.css("a > img::attr('src')").extract()[0]
            yield item