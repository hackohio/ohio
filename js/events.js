// Spreadsheet URL
const sheetURL = 'https://docs.google.com/spreadsheets/d/1fbtCptVlhUuUrm-JdBelXlSyyLAlgQDUDIV8NMVpxNU/edit#gid=0';

const numOfEventsToShow = 3;

// Load into table
var target = $("#sheetrock-load");
target.empty();
target.sheetrock({
  url: sheetURL,
  query: "select * where dateDiff(C, now()) >= -1 order by C asc",
  callback: sheetrockCallback,
  reset: false // Set = true if refreshing data
});

function sheetrockCallback() {
  var table = $("#sheetrock-load");
  var rows = table.find("tr");

  // Iterate through event data - skipping 0 because its the header
  var lastEvent = $("#community-header");
  var lim = numOfEventsToShow+1 < rows.length ? numOfEventsToShow+1 : rows.length;
  for (var i=1; i<lim; i++) {
    var event = parseEvent(jQuery.makeArray(rows[i].children));
    lastEvent.after(event)
    lastEvent = $("#community .community-event").last();
  }

  // Un-comment once we create view all page
  /*
  if (numOfEventsToShow+1 < rows.length) {
    lastEvent.after(`
      <br />
      <div class="center">
        <a href="#" class="red">View all events &gt;&gt;</a>
      </div>
    `);
  }
  */
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
  <br />
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
  `;
}
