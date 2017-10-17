// Spreadsheet URL
var sheetURL = 'https://docs.google.com/spreadsheets/d/1rYsXV5RHJml1RUyHrZDf3bQZOK4UHIBC1BA9wJupQ9Q/edit#gid=0';

// Load into table
var target = $("#sheetrock_load");
target.sheetrock({
  url: sheetURL,
  query: "select B, A order by B desc",
  fetchSize: 5,
  callback: sheetrockCallback
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
    parent.children("tr").last().html(cols[i].innerHTML);
  }
}
