$(document).ready(function() {
    // Set up event listener for each button
    let buttons = document.getElementsByClassName("toggle-button");
    for (i=0; i<buttons.length; i++) {
        let button = buttons[i];
        var children = button.children;
        for (j=0; j<children.length; j++) {
            // Set if we see cookies 
            if (getCookie("about-state")) {
                Array.from(children).map((child) => {
                    child.classList.remove("selected");
                });
                s = getCookie("about-state");
                if (s == "about") {
                    document.getElementById("about-page-btn").classList.add("selected");
                    showSelected("about-page", ["media-page"]);
                }
                if (s == "media") {
                    document.getElementById("media-page-btn").classList.add("selected");
                    showSelected("media-page", ["about-page"]);
                }
            }
            // Listener for toggling a button
            children[j].addEventListener("click", function () {
                Array.from(children).map((child) => {
                    child.classList.remove("selected");
                });
                this.classList.add("selected");
                if (this.id == "about-page-btn") {
                    showSelected("about-page", ["media-page"]);
                    document.cookie = "about-state=about";
                }
                if (this.id == "media-page-btn") {
                    showSelected("media-page", ["about-page"]);
                    document.cookie = "about-state=media";
                }
            });

        }
    }
});

function showSelected(eToShow, listToHide) {
    document.getElementById(eToShow).style.display = "block";
    listToHide.map((ele)=>{document.getElementById(ele).style.display = "none";})
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}
