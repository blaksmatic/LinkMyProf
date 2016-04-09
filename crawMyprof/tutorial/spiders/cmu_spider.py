'''import scrapy
from tutorial.items import ProfessorItem
from google import google, images

class CMUSpider(scrapy.Spider):
    name = "cmu"
    allowed_domains = ["cs.cmu.edu"]
    start_urls = [
        "https://www.cs.cmu.edu/directory/all?term_node_tid_depth=10571&page=0",
    ]

    def parse(self, response):
        last_page = int(response.css('.pager-last a::attr(href)').re(r'.?page=(\d)')[0])
        for x in range(0, last_page + 1):
            url = "https://www.cs.cmu.edu/directory/all?term_node_tid_depth=10571&page=" + str(x)
            yield scrapy.Request(url, callback=self.parse_dir_contents)

    def parse_dir_contents(self, response):
        for sel in response.css('.view-directory-listing-csd .cols-6 tbody tr'):
            item = ProfessorItem()
            last_name = sel.css('td a::text').extract()[0].strip()
            first_name = sel.css('.views-field-field-computed-first::text').extract()
            item['name'] = first_name[0].strip() + u' ' + last_name
            item['title'] = sel.css('.views-field-field-computed-title::text').extract()[0].strip()
            item['addr'] = sel.css('.views-field-field-computed-building::text').extract()[0].strip()
            item['email'] = "".join(sel.css('.views-field-field-computed-email span::text').extract()).replace(u' [atsymbol] ', u'@')
            item['phone'] = sel.css('.views-field-field-computed-phone::text').extract()[0].strip()
            #Go to prof's homapage for research area and personal website
            url = u'https://www.cs.cmu.edu' + "".join(sel.css("td a::attr('href')").extract())
            item['url'] = url
            request = scrapy.Request(url, callback=self.parse_prof_homepage)
            request.meta['item'] = item
            yield request

    def parse_prof_homepage(self, response):
        item = response.meta['item']
        url = "".join(response.css('.field-name-field-personal-website a::attr(href)').extract())
        if url:
            item['url'] = url
        item['area'] = ",".join(response.css('.field-name-field-research-interests a::text').extract())
        #Search google for img
        options = images.ImageOptions()
        options.image_type = images.ImageType.FACE
        results = google.search_images(item['name'] + u' cmu', options)
        if results:
            result = next(res for res in results if res.index == 1)
            if result:
                item['img'] = result.link
        return item
'''
