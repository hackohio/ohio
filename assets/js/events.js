// Spreadsheet URL
const sheetURL = 'https://docs.google.com/spreadsheets/d/1fbtCptVlhUuUrm-JdBelXlSyyLAlgQDUDIV8NMVpxNU/edit#gid=0';

const numOfEventsToShow = 7;

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

    // Iterate through event data (sheet rows) - skipping 0 because it is the header
    var lastEvent = $("#community-header");

    var eventsToShow = numOfEventsToShow;
    for (var i=1; i<rows.length && eventsToShow>0; i++) {
        var event = parseEvent(jQuery.makeArray(rows[i].children));

        // Make sure the event is not null
        if (event) {
            eventsToShow -= 1;
            lastEvent.after(event)
            lastEvent = $("#community .community-event").last();
        }
    }
}

function parseEvent(data) {
    var title = $(data[0]).text();
    var organization = $(data[1]).text();

    var date = $(data[2]).text();
    var dateExtRaw = $(data[3]).text();
    if (dateExtRaw) {
        // Overly complicated regexp to extract multiple dates in a string into an array of dates
        // var datesExt = dateExtRaw.match(/([^,]*,[^,]*),?/g).map(x => x.trim().replace(/(^,)|(,$)/g, ""));
        date = dateExtRaw;
    }

    var startTime = $(data[4]).text();
    if (startTime) startTime = "@ "+startTime;
    var endTime = $(data[5]).text();
    if (endTime) endTime = "- "+endTime;

    var location = $(data[6]).text();
    var learnMore = $(data[7]).text();

    // Check if there is a title
    if (!title) {
        return null;
    }

    var learnMoreLink = '';
    if (learnMore) {
        // Add http if not present using regexp: /^(http|https):\/\// )
        if (!(/^(http|https):\/\//.test(learnMore))) {
            learnMore = "http://"+learnMore;
        }
        learnMoreLink = `<h4 class="learn-more"><a href="${learnMore}" class="red">Learn more &gt;&gt;</a></h4>`;
    }

    return `
        <br />
        <div class="community-event">
        <div class="red-bar"></div>
        <h3 class="name">
            ${title}<br />
            <span class="event-subtext">${organization}</span>
        </h3>
        <h4 class="date">${date} ${startTime} ${endTime}</h4>
        <h4 class="location">${location}</h4>
        ${learnMoreLink}
        </div>
    `;
}
