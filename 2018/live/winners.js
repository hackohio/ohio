const sheetURL = 'https://docs.google.com/spreadsheets/d/1RS6A3wts3DRUQFr4vkRnUHjIu_6T1JvOC8KbQteDjMo/edit#gid=0';

$("#load-winners").sheetrock({
    url: sheetURL,
    query: "select A, B ",
    callback: sheetrockCallback
});

function sheetrockCallback(error, options, response) {
    // Sheet rock will automatically load the whole table so clear it before formatting our own data
    $("#load-winners").empty();

    for (let i = 1; i < response.rows.length; i++) {
        const event = parseEvent(response.rows[i].cellsArray);
        if (event) {
            $("#load-winners").append(event);
        }
    }
}

function parseEvent(data) {
    const team = data[0];
    const company = data[1].split(":")[0];
    const challenge = data[1].split(":")[1];

    if (!team) {
        return null;
    } else if (team === 'TEAM') {
        return `
        <tr>
            <td style="padding: 5px; width: 30%">
                <b>
                    <a style="font-size: 140%">Team</a>
                </b>
                <br>
                <br>
            </td>
            <td style="padding: 5px;">
                <b>
                    <a style="font-size: 140%">Category</a>
                </b>
                <br>
                <br>
            </td>
        </tr>
        `;
    } else if (team === 'FINALIST') {
        return `
        </table>
        <br><br>
        <table>
        <tr>
            <td style="padding: 5px; width: 30%">
                <b>
                    <a style="font-size: 140%">Finalist</a>
                </b>
                <br>
                <br>
            </td>
        </tr>
        `;
    } else if (!challenge) {
        const category = data[1];

        return `
        <tr style="line-height: 35px;">
            <td style="padding: 5px; width: 30%">
                <b style="font-size: 140%">
                    ${team}
                </b>
            </td>
            <td style="padding: 5px;">
                <b>
                    ${category}
                </b>
            </td>
        </tr>
        `;
    } else {
        return `
        <tr style="line-height: 35px;">
            <td style="padding: 5px; width: 30%">
                <b style="font-size: 140%">
                    ${team}
                </b>
            </td>
            <td style="padding: 5px;">
                <b>
                    <a>${company}</a>: ${challenge}
                </b>
            </td>
        </tr>
      `;
    }
}
