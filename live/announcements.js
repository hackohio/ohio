// Refresh timer
setInterval(refreshTimer, 30*1000);
loadAnnouncements();
function refreshTimer() {
  loadAnnouncements();
}

function loadAnnouncements() {
  // Spreadsheet URL
  var sheetURL = 'https://docs.google.com/spreadsheets/d/1rYsXV5RHJml1RUyHrZDf3bQZOK4UHIBC1BA9wJupQ9Q/edit#gid=0';

  // Load into table
  var target = $("#sheetrock_load");
  target.empty();
  target.sheetrock({
    url: sheetURL,
    query: "select B, A order by B desc",
    fetchSize: 5,
    callback: sheetrockCallback,
    reset: true
  });

  /* This function is called after sheetrock pulls in data */
  function sheetrockCallback(err, options, resp) {
    // Hide header
    target.find("tr")[0].remove();

    // Split columns into rows
    target.find("tr").toArray().forEach(splitColumns);
  }

  function splitColumns(tableRow) {
    var cols = $(tableRow).children();
    var parent = $(tableRow).parent();
    tableRow.remove();

    for (var i=0; i<cols.length; i++) {
      parent.append("<tr></tr>");
      if (i%2==0) {
        // Time stamp
        var timeStamp = cols[i].innerHTML;
        var time = timeStamp.slice(10);
        var adjustedTime = mtimeToNormal(time);
        if (timeStamp.includes("10/16/2017")) {
          timeStamp = "Saturday "+adjustedTime;
        } else {
          timeStamp = "Sunday "+adjustedTime;
        }
        parent.children("tr").last().html("<strong>"+timeStamp+"</strong>");
      } else {
        // Announcement
        parent.children("tr").last().html(cols[i].innerHTML);
      }
    }
  }

  function mtimeToNormal(time) {
    var c = 0;
    while (time.charAt(c)!=":") c++;
    var hours = parseInt(time.slice(0,c));
    var m = c+1;
    while (time.charAt(m)!=":") m++;
    var minutes = time.slice(c,m);
    if (hours > 12) {
      hours -= 12;
      return hours+""+minutes+"pm";
    } else {
      return hours+""+minutes+"am";
    }
  }
}
