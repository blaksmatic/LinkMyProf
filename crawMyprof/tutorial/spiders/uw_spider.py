import scrapy
from tutorial.items import ProfessorItem


class uw(scrapy.Spider):
    name = "uw"
    start_urls = [
        "https://www.cs.washington.edu/people/faculty",
    ]

    def parse(self, response):
        for sel in response.css(".views-row"):
            item = ProfessorItem()
            item['name'] = sel.css(".people-short-listing-name .people-short-listing-contact .people-short-listing-name a::text").extract()[0]
            item['url'] = sel.css(".people-short-listing-name .people-short-listing-contact .people-short-listing-name a::attr('href')").extract()[0]
            #item['title'] = sel.xpath('./div[3]/div/text()[1]').extract()[0]
            if(sel.css(".people-short-listing-name .people-e-mail::text")):item['email'] = sel.css(".people-short-listing-name .people-e-mail::text").extract()[0]+"@"+sel.css(".people-short-listing-name .people-e-mail::text").extract()[1]
            '''item['phone'] = sel.xpath('./div[5]/div/text()[1]').extract()[0]
            item['addr'] = sel.xpath('./div[6]/div/text()[1]').extract()[0]'''
            if(sel.css(".people-thumbnail-headshot a > img::attr('src')")):item['img'] = sel.css(".people-thumbnail-headshot a > img::attr('src')").extract()[0]
            if(sel.css(".people-short-listing-blurb p::text")):item['area'] = sel.css(".people-short-listing-blurb p::text").extract()[0].strip()
            else:item['area'] = sel.css(".people-short-listing-blurb::text").extract()[0].strip()
            yield item

