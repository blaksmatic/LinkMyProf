import scrapy
from tutorial.items import ProfessorItem


class ucb(scrapy.Spider):
    name = "ucb"
    start_urls = [
        "http://www.eecs.berkeley.edu/Faculty/Lists/CS/list.shtml",
    ]

    def parse(self, response):
        for index in range(2,216,3):
            item = ProfessorItem()
            str1 = ".//*[@id='content']/table/tr[%d]" % index
            str2 = ".//*[@id='content']/table/tr[%d]" % (index+1)
            sel1 = response.xpath(str1)
            sel2 = response.xpath(str2)
            item['name'] = sel1.xpath("./td[2]/strong/a/text()").extract()[0]
            item['title'] = sel1.xpath("./td[2]/text()[2]").extract()[0].strip()
            item['url'] = "http://www.eecs.berkeley.edu"+sel1.css("a::attr('href')").extract()[0]
            if(sel2.css("img::attr('src')")):item['img'] = sel2.css("img::attr('src')").extract()[0]
            item['cont'] = sel2.xpath("./td[3]/text()").extract()[0].strip()
            if(sel2.xpath("./td[3]/a[1]/text()")):item['area'] = sel2.xpath("./td[3]/a[1]/text()").extract()[0]
            for index2 in range(2,10):
                str3 = "./td[3]/a[%d]/text()" % index2
                if(sel2.xpath(str3)):item['area'] =sel2.xpath(str3).extract()[0]+", "+item['area']
            yield item