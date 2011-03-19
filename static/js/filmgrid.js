
$(document).ready(function() {
  
  FilmGrid.init();
  FilmGrid.draw_labels();
  FilmGrid.draw_movies(movies); // movies loaded from movies.js
  FilmGrid.resize();
  FilmGrid.bind_keys(); // for keyboard and ipad swipes

  // redraw when window is resized
  $(window).resize(FilmGrid.resize);
  
});




// using the Module Pattern: http://www.yuiblog.com/blog/2007/06/12/module-pattern/
var FilmGrid = (function() {

  // private
  
  var move_speed = 200;
  
  // width of thumbnails
  var movie_w = 148;
  var movie_h = movie_w*1.5027;
  
  // the middle film thumbnail is larger
  var middle_bigger_by = 60;
  var middle_w = movie_w + middle_bigger_by;
  var middle_h = movie_h + middle_bigger_by;

  var sep_x = 15;
  var sep_y = 15;

  var move_x = movie_w+sep_x; // amount to move when moving horizontally
  var move_y = movie_h+sep_y; // amount to move when moving vertically
  
  var start_year = 1990;
  var end_year = 2011;
  
  col_labels = [];
  for(var i=start_year;i<end_year;i++) {
    col_labels.push(String(i));
  }
  var row_labels = ["History", "Action", "Adventure", "Comedy", "Thriller", "Musical", "Science Fiction"];

  var movies_tall = row_labels.length;
  var movies_wide = col_labels.length;

  var middle_x = parseInt(movies_wide/2);
  var middle_y = parseInt(movies_tall/2);

  var grid_mover_w = sep_x*(movies_wide+1) + movie_w*movies_wide; 
  var grid_mover_h = sep_y*(movies_tall+1) + movie_h*movies_tall; 
  
  var detail_width = 300; // width of detail side
  var header_height = 30; // height of header
  
  var nav_size = 40; // width and height of the mover nav arrows
  var nav_sep = 10;
  
  var currently_moving = false;
  
  function draw_row_labels() {
    for(var i=0;i<movies_tall;i++) {
      var $label = $("<div></div>").addClass("row-label").html(row_labels[i]);
      $label.css("top", sep_y + movie_h/2 + (movie_h+sep_y)*i - 9);
      $("#row-labels-mover").append($label);
    }  
  };
  
  function draw_col_labels() {
    for(var i=0;i<movies_wide;i++) {
      var $labelcontainer = $("<div></div>").addClass("col-label");
      var $label = $("<div></div>").addClass("col-label-text").html(col_labels[i]);
      $labelcontainer.css("left", sep_y + (movie_w+sep_x)*i);
      $labelcontainer.css("width", movie_w+"px");
      $labelcontainer.append($label);
      $("#col-labels-mover").append($labelcontainer);
    } 
  };
  
  function move(direction) {
    var left = parseInt($("#grid-mover").css("left").replace("px", ""));
    var top = parseInt($("#grid-mover").css("top").replace("px", "")); 
    if(direction == "left") {
      if(middle_x == 0) { currently_moving = false; return; }
      left = left + move_x;
      middle_x--;
    } else if(direction == "right") {
      if(middle_x == movies_wide-1) { currently_moving = false; return; }
      left = left - move_x;
      middle_x++;     
    } else if(direction == "up") {
      if(middle_y == 0) { currently_moving = false; return; }
      top = top + move_y;
      middle_y--;     
    } else if(direction == "down") {
      if(middle_y == movies_tall-1) { currently_moving = false; return; }
      top = top - move_y;
      middle_y++;
    }
    $(".movie.middle").removeClass("middle");
    $("#row-labels-mover").animate({"top": top}, move_speed);   
    $("#col-labels-mover").animate({"left": left}, move_speed);
    $("#grid-mover").animate({"left": left, "top": top}, move_speed, function() {
      $(".movie.row"+middle_x+"_col"+middle_y).addClass("middle");
      currently_moving = false;
    });
    var genre = row_labels[middle_y];
    var year = col_labels[middle_x];
    $("#detail-side .inner").fadeOut("fast", function() {
      // $("img#bigposter").attr("src", movies[genre][year]['mid']);
      // $("#title").html(movies[genre][year]['name']);
      $("#detail-side .inner").fadeIn("fast");
    });

    

  }
  
  return {

    // public
    
    init: function() {
      $("<style type='text/css'> \
        .movie img { max-width: "+movie_w+"px; } \
        .middle { width: "+middle_w+"px !important; height: "+middle_h+"px !important; } \
        .middle img { max-height: "+middle_h+"px !important; max-width: "+middle_w+" !important; } \
      </style>").appendTo("head");
    },
    
    draw_movies: function(movies) {
      
      for(var i=0;i<movies_wide;i++) {
        for(var j=0;j<movies_tall;j++) {
          var $movie = $('<div class="movie row'+i+'_col'+j+'" ></div>');
          $movie.css({"left" : sep_x + (movie_w+sep_x)*i, "top" : sep_y + (movie_h+sep_y)*j});
          $movie.css({"width" : movie_w, "height" : movie_h});
          var year = col_labels[i];
          var genre = row_labels[j];
          if(movies[genre][year]['cover']) {
            // $movie_img = $('<img>').attr("src", movies[genre][year]['cover']);
            $movie_img = $('<img>');
            $movie.append($movie_img);
            if(i == middle_x && j == middle_y) {
              $movie.addClass("middle");
              if(movies[genre][year]['mid']) {
                // $("img#bigposter").attr("src", movies[genre][year]['mid']);
              } else {
                // $("img#bigposter").attr("src", movies[genre][year]['cover']);
              }
              // $("#title").html(movies[genre][year]['name']);
            }
            $("#grid-mover").append($movie);
          }
        }
      }
    },
    
    draw_labels: function() {
      draw_row_labels();
      draw_col_labels();
      
      $(".nav-arrow").width(nav_size).height(nav_size);
                
    }, 
    
    resize: function() {
      // XXX these are static, really should go elsewhere
      $("#header").height(header_height-1);
      $("#grid-mover").width(grid_mover_w).height(grid_mover_h);

      $("#grid, #grid-side").width($(document).width()-detail_width);      
      $("#detail-side").width(detail_width);
      
      $("#grid").height($(window).height()-header_height);
      
      $("#shadow-left, #shadow-right").height($(window).height()-header_height);
      $("#shadow-top, #shadow-bottom").width($(document).width()-detail_width);
            
      $("#grid-side, #detail-side, #shadow-left, \
         #shadow-right, #shadow-top").css({"top": header_height+"px"});
      
      var t = $("#grid").height()/2.0 - (middle_y+1)*(movie_h+sep_y)  + movie_h/2.0;
      var l = $("#grid").width()/2.0 - (middle_x+1)*(movie_w+sep_x) + movie_w/2.0 -1;
      
      $("#grid-mover").css({"top": t+"px" , "left": l+"px"});
      $("#row-labels-mover").css({"top": t+"px"});
      $("#col-labels-mover").css({"left": l+"px"});
      
      $("#row-labels").height($(window).height()-header_height);
      $("#col-labels").width($(document).width()-detail_width);
      
      var top_for_leftright = (($("#grid").height()-nav_size)/2.0)+"px";
      var left_for_topbottom = (($("#grid").width()-nav_size)/2.0)+"px";
      
      $("#move-left").css({
        "left": (($("#grid").width()-middle_w)/2.0-nav_size-nav_sep)+"px", 
        "top": top_for_leftright
      });

      $("#move-right").css({
        "left": (($("#grid").width()+middle_w)/2.0+nav_sep)+"px", 
        "top":  top_for_leftright
      });
      
      $("#move-up").css({
        "left": left_for_topbottom, 
        "top":  (($("#grid").height()-middle_h)/2.0-nav_size-nav_sep)+"px" // XXX why 10??
      });
      
      $("#move-down").css({
        "left": left_for_topbottom,
        "top":  (($("#grid").height()+middle_h)/2.0+nav_sep)+"px" // XXX why 10??
      });
      
    },
    
    bind_keys: function() {
      
      // key bindings for keyboard
      $("body").keydown(function(event) {
        if(event.keyCode >= 37 && event.keyCode <= 40) {
          if(currently_moving) return true;
          currently_moving = true;
          if(event.keyCode == 37) move("left");
          if(event.keyCode == 38) move("up");
          if(event.keyCode == 39) move("right");
          if(event.keyCode == 40) move("down");
          return true;
        }
        return false;
      });
      
      $("#move-left").live("click",  function() { move("left") });
      $("#move-right").live("click", function() { move("right") });
      $("#move-up").live("click",    function() { move("up") });
      $("#move-down").live("click",  function() { move("down") });
      
      // key bindings for ipad
      $("#grid-side").swipe({swipe: swipe, allowPageScroll: "none"});
      function swipe(event, direction) {
        // swipes are reversed, just think about it :)
        if(direction == "left")  move("right");
        if(direction == "right") move("left");
        if(direction == "up")    move("down");
        if(direction == "down")  move("up");
      }
      
    }
    
  }


})();