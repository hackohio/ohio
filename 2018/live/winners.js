// Refresh timer
setInterval(refreshTimer, 60 * 5 * 1000);
loadWinners();
function refreshTimer() {
    loadWinners();
}

function loadWinners() {
    console.log('loading winners');

    // Spreadsheet URL
    var sheetURL = 'https://docs.google.com/spreadsheets/d/11CxKvXnz-brevev7krbcUjEa0TZFVGUxZmqWPqgDkNg/edit#gid=0';
    // var sheetURL = 'https://docs.google.com/spreadsheets/d/1rYsXV5RHJml1RUyHrZDf3bQZOK4UHIBC1BA9wJupQ9Q/edit#gid=0';

    // Load into table
    var target = $("#load_winners");

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
        console.log(resp);
        // target.find("tr")[0].remove();

        console.log('working');

        // Split columns into rows
        console.log(target.find("tr"));
        target.find("tr").toArray().forEach(splitColumns);
    }

    function splitColumns(tableRow) {
        console.log('data');
        var cols = $(tableRow).children();
        var parent = $(tableRow).parent();
        tableRow.remove();

        for (var i = 0; i < cols.length; i++) {
            parent.append("<tr></tr>");
            if (i % 2 == 0) {
                // Header
                var timeStamp = cols[i].innerHTML;
                parent.children("tr").last().html("<strong>" + timeStamp + "</strong>");
            } else {
                // Announcement
                parent.children("tr").last().html(cols[i].innerHTML);
            }
        }
    }
}
