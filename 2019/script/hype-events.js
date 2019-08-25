$(document).ready(function() {
    // Spreadsheet URL
    var sheetURL = 'https://docs.google.com/spreadsheets/d/1fbtCptVlhUuUrm-JdBelXlSyyLAlgQDUDIV8NMVpxNU/edit#gid=0';

    $('#hype-events-list').empty();
    $('#hype-events-list').sheetrock({
        url: sheetURL,
        query: "select * where dateDiff(C, now()) >= -1 and I='y' order by C asc",
        callback: formatTable,
        reset: true
    });

    function formatTable() {
        var table =  $('#hype-events-list');
        table.find('thead').remove();

        var rows =  table.find('tr');
        for (var i=0; i<rows.length; i++) {
            $('#hype-events').append(parseEvent(rows[i]));
        }
    }

    function parseEvent(row) {
        var title = row.getElementsByTagName('td')[0].innerHTML;
        var date = row.getElementsByTagName('td')[2].innerHTML
        var endTime = row.getElementsByTagName('td')[5].innerHTML ? ' - ' + row.getElementsByTagName('td')[5].innerHTML : '';
        var time = row.getElementsByTagName('td')[4].innerHTML + endTime;
        var location = row.getElementsByTagName('td')[6].innerHTML;
        var link = row.getElementsByTagName('td')[7].innerHTML;
        link = link ? '<h4><a href="' + link + '"> Learn more >> </a></h4>' : '';

        return '<div class="event"><h3>' + title + '</h3>'
            + '<h5>' + date + ' | ' + time + ' | ' + location + '</h5>'
            + link + '</div>';
    }
});