import scrapy
from tutorial.items import ProfessorItem
from selenium import webdriver
import time

class uiuc(scrapy.Spider):
    name = "uiuc"
    start_urls = [
        "http://cs.illinois.edu/directory/faculty?quicktabs_faculty_tabs_new=0#quicktabs-faculty_tabs_new",
    ]

    def __init__(self):
        scrapy.Spider.__init__(self)
        # use any browser you wish
        self.driver = webdriver.Firefox() 
        self.driver2 = webdriver.Firefox()
    def __del__(self):
        self.driver.close()
        self.driver2.close()

    def parse(self, response):
        #start browser
        self.driver.get(response.url)
        #loading time interval
        time.sleep(1)
        # get the data and write it to scrapy items
        for sel in self.driver.find_elements_by_css_selector('#quicktabs_tabpage_faculty_tabs_new_0 .extDirectoryPerson'):
            item = ProfessorItem()
            item['name'] = sel.find_element_by_css_selector('.extDirectoryName a').text
            item['img'] = sel.find_element_by_css_selector('.extDirectoryPhoto a img').get_attribute('src')
            url = response.urljoin(sel.find_element_by_css_selector('.extDirectoryPhoto a').get_attribute('href'))
            item['url'] = url
            item['title'] = sel.find_element_by_css_selector('.extDirectoryTitle').text
            item['addr'] = sel.find_element_by_css_selector('.extDirectoryOffice').text
            item['phone'] = sel.find_element_by_css_selector('.extDirectoryPhone').text
            item['email'] = sel.find_element_by_css_selector('.extDirectoryEmail a').text
            #Go to homepage and parse the area
            request = scrapy.Request(url, callback=self.parse_prof_homepage)
            request.meta['item'] = item
            yield request
            #yield item
        #self.driver.close()
        #self.driver2.close()

    def parse_prof_homepage(self, response):
        item = response.meta['item']
        self.driver2.get(response.url)
        time.sleep(1)
        areaStr = u''
        for areaLi in self.driver2.find_elements_by_css_selector('.extProfileAffiliationsPrimaryArea li'):
            areaStr = areaStr.join(areaLi.text)
        item['area'] = areaStr
        return item
