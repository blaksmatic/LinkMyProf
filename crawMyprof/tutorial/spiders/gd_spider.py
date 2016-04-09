import scrapy
import re
from tutorial.items import ProfessorItem

class gd(scrapy.Spider):
    name = "gd"
    start_urls = [
        "https://www.glassdoor.com/Reviews/Yahoo-Reviews-E5807.htm",
    ]
    

    def parse(self, response):
    	request = scrapy.Request("https://www.glassdoor.com/Reviews/Yahoo-Reviews-E5807.htm", callback=self.parse_prof_homepage,
                                Cookies = {
        'JSESSIONID':'95F7BD37DB4F4D2252B2F0A2583DF809',
        'gdId':'da022c1d-601b-406a-a0e4-4c1c8115d5f5',
        'GSESSIONID':'11F0030BB0AA275F8767CD092AAA94C0',
        'ARPNTS':'2858789056.64288.0000',
        'D_SID':'128.2.236.149:clTElzmxG/ICOt2298+PLyljXLktDf0JvtTMPmd0kWQ',
        'D_PID':'703F990A-AE82-3F22-B757-CCC6761BE1C4',
        'D_IID':'B4853C1A-EED9-3787-9DFE-64B132A45FEB',
        'D_UID':'BF58CC08-8791-3EC6-8DC7-F8137035ECD1',
        'D_HID':'CamRaw4XooP3HoGntAwsYOgvhUvZ7PFNfoFDmVaQb84'})
        request.meta['item'] = item
        yield request
    def parse_prof_homepage(self, response):
        item = response.meta['item']
        item['name']=response
        return item