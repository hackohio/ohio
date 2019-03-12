const url = 'https://raw.githubusercontent.com/hackohio/ohio/master/show/2019/teams.json';
let teams = {};

// Get teams data from JSON file; create dict of teams and info
$.getJSON(url)
  .done(data => {
    for (let team of data) {
      teams[team['shortTeamName']] = team;
    }
  })
  .fail((a, b, c) => {
    console.log("Error: ", c);
  });

// Add click listener to all team names to open modal on click
teamNames = document.getElementsByClassName('show-team');
for (let teamName of teamNames) {
  teamName.onclick = e => {
    modal = document.getElementById('show-modal');
    teamInfo = teams[e.target.innerText];
    modal.getElementsByTagName('h2')[0].innerText = teamInfo['fullTeamName'];
    modal.getElementsByTagName('h3')[0].innerText = teamInfo['teamSubtitle'];
    modal.getElementsByTagName('p')[0].innerHTML = teamInfo['teamDescription'];
    modal.style.display = 'block';
  }
}

// Add click listener to modal close button to close modal
document.getElementById('show-modal-close').onclick = () => {
  document.getElementById('show-modal').style.display = 'none';
}
