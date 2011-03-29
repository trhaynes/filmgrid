import tmdb, json, time

# genres from http://api.themoviedb.org/2.1/methods/Genres.getList
genres = {}
genres['Action'] = "28"
genres['Adventure'] = "12"
genres['Animation'] = "16"
genres['Comedy'] = "35"
# genres['Crime'] = "80"
genres['Documentary'] = "99"
genres['Drama'] = "99"
genres['Fantasy'] = "14"
# genres['History'] = "36"
genres['Horror'] = "27"
genres['Musical'] = "22"
genres['Science Fiction'] = "878"
# genres['Short'] = "10749"
# genres['Sport'] = "9805"
genres['Suspense'] = "10748"
genres['Thriller'] = "53"
genres['Western'] = "37"

# years = range(2004, 2006)
years = range(1991, 2012)

movies_already = set();

movies = {}

for genre, genre_code in genres.iteritems():
    movies[genre] = {}
    for year in years:
        movies[genre][year] = {}
        time.sleep(1)
        a = tmdb.browse(year=year, genres=genre_code, order_by="rating", order="desc", min_votes=5)
        i = 0
        while i < len(a) and a[i]['name'] in movies_already:
            i += 1
        if i != len(a):
            movie = {}
    
            # grab the cover
            movie['cover'] = ""
            if len(a[i]['images']) > 0:
                try:
                    movie['cover'] = a[i]['images'][0]['cover']
                except KeyError, e:
                    pass

            movieinfo = tmdb.getMovieInfo(a[i]['id'])

            movie['name'] =  a[i]['name']
            movie['rating'] =  a[i]['rating']
            movie['votes'] =  a[i]['votes']

            movie['overview'] =  movieinfo['overview']
    
            movie['actors'] = []
            try:
                for actor in movieinfo['cast']['actor']:
                    movie['actors'].append(actor['name'])
            except KeyError, e:
                pass
        
            movie['directors'] = []
            try:
                for director in movieinfo['cast']['director']:
                    movie['directors'].append(director['name'])
            except KeyError, e:
                pass
            
            movies[genre][year] = movie
            movies_already.add(a[i]['name']) 
            
print json.dumps(movies, sort_keys=True, indent=4)
