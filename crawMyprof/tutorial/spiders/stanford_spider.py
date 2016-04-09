import scrapy
from tutorial.items import ProfessorItem


class stanford(scrapy.Spider):
    name = "stanford"
    start_urls = [
        "https://forum.stanford.edu/research/profiles.php",
    ]

    def parse(self, response):
        for sel in response.xpath(".//*[@id='bodycontent']/table"):
            item = ProfessorItem()
            item['name'] = " ".join(sel.xpath('./tr[1]/th/text()').extract()).strip()
            item['img'] = response.urljoin("".join(sel.xpath("./tr[2]/td[1]/a/img/@src").extract()))
            item['url'] = "".join(sel.xpath('./tr[2]/td[1]/a/@href').extract())
            item['area'] = ",".join(sel.xpath('./tr[3]/td[1]/a/text()').extract())
            item['addr'] = " ".join(sel.xpath('./tr[5]/td/div/text()[2]').extract()).strip()
            item['phone'] = " ".join(sel.xpath('./tr[5]/td/div/text()[4]').extract()).strip()
            item['email'] = " ".join(sel.xpath('./tr[5]/td/div/text()[6]').extract()).strip().replace(u' at ', u'@').replace(u' dot ', u'.')
            yield item
