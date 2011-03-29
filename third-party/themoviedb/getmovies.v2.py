import tmdb, json

# genres from http://api.themoviedb.org/2.1/methods/Genres.getList
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
genres['Short'] = "10749"
genres['Sport'] = "9805"
genres['Suspense'] = "10748"
genres['Thriller'] = "53"
genres['Western'] = "37"

# years = range(2004, 2006)
years = range(1981, 2012)

movies_already = set();

movies = {}

for genre, genre_code in genres.iteritems():
    movies[genre] = {}
    for year in years:
        movies[genre][year] = []
        a = tmdb.browse(year=year, genres=genre_code, order_by="rating", order="desc", min_votes=5)
        movies_added = 0
        while movies_added < 2:
            i=0
            while i < len(a) and a[i]['name'] in movies_already:
                i += 1
            if i != len(a):
                movie = {}
                
                # grab the cover
                movie['cover'] = ""
                if len(a[i]['images']) > 0:
                    movie['cover'] = a[i]['images'][0]['cover']

                movieinfo = tmdb.getMovieInfo(a[i]['id'])

                movie['name'] =  a[i]['name']
                # movies[genre][year]['overview'] =  a[i]['overview']
                movie['rating'] =  a[i]['rating']
                movie['votes'] =  a[i]['votes']
                
                movie['actors'] = []
                for actor in movieinfo['cast']['actor']:
                    movie['actors'].append(actor['name'])
                    
                movie['directors'] = []
                for director in movieinfo['cast']['director']:
                    movie['directors'].append(director['name'])
                    
                # movies[genre][year]['year'] =  a[i]['released'].split("-")[0]
                # print "%s in %s #%s: %s (%s)" % (genre, year, movies_added, a[i]['name'], pic)
                movies[genre][year].append(movie)
                movies_already.add(a[i]['name']) 
                movies_added += 1
            else:
                pass
                # print "%s in %s: %s" % (genre, year, "none")
            
print json.dumps(movies, sort_keys=True, indent=4)
