const sheetURL = 'https://docs.google.com/spreadsheets/d/1-UUA5j1ZurP2ZsjdzH-Gd76jEegCs8EGy4rV5SuhpJI/edit#gid=0';

$('#hypeevents-table').sheetrock({
  url: sheetURL,
  query: "select * where dateDiff(C, now()) >= -1 order by C asc",
  callback: sheetrockCallback
});

function sheetrockCallback(error, options, response) {
  for (let i = 1; i < response.rows.length; i++) {
    const event = parseEvent(response.rows[i].cellsArray);
    if (event) {
      $("#hypeevents").append(event);
    }
  }
}

function parseEvent(data) {
  const eventTitle = data[0];
  if (!eventTitle) {
    return null;
  }

  const eventDescription = data[1];
  const eventDate = data[2];

  let startTime = data[3];
  if (startTime) startTime = "@ " + startTime;
  let endTime = data[4];
  if (endTime) endTime = "- " + endTime;

  const eventLocation = data[5];

  return `
  <div class="hypeevent-entry">
    <h2 class="txt-red">${eventTitle}</h2>
    <p>${eventDescription}</p>
    <h4>${eventDate} ${startTime} ${endTime} | ${eventLocation}</h4>
  </div>
  `;
}
