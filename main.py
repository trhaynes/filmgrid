#!/usr/bin/env python

from google.appengine.ext import webapp
from google.appengine.ext.webapp import util, template

import os

class MainHandler(webapp.RequestHandler):
    def get(self):
        path = os.path.join(os.path.dirname(__file__), "templates", "index.html")
        self.response.out.write(template.render(path, {}))

def main():
    application = webapp.WSGIApplication([('/', MainHandler)], debug=True)
    util.run_wsgi_app(application)

if __name__ == '__main__':
    main()
