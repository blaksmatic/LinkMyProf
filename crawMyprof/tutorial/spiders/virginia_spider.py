import scrapy
from tutorial.items import ProfessorItem


class virginia(scrapy.Spider):
    name = "virginia"
    start_urls = [
        "http://www.cs.virginia.edu/people/faculty/",
    ]


    def parse(self, response):
         for sel in response.css('tr'):
            if(sel.re(r"Research Interests:")):
                item = ProfessorItem()
                item['name']=sel.css("h3::text").extract()[0]
                item['img']="http://www.cs.virginia.edu/people/faculty/"+sel.css("img::attr('src')").extract()[0]
                item['url']="http://www.cs.virginia.edu/people/faculty/"+sel.css("a::attr('href')").re(r"mailto:(.*)@")[0]+".html"
                item['email']=sel.css("a::attr('href')").re(r"mailto:(.*)")[0]
                if(sel.css("p > i::text")):item['title']=sel.css("p > i::text").extract()[0]
            	else:item['title']=sel.css("p > em::text").extract()[0]
            	if(sel.re(r"Research Interests:</b>(.*)")):item['area']=sel.re(r"Research Interests:</b>(.*)")[0].replace(u'</p>','').replace(u'</td>','').replace(u'</tr>','').replace(u'\r','')
            	else:item['area']=sel.re(r"Research Interests: </b>(.*)")[0].replace(u'</p>','').replace(u'</td>','').replace(u'</tr>','').replace(u'\r','')
                yield item