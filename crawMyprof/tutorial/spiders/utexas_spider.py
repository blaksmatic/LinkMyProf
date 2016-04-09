import scrapy
from tutorial.items import ProfessorItem


class utexas(scrapy.Spider):
    name = "utexas"
    start_urls = [
        "https://www.cs.utexas.edu/faculty",
    ]

    def parse(self, response):
        for sel in response.css('.views-row'):
            item = ProfessorItem()
            selContent = sel.css('.views-field-nothing .field-content')
            item['name'] = selContent.css('.prof-name::text').extract()[0].strip()
            item['title'] = selContent.xpath('./text()[1]').extract()[0].strip()
            item['addr'] = selContent.xpath('./text()[2]').extract()[0].strip()
            item['email'] = selContent.xpath('./a/text()').extract_first()
            item['phone'] = selContent.xpath('./text()[4]').extract()[0].strip()
            item['url'] = ", ".join(selContent.css("a:nth-of-type(3)::attr('href')").extract())
            item['img'] = sel.css(".views-field-field-image .field-content > img::attr('src')").extract()[0]
            item['area'] = ", ".join(sel.css('.views-field-field-research .item-list > ul > li > a::text').extract()).replace(u', and', u',')
            yield item