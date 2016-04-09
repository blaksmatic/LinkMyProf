import scrapy
import re
from tutorial.items import ProfessorItem


class caltech(scrapy.Spider):
    name = "caltech"
    start_urls = [
        "http://www.cms.caltech.edu/people",
    ]

    def parse(self, response):
        for sel in response.css(".post"):
            item = ProfessorItem()
            item['name'] = sel.css(".name a::text").extract()[0]
            item['title'] = sel.css('.txt > p > strong::text').extract()[0].strip()
            if(sel.css(".image a > img::attr('src')")):item['img'] = "http://www.cms.caltech.edu"+sel.css(".image a > img::attr('src')").extract()[0]
            item['url'] = "http://www.cms.caltech.edu"+sel.css(".name a::attr('href')").extract()[0]
            url = item['url']
            request = scrapy.Request(url, callback=self.parse_prof_homepage)
            request.meta['item'] = item
            yield request
            '''item['url'] = sel.css(".people-short-listing-name .people-short-listing-contact .people-short-listing-name a::attr('href')").extract()[0]
            item['title'] = sel.xpath('./div[3]/div/text()[1]').extract()[0]
            if(sel.css(".people-short-listing-name .people-e-mail::text")):item['email'] = sel.css(".people-short-listing-name .people-e-mail::text").extract()[0]+"@"+sel.css(".people-short-listing-name .people-e-mail::text").extract()[1]
            item['phone'] = sel.xpath('./div[5]/div/text()[1]').extract()[0]
            item['addr'] = sel.xpath('./div[6]/div/text()[1]').extract()[0]
            if(sel.css(".people-thumbnail-headshot a > img::attr('src')")):item['img'] = sel.css(".people-thumbnail-headshot a > img::attr('src')").extract()[0]
            if(sel.css(".people-short-listing-blurb p::text")):item['area'] = sel.css(".people-short-listing-blurb p::text").extract()[0].strip()
            else:item['area'] = sel.css(".people-short-listing-blurb::text").extract()[0].strip()'''
            #yield item
    def parse_prof_homepage(self, response):
        item = response.meta['item']
        if(response.css(".txt").re(r"Email: (\w*)")):item['email'] = response.css(".txt").re(r"Email: (\w*)")[0]+"@caltech.edu"
        if(response.css(".txt").re(r"<p>Tel: (.*)")):item['phone'] = response.css(".txt").re(r"<p>Tel: (.*)")[0]
        if(response.css(".txt").re(r"<h3>List of Research Areas</h3>\s*<p>(.*)</p>")):item['area'] = response.css(".txt").re(r"<h3>List of Research Areas</h3>\s*<p>(.*)</p>")[0]
        return item

