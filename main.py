#!/usr/bin/env python

from google.appengine.ext import webapp
from google.appengine.ext.webapp import util, template

import os

import sys

# from themoviedb import tmdb

class MainHandler(webapp.RequestHandler):
    def get(self):
        
        # m = tmdb.search("8 mile")
        # movie = m[0]['name'] 
        
        # 28 is action
        # a = tmdb.browse(year="2006", min_rating=8, genre=28, order_by="rating", order="desc", min_votes=10)
        
        path = os.path.join(os.path.dirname(__file__), "templates", "index.html")
        self.response.out.write(template.render(path, {}))

def main():
    application = webapp.WSGIApplication([('/', MainHandler)], debug=True)
    util.run_wsgi_app(application)

if __name__ == '__main__':
    main()
