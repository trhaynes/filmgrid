
var scale = .8;

var movie_w = 185*scale;
var movie_h = 278*scale;

var middle_w = movie_w + 60;
var middle_h = movie_h + 60;

$("<style type='text/css'> .middle { width: "+middle_w+"px !important; height: "+middle_h+"px !important } .middle img { height: "+middle_h+"px !important; } </style>").appendTo("head");

var sep_x = 15;
var sep_y = 15;

var move_x = movie_w+sep_x;
var move_y = movie_h+sep_y;

var col_labels = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010"];
var row_labels = ["History", "Action", "Adventure", "Comedy", "Thriller", "Musical", "Science Fiction"];

var movies_tall = row_labels.length;
var movies_wide = col_labels.length;

var middle_x = parseInt(movies_wide/2);
var middle_y = parseInt(movies_tall/2);

var grid_mover_w = sep_x*(movies_wide+1) + movie_w*movies_wide; 
var grid_mover_h = sep_y*(movies_tall+1) + movie_h*movies_tall; 

$(document).ready(function() {
  
  $("#grid-mover").width(grid_mover_w).height(grid_mover_h);

  for(var i=0;i<movies_wide;i++) {
    for(var j=0;j<movies_tall;j++) {
      var $movie = $('<div class="movie row'+i+'_col'+j+'" ></div>');
      $movie.css({"left" : sep_x + (movie_w+sep_x)*i, "top" : sep_y + (movie_h+sep_y)*j});
      $movie.css({"width" : movie_w, "height" : movie_h});
      var year = col_labels[i];
      var genre = row_labels[j];
      console.log(year);
      console.log(genre);
      if(movies[genre][year]['cover']) {
        $movie_img = $('<img>').attr("src", movies[genre][year]['cover']).css("height", movie_h+"px");
        $movie.append($movie_img);
        if(i == middle_x && j == middle_y) {
          $movie.addClass("middle");
          if(movies[genre][year]['mid']) {
            $("img#bigposter").attr("src", movies[genre][year]['mid']);
          } else {
            $("img#bigposter").attr("src", movies[genre][year]['cover']);
          }
          $("#title").html(movies[genre][year]['name']);
        }
        $("#grid-mover").append($movie);
      }
    }
  }

  var detail_width = 250;

  $("#grid").height($(window).height()-30);
  $("#shadow-left, #shadow-right").height($(window).height()-30);
  $("#grid").width($(window).width()-detail_width);
  $("#shadow-top, #shadow-bottom").width($(window).width()-detail_width);
  $("#grid-side").width($(window).width()-detail_width);

  var t = -1*(grid_mover_h - $("#grid").height())/2.0;  
  var l = -1*(grid_mover_w - $("#grid").width())/2.0;
  $("#grid-mover").css({"top": t+"px" , "left": l+"px"});
  $("#row-labels-mover").css({"top": t+"px"});
  $("#col-labels-mover").css({"left": l+"px"});
  
  // $(".overlay").width(movie_w).height(movie_h);
  
  // row labels
  $("#row-labels-mover").height(grid_mover_h);
  $("#row-labels").height($("#grid").height());
  for(var i=0;i<movies_tall;i++) {
    var $label = $("<div></div>").addClass("row-label").html(row_labels[i]);
    $label.css("top", sep_y + movie_h/2 + (movie_h+sep_y)*i - 9);
    $("#row-labels-mover").append($label);
  }
  // 
  // col labels
  $("#col-labels-mover").width(grid_mover_w);
  $("#col-labels").width($("#grid").width());
  for(var i=0;i<movies_wide;i++) {
    var $labelcontainer = $("<div></div>").addClass("col-label");
    var $label = $("<div></div>").addClass("col-label-text").html(col_labels[i]);
    $labelcontainer.css("left", sep_y + (movie_w+sep_x)*i);
    $labelcontainer.css("width", movie_w+"px");
    $labelcontainer.append($label);
    $("#col-labels-mover").append($labelcontainer);
  }

  var move_speed = 250;
  
  $("body").keydown(function(event) {
    console.log(event.keyCode);
    if(event.keyCode == 37) {
      move("right");
    } else if(event.keyCode == 38) {
      move("down");
    } else if(event.keyCode == 39) {
      move("left");
    } else if(event.keyCode == 40) {
      move("up");
    } else {
      return true;
    }
    return false;
  });
  
  function move(direction) {
    $(".movie").removeClass("middle");
    var left = parseInt($("#grid-mover").css("left").replace("px", ""));
    var top = parseInt($("#grid-mover").css("top").replace("px", "")); 
    if(direction == "right") {
      left = left + move_x;
      middle_x--;
    } else if(direction == "left") {
      left = left - move_x;
      middle_x++;     
    } else if(direction == "down") {
      top = top + move_y;
      middle_y--;     
    } else if(direction == "up") {
      top = top - move_y;
      middle_y++;
    }
    $("#grid-mover").animate({"left": left, "top": top}, move_speed);
    $("#row-labels-mover").animate({"top": top}, move_speed);   
    $("#col-labels-mover").animate({"left": left}, move_speed, function() {
      $(".movie.row"+middle_x+"_col"+middle_y).addClass("middle");
    });
    var genre = row_labels[middle_y];
    var year = col_labels[middle_x];
    console.log(genre);
    console.log(year);
    $("#detail-side .inner").fadeOut("fast", function() {
      $("img#bigposter").attr("src", movies[genre][year]['mid']);
      $("#title").html(movies[genre][year]['name']);
      $("#detail-side .inner").fadeIn("fast");
    });
  }

  // XXX doesn't work?
  window.scrollTo(0,1); // hide address bar on iPad
    
  $("#grid-side").swipe({swipe: swipe, allowPageScroll: "none"});
  
  function swipe(event, direction) {
    move(direction);
  }
  

  
});