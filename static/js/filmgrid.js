
var scale = 1.8;

var movie_w = 80*scale;
var movie_h = 110*scale;

var sep_x = 15;
var sep_y = 15;

var move_x = movie_w+sep_x;
var move_y = movie_h+sep_y;

var movies_tall = 9; // has to be odd
var movies_wide = 15;

var grid_mover_w = sep_x*(movies_wide+1) + movie_w*movies_wide; 
var grid_mover_h = sep_y*(movies_tall+1) + movie_h*movies_tall; 

var row_labels = ["2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"];
var col_labels = ["Action", "Romance", "Comedy", "Documentary", "Children's", "Mystery", "Horror", "Sci-Fi", "Indie", "Foo", "Bar", "XX", "YY", "ZZ", "AA", "BB", "CC"];

$(document).ready(function() {
  
  $("#grid-mover").width(grid_mover_w).height(grid_mover_h);

  for(var i=0;i<movies_wide;i++) {
    for(var j=0;j<movies_tall;j++) {
      var $movie = $('<div class="movie row'+i+'_col'+j+'" ><div class="overlay"></div>'+i+','+j+'</div>');
      $movie.css({"left" : sep_x + (movie_w+sep_x)*i, "top" : sep_y + (movie_h+sep_y)*j});
      $movie.css({"width" : movie_w, "height" : movie_h});
      $movie_img = $('<img>').attr("src", "/static/images/the-dilemma-original.jpeg");
      $movie.append($movie_img);
      if(i == parseInt(movies_wide/2) && j == parseInt(movies_tall/2)) {
        $movie.addClass("middle");
      }
      $("#grid-mover").append($movie);
    }
  }

  $("#grid").height($(window).height()-30);
  $("#shadow-left, #shadow-right").height($(window).height()-30);
  $("#grid").width($(window).width()-400);
  $("#shadow-top, #shadow-bottom").width($(window).width()-400);
  $("#grid-side").width($(window).width()-400);

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

  
  $("body").keydown(function(event) {
    var new_left = parseInt($("#grid-mover").css("left").replace("px", ""));
    var new_top = parseInt($("#grid-mover").css("top").replace("px", ""));    
    if(event.keyCode == 37) {
      new_left = new_left - move_x;
    } else if(event.keyCode == 38) {
      new_top = new_top - move_y;
    } else if(event.keyCode == 39) {
      new_left = new_left + move_x;
    } else if(event.keyCode == 40) {
      new_top = new_top + move_y;
    }
    var animate_speed = 250;
    $("#grid-mover").animate({"left": new_left, "top": new_top}, animate_speed);
    $("#row-labels-mover").animate({"top": new_top}, animate_speed);   
    $("#col-labels-mover").animate({"left": new_left}, animate_speed);   
    return false; 
  });
  
});