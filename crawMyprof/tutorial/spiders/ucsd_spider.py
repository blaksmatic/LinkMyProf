import scrapy
from tutorial.items import ProfessorItem


class UTEXASSpider(scrapy.Spider):
    name = "ucsd"
    start_urls = [
        "http://jacobsschool.ucsd.edu/faculty/faculty_bios",
    ]

    def parse(self, response):
        return [scrapy.FormRequest(
            url="http://jacobsschool.ucsd.edu/faculty/faculty_bios/index.sfe",
            formdata={'department': 'CSE'},
            callback=self.parse_cse
        )]
    def parse_cse(self, response):
        for sel in response.xpath(".//*[@id='faclist']/tr"):
            name = sel.xpath('./td[2]/p/a/text()').extract()
            if len(name) < 1:
                continue
            item = ProfessorItem()
            item['name'] = "".join(name)
            item['title'] = "".join(sel.xpath("./td[2]/span/p[1]/em/text()").extract())
            item['img'] = response.urljoin(sel.xpath("./td[1]/a/img/@src").extract()[0])
            area = "".join(sel.xpath("./td[3]/text()[1]").extract()).strip()
            if area:
                item['area'] = area
            else:
                item['area'] = "".join(sel.xpath("./td[3]/p/text()").extract()).strip()
            webpage = response.urljoin(sel.xpath("(./td[3]/div[@align='right'])[1]/a/@href").extract()[0])
            homepage = sel.xpath("(./td[3]/div[@align='right'])[2]/a/@href").extract()
            if homepage:
                item['url'] = "".join(homepage)
            else:
                item['url'] = webpage
            request = scrapy.Request(webpage, callback=self.parse_prof_homepage)
            request.meta['item'] = item
            yield request

    def parse_prof_homepage(self, response):
        item = response.meta['item']
        for block in response.xpath(".//*[@id='content']/table/tr[1]/td[2]/div/div"):
            subtitle = "".join(block.xpath("./strong/text()").extract())
            if not subtitle: 
                continue
            if subtitle.find(u"Email") != -1:
                item['email'] = block.xpath("./a[1]/text()").extract()[0]
            if subtitle.find(u"Phone") != -1:
                item['phone'] = block.xpath("./text()[2]").extract()[0].strip()
        return item