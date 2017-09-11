/*
Ethan Wolfe
Requires Jquery
-----------
*/
$(document).ready(function() {
  /*
  ------- SET THIS USING NAVBAR HREFs -------
  */
  var pageIds = ["#about-page", "#hypeevents-page","#prizes-page",
                  "#faq-page", "#sponsorlist-page", "#schedule-page",
                  "#stats-page"
                ];
  /*
  ------- SET THIS USING NAVBAR CSS -------
  */
  // Should be the same value as #nav { top }
  var navHomepagePos = $(window).height()*0.9;
  /*
  ---------------------------------------------
  */

  // The secondary page that is currently selected
  var activePage = $(pageIds[0]);

  /* Hide every page but first one */
  for (var i=1; i<pageIds.length; i++) {
    $(pageIds[i]).hide();
  }

  /*
  Allows for first page to be scrolled
  If the first page has NOT been fully scrolled, its position must
      be relative
  If the first page has been fully scrolled, its position must
      be fixed so that the next page can scroll over
  */
  $("#home-back").css({height: $("#homepage").height()});
  $("#home-back").hide();
  var backHidden = true;
  $(document).scroll(function(event) {
    if (activePage.isOnScreen()) {
      if (backHidden) {
        console.log("on screen");
        $("#homepage").css({position: "fixed"});
        $("#home-back").show();
        backHidden = false;
      }
    } else {
      if (!backHidden) {
        console.log("not on screen");
        $("#homepage").css({position: "relative"});
        $("#home-back").hide();
        backHidden = true;
      }
    }
  });

  /*
  Sticky navbar effect:
  Detaches and prepends the nav between body and the secondary page
  depending on how far the user has scrolled
  */
  stickNavbar(); // Call once as page loads
  var navStuckOnTop = false;
  function stickNavbar() {
    var navId = "#nav";
    var nextPagePos = activePage.offset().top - $(document).scrollTop();

    var nav;
    if (nextPagePos < navHomepagePos) {
      // Attach navbar to new page
      if (!$(navId).parent().is(activePage)) {
        nav = $(navId).detach();
        activePage.prepend(nav);
      }
      // Make sure the navbar doesnt go higher than the top of the page
      if (nextPagePos <= 0) {
        if (!navStuckOnTop) {
          $(navId).css({position: "fixed"});
          navStuckOnTop = true;
        }
      } else {
        if (navStuckOnTop) {
          $(navId).css({position: ""});
          navStuckOnTop = false;
        }
      }
    } else {
      // Attach navbar back to body
      if (!$(navId).parent().is("body")) {
        nav = $(navId).detach();
        $("body").prepend(nav);
      }
    }
  }
  $(document).scroll(function(event) {
    stickNavbar();
  });

  /* Navbar click smooth scrolling */
  $("#nav a").click(function() {
    var href = $(this).attr("href");

    if (href != "#home-back") {
      lastActivePage = activePage;
      activePage = $(href);
      console.log("clicked")

      for (var i=0; i<pageIds.length; i++) {
        if (href != pageIds[i]){
          $(pageIds[i]).hide();
          //$(pageIds[i]+"-nav").removeClass("active");
        }
        else{
          $(pageIds[i]).show();
          //$(pageIds[i]+"-nav").addClass("active");
        }
        console.log(pageIds[i]);
      }

      //Re-stick the navbar when we change pages
      stickNavbar();
    }

    scrollToHref(href, 700);
  });
});

function scrollToHref(href, time=500) {
  $('html, body').animate({
    scrollTop: $(href).offset().top
  }, time);
}

$.fn.isOnScreen = function(){
  var win = $(window);

  var viewport = {
    top : win.scrollTop(),
    left : win.scrollLeft()
  };
  viewport.right = viewport.left + win.width();
  viewport.bottom = viewport.top + win.height();

  var bounds = this.offset();
  bounds.right = bounds.left + this.outerWidth();
  bounds.bottom = bounds.top + this.outerHeight();

  return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
};
