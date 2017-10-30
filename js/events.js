// Spreadsheet URL
var sheetURL = 'https://docs.google.com/spreadsheets/d/1fbtCptVlhUuUrm-JdBelXlSyyLAlgQDUDIV8NMVpxNU/edit#gid=0';

// Load into table
var target = $("#sheetrock-load");
target.empty();
target.sheetrock({
  url: sheetURL,
  query: "select * order by C desc",
  fetchSize: 4, // This fetches one less than you expect because of header row
  callback: sheetrockCallback,
  reset: false // Set = true if refreshing data
});

function sheetrockCallback() {
  var table = $("#sheetrock-load");
  var rows = table.find("tr");

  // Iterate through event data - skipping 0 because its the header
  for (var i=1; i<rows.length; i++) {
    var event = parseEvent(jQuery.makeArray(rows[i].children));
    $("#community-header").after(event);
  }
}

function parseEvent(data) {
  var title = $(data[0]).text();
  var organization = $(data[1]).text();
  var date = $(data[2]).text();
  var startTime = $(data[3]).text();
  var endTime = $(data[4]).text();
  if (endTime) endTime = "- "+endTime;
  var location = $(data[5]).text();
  var learnMore = $(data[6]).text();
  return `
  <div class="community-event">
    <div class="red-bar"></div>
    <h3 class="name">
      ${title}<br />
      <span class="event-subtext">${organization}</span>
    </h3>
    <h4 class="date">${date} @ ${startTime} ${endTime}</h4>
    <h4 class="location">${location}</h4>
    <h4 class="learn-more"><a href="${learnMore}" class="red">Learn more &gt;&gt;</a></h4>
  </div>
  <br />
  `;
}
