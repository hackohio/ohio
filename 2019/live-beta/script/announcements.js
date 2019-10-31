// Refresh timer
setInterval(refreshTimer, 60 * 5 * 1000);
loadAnnouncements();
function refreshTimer() {
  loadAnnouncements();
}

function loadAnnouncements() {
  // Spreadsheet URL
  var sheetURL = 'https://docs.google.com/spreadsheets/d/1-757M2ug4qqJ-hisgYbvnwlMmX-PWdAfApI8C2GMJ3c/edit#gid=0';

  // Load into table
  var target = $("#sheetrock_load");

  target.empty();
  target.sheetrock({
    url: sheetURL,
    query: "select A, B where A is not null and B is not null",
    fetchSize: 4,
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
        // Header
        var timeStamp = cols[i].innerHTML;
        parent.children("tr").last().html("<strong>"+timeStamp+"</strong>");
      } else {
        // Announcement
        parent.children("tr").last().html(cols[i].innerHTML);
        parent.append("<br>");
      }
    }
  }
}
