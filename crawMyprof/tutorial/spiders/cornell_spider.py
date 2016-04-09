import scrapy
from tutorial.items import ProfessorItem


class cornell(scrapy.Spider):
    name = "cornell"
    start_urls = [
        "https://www.cs.cornell.edu/people/faculty",
    ]

    def parse(self, response):
        for sel in response.css(".person"):
            item = ProfessorItem()
            item['name'] = sel.css(".info a::text").extract()[0]
            item['url']=sel.css(".info a::attr('href')").extract()[0]
            item['img']="http://www.cs.cornell.edu"+sel.css("img::attr('src')").extract()[0]
            if(sel.css(".info").re(r"(.*Professor)")):item['title']=sel.css(".info").re(r"(.*Professor)")[0].strip().replace(u'<p>',u'')
            elif(sel.css(".info").re(r"(.*Lecturer)")):item['title']=sel.css(".info").re(r"<p>(.*Lecturer)")[0]
            else:item['title']=sel.css(".info").re(r"<p>(.*Scientist)")[0]
            if(sel.css(".info a::attr('href')").re(r"edu/(.*)")):item['email']=sel.css(".info a::attr('href')").re(r"edu/(.*)")[0].replace(u'~',u'').replace(u'/',u'')+"@cs.cornell.edu"
            item['area']=sel.css(".info").re(r"Res.*cus(.*)<")[0].strip().replace(u'</strong>',u'').replace(u'</b>','').replace(u':','')
            yield item