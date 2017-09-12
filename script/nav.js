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
  var navHomepagePos = $(window).height()-52;
  /*
  ---------------------------------------------
  */

  // The secondary page that is currently selected
  // Check for the active page last time user was here (url anchor)
  // 'About' will be our failsafe default.
  var activePage = $(pageIds[0]);
    
  var pageUrl = window.location.href;
  pageUrl = pageUrl.substring("hackOHIO2017/index.html");
    
  //check for page anchor
  if (pageUrl.indexOf("#") > -1){
      var pageAnchor = pageUrl.substring(pageUrl.indexOf("#"))
      if (pageAnchor != "#home-back"){
        activePage = $(pageAnchor)          
      }
  }

  if (!isMobile()) {
    /* ---------- */
    /* NON MOBILE */
    /* ---------- */

    /* Remove mobile nav */
    //$("#mobilenav").remove();

    /* Hide every page but first one */
    for (var i=0; i<pageIds.length; i++) {
      $(pageIds[i]).hide();
    }
    activePage.show();

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
        document.cookie = "activePage="+activePage;
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

  } else {
    /* ------ */
    /* MOBILE */
    /* ------ */

    /* Add mobile navbar */
    /* Do it this way so that the mobilenav does not flash on desktop. */  
    $("#mobilenav").show();
      
    /* Remove non-mobile elements */
    $("#nav").remove();
    $("#tv").remove();
    $("#home-back").remove();

    /* Add space at top of page */
    $("#homepage").prepend("<br /><br /><br /><br />");


    /* Hide every page but homepage */
    var hideAllPages = function() {
      for (var i=0; i<pageIds.length; i++) {
        $(pageIds[i]).hide();
      }
    };
    hideAllPages();

    /* Opens and closes navbar */
    $("#mobilenav-sandwich").click(function(){
      if ($("#mobilenav").hasClass("responsive")) {
        $("#mobilenav").removeClass("responsive");
      } else {
        $("#mobilenav").addClass("responsive");
      }
    });

    /* Close navbar when link is clicked */
    $(".mobilenav-btn").click(function(){
      $("#mobilenav").removeClass("responsive");

      /* Hide all pages */
      //$("#tv").hide();
      $("#homepage").hide();
      hideAllPages();

      /* Unhide clicked page */
      var href = $(this).attr("href");
      $(href).show();

      /*
      if (href == "homepage") {
        $("#tv").show();
      }*/
    });
  }
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

/*
Detect mobile
*/
function isMobile() {
  var isMobile = false;
  // Regex to check for mobile
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
  || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

  return isMobile;
}
