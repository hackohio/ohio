/**
Events can be added anywhere in the JSON file. JS below will sort and order
events appropriately by date on the page.

JSON structure:
  eventName: **required**
  site: not required
  location: not required
  startDate: **required**
  endDate: not required
  description: not required
*/

const url = 'events/events.json';
let pastEvents = [];
let upcomingEvents = [];

$.getJSON(url)
  .done(data => {
    processEvents(data);
  })
  .fail((a, b, c) => {
    console.log("JSON import failed. So that's it, folks; OHI/O is cancelled forever.");
    console.log("Error: ", c);
  });

function processEvents(data) {
  splitEventsIntoPastAndUpcoming(data);
  orderPastAndUpcomingEventsChronologically();
  insertEventsIntoPage();
}

function splitEventsIntoPastAndUpcoming(data) {
  // Sort the events into past and upcoming.
  const currentDate = new Date();
  for (const event of data) {
    const eventDate = new Date(event.startDate);
    if (eventDate < currentDate) {
      pastEvents.push(event);
    } else {
      upcomingEvents.push(event);
    }
  }
}

function orderPastAndUpcomingEventsChronologically() {
  // Sort the events into correct chronological order, in past and upcoming.
  upcomingEvents.sort((e1, e2) => {
    if (new Date(e1.startDate) < new Date(e2.startDate)) {
      return -1;
    } else {
      return 1;
    }
  });
  pastEvents.sort((e1, e2) => {
    if (new Date(e1.startDate) > new Date(e2.startDate)) {
      return -1;
    } else {
      return 1;
    }
  });
}

function insertEventsIntoPage() {
  for (const event of upcomingEvents) {
    $("#events-upcoming").append(createEventBlock(event));
  }
  for (const event of pastEvents) {
    $("#events-past").append(createEventBlock(event));
  }
}

function createEventBlock(event) {
  let elem = "";
  if (event.site) {
    elem += "<h2><a href=\"" + event.site + "\">" + event.eventName + "</a></h2><p><span>";
  } else {
    elem += "<h2>" + event.eventName + "</h2><p><span>";
  }

  if (event.endDate) {
    const start = event.startDate.split(" ");
    const end = event.endDate.split(" ");
    if (start[0] == end[0]){
      elem += start[0] + " " + start[1].substring(0, start[1].length - 1) + " - " + end[1].substring(0, end[1].length - 1) + ", " + start[2];
    } else {
      elem += start[0] + " " + start[1].substring(0, start[1].length - 1) + " - " + end[0] + " " + end[1].substring(0, end[1].length - 1) + ", " + start[2];
    }
  } else {
    elem += event.startDate;
  }

  if (event.location) {
    elem += "  //  " + event.location;
  }

  elem += "</span><br />";

  if (event.description) {
    elem += event.description;
  }

  elem += "</p>";
  return elem;
}
