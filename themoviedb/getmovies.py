import tmdb

# XXX should really make Genres.getList call for this info
genres = {}
genres['Action'] = "28"
genres['Adventure'] = "12"
genres['Animation'] = "16"
genres['Comedy'] = "35"
genres['Crime'] = "80"
genres['Documentary'] = "99"

years = range(1995, 2006)
# years = range(2008, 2010)

movies_already = set();



for genre, genre_code in genres.iteritems():
    print genre, genre_code
    for year in years:
        a = tmdb.browse(year=year, genres=genre_code, order_by="rating", order="desc", min_votes=10)
        i=0
        while i < len(a) and a[i]['name'] in movies_already:
            i += 1
        if i != len(a):
            if len(a[i]['images']) > 0:
                pic = a[i]['images'][0]['cover']
                # print a[i]['images'][0].keys()
            else:
                pic = "(NA)"
            print "%s in %s: %s (%s)" % (genre, year, a[i]['name'], pic)
            movies_already.add(a[i]['name']) 
        else:
            print "%s in %s: %s" % (genre, year, "none")
