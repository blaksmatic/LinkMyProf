'''import scrapy
from tutorial.items import ProfessorItem


class mit(scrapy.Spider):
    name = "mit"
    start_urls = [
        "https://www.eecs.mit.edu/people/faculty-advisors",
    ]

    def parse(self, response):
        for sel in response.xpath(".//*[@id='block-system-main']/div/div/div/div[2]/div/ul/li"):
            item = ProfessorItem()
            nameSpan = sel.xpath('./div[2]/span')
            if nameSpan.xpath("./a"):
                item['name'] = nameSpan.xpath('./a/text()[1]').extract()[0]
                item['url'] = nameSpan.xpath('./a/@href').extract()[0]
            else:
                item['name'] = nameSpan.xpath('./text()').extract()[0]
                item['url'] = u''
            #item['name'] = sel.xpath('./div[2]/span/a/text()[1]').extract()[0]
            item['title'] = sel.xpath('./div[3]/div/text()[1]').extract()[0]
            item['email'] = sel.xpath('./div[4]/div/a/text()[1]').extract()[0]
            item['phone'] = sel.xpath('./div[5]/div/text()[1]').extract()[0]
            item['addr'] = sel.xpath('./div[6]/div/text()[1]').extract()[0]
            #item['url'] = sel.css(".views-field-field-person-photo .field-content a::attr('href')").extract()[0]
            item['img'] = sel.css(".views-field-field-person-photo .field-content a > img::attr('src')").extract()[0]
            item['area'] = ", ".join(sel.css('.views-field-term-node-tid .field-content > a::text').extract()).replace(u', and', u',')
            yield item'''
import scrapy
from tutorial.items import ProfessorItem

import scrapy
from tutorial.items import ProfessorItem


class mit(scrapy.Spider):
    name = "mit"
    start_urls = [
        "http://www.eecs.mit.edu/people/faculty-advisors",
    ]

    def parse(self, response):
        for sel in response.xpath(".//*[@id='block-system-main']/div/div/div/div[2]/div/ul/li"):
            item = ProfessorItem()
            nameSpan = sel.xpath('./div[2]/span')
            if nameSpan.xpath("./a"):
                item['name'] = nameSpan.xpath('./a/text()[1]').extract()[0]
                item['url'] = nameSpan.xpath('./a/@href').extract()[0]
            else:
                item['name'] = nameSpan.xpath('./text()').extract()[0]
                item['url'] = u''
            item['title'] = sel.xpath('./div[3]/div/text()[1]').extract()[0]
            item['email'] = sel.xpath('./div[4]/div/a/text()[1]').extract()[0]
            item['phone'] = sel.xpath('./div[5]/div/text()[1]').extract()[0]
            item['addr'] = sel.xpath('./div[6]/div/text()[1]').extract()[0]
            item['img'] = response.urljoin(sel.css(".views-field-field-person-photo .field-content img::attr('src')").extract()[0])
            item['area'] = ", ".join(sel.css('.views-field-term-node-tid .field-content > a::text').extract()).replace(u', and', u',')
            yield item

