# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy

class ProfessorItem(scrapy.Item):
	name = scrapy.Field()
	title = scrapy.Field()
	phone = scrapy.Field()
	addr = scrapy.Field()
	email = scrapy.Field()
	area = scrapy.Field()
	img = scrapy.Field()
	url = scrapy.Field()
	edu = scrapy.Field()
	cont = scrapy.Field()
	