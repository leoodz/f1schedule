async function getSchedule() {
    let data = localStorage.getItem('scheduleData');
    if (data) {
        showRaces(JSON.parse(data));
    } else {
        try {
            const apiUrl = "https://ergast.com/api/f1/current.json";
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('scheduleData', JSON.stringify(data));
                showRaces(data);
            } else {
                console.error(response.statusText);
            }
        } catch (error) {
            console.error("An error occurred while fetching the data:", error);
        }
    }
}

function showRaces(data) {
    const races = data.MRData.RaceTable.Races;
    races.forEach((element) => {
        showNextRace(element)
    });
}

async function getDriverStanding() {
    const localStorageKey = 'driverStanding';
    let data = localStorage.getItem(localStorageKey);

    if (!data) {
        try {
            const apiUrl = "https://ergast.com/api/f1/current/driverStandings.json";
            const response = await fetch(apiUrl);
            if (response.ok) {
                data = await response.json();
                localStorage.setItem(localStorageKey, JSON.stringify(data));
            } else {
                console.error(`API error: ${response.status} ${response.statusText}`);
                return;
            }
        } catch (error) {
            console.error("An error occurred while fetching the data.", error);
            return;
        }
    } else {
        data = JSON.parse(data);
    }

    const standing = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    const html = standing.map((item) => `
      <tr id="tb" class="sa">
        <td id="round">${item.position}</td>
        <td id="time">${item.Driver.givenName} ${item.Driver.familyName} (${item.Driver.code}${item.Driver.permanentNumber})</td>
        <td>${item.Driver.nationality}</td>
        <td id="location">${item.Driver.permanentNumber}</td>
        <td id="name">${item.points}</td>
        <td id="win">${item.wins}</td>
      </tr>
    `).join('');

    document.getElementById("driverStanding").innerHTML = html;
}

async function getConstructorStanding() {
    const localStorageKey = 'constructorStanding';

    let data = localStorage.getItem(localStorageKey);

    if (!data) {
        try {
            const apiUrl = "https://ergast.com/api/f1/current/constructorStandings.json";
            const response = await fetch(apiUrl);
            if (response.ok) {
                data = await response.json();
                localStorage.setItem(localStorageKey, JSON.stringify(data));
                // data = JSON.parse(data);
            } else {
                console.error(`API error: ${response.status} ${response.statusText}`);
                return;
            }
        } catch (error) {
            console.error("An error occurred while fetching the data.", error);
            return;
        }
    }

    data = JSON.parse(data);
    const standing = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    const html = standing.map((item) => `
      <tr id="tb" class="sa">
        <td id="round">${item.position}</td>
        <td id="time">${item.Constructor.name}</td>
        <td>${item.Constructor.nationality}</td>
        <td id="name">${item.points}</td>
        <td id="win">${item.wins}</td>
      </tr>
    `).join('');

    document.getElementById("constructorStanding").innerHTML = html;
}

function showNextRace(item) {
    let index = 0;
    if (Date.now() <= new Date(item.date)) {
        try {
            const raceDate = new Date(item.date + " " + item.time);
        } catch (error) {
            console.error(`An error occurred while parsing the date for race ${item.raceName}: ${error.message}`);
            return;
        }
        const html = `
            <tr id="tb${index}" class="sa">
                <td id="round">${item.round}</td>
                <td id="time">${new Date(item.date + " " + item.time)}</td>
                <td>${item.Circuit.circuitName}</td>
                <td id="location">${item.Circuit.Location.locality}, ${item.Circuit.Location.country}</td>
                <td id="name">${item.raceName}</td>
            </tr>
            `;
        document.getElementById("futureRaces").insertAdjacentHTML("beforeend", html);

        if (index === 0) {
            const timeElement = document.querySelector('#tb0 #time');
            timeElement.style.color = "red";

            if (!document.getElementById("demo")) {
                const demoElement = document.createElement('p');
                demoElement.setAttribute("id", "demo");
                demoElement.style.color = "black";
                demoElement.style.fontWeight = "bold";
                timeElement.appendChild(demoElement);
                showTimer(item.date + " " + item.time);
            }
        }
        index++;
    }
}

var hours = 24;

var now = new Date().getTime();

var setupTime = localStorage.getItem('setupTime');
if (setupTime == null) {
    localStorage.setItem('setupTime', now)
} else {
    if (now - setupTime > hours * 60 * 60 * 1000) {
        localStorage.clear()
        localStorage.setItem('setupTime', now);
    }
}

getSchedule();
getDriverStanding();
getConstructorStanding();

function showTimer(date) {
    // Set the date we're counting down to
    var countDownDate = new Date(date).getTime();

    // Update the count down every 1 second
    var x = setInterval(function () {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        document.getElementById("demo1").innerHTML = "Comming up next: " + days + "d " + hours + "h "
            + minutes + "m " + seconds + "s ";

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("demo1").innerHTML = "EXPIRED";
        }
    }, 1000);

}