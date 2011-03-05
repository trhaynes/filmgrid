import tmdb, json

# XXX should really make Genres.getList call for this info
genres = {}
genres['Action'] = "28"
genres['Adventure'] = "12"
genres['Animation'] = "16"
genres['Comedy'] = "35"
genres['Crime'] = "80"
genres['Documentary'] = "99"
genres['Drama'] = "99"
genres['Fantasy'] = "14"
genres['History'] = "36"
genres['Horror'] = "27"
genres['Musical'] = "22"
genres['Science Fiction'] = "878"
genres['Thriller'] = "53"
genres['Western'] = "37"

# years = range(1995, 2006)
years = range(1990, 2011)

movies_already = set();

movies = {}

for genre, genre_code in genres.iteritems():
    print genre, genre_code
    movies[genre] = {}
    for year in years:
        movies[genre][year] = {}
        a = tmdb.browse(year=year, genres=genre_code, order_by="rating", order="desc", min_votes=10)
        i=0
        while i < len(a) and a[i]['name'] in movies_already:
            i += 1
        if i != len(a):
            cover = ""
            mid = ""
            if len(a[i]['images']) > 0:
                cover = a[i]['images'][0]['cover']
                try:
                    mid = a[i]['images'][0]['mid']
                except KeyError, e:
                    pass

            movies[genre][year]['cover'] = cover
            movies[genre][year]['mid'] = mid
            movies[genre][year]['name'] =  a[i]['name']
            # print "%s in %s: %s (%s)" % (genre, year, a[i]['name'], pic)
            movies_already.add(a[i]['name']) 
        else:
            print "%s in %s: %s" % (genre, year, "none")
            
print json.dumps(movies)
