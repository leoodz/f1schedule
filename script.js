async function getSchedule() {
    const apiUrl = "https://ergast.com/api/f1/current.json";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var races = data.MRData.RaceTable.Races;
            // console.log(data.MRData.RaceTable.Races);
            races.forEach((element) => {

                showNextRace(element)
            });

        } else {
            console.error(xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error("An error occurred while fetching the data.");
    };

    xhr.send();
}

async function getDriverStanding() {
    const apiUrl = "https://ergast.com/api/f1/current/driverStandings.json";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var standing = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
            for (item in standing) {
                var i = standing[item];
                // console.log(i);
                var html = `
                    <tr id="tb" class="sa">
                        <td id="round">${i.position}</td>
                        <td id="time">${i.Driver.givenName} ${i.Driver.familyName} (${i.Driver.code}${i.Driver.permanentNumber})</td>
                        <td>${i.Driver.nationality}</td>
                        <td id="location">${i.Driver.permanentNumber}</td>
                        <td id="name">${i.points}</td>
                        <td id="win">${i.wins}</td>
                    </tr >
                `
                document.getElementById("driverStanding").insertAdjacentHTML("beforeend", html);
            }

        } else {
            console.error(xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error("An error occurred while fetching the data.");
    };

    xhr.send();
}

async function getConstructorStanding() {
    const apiUrl = "https://ergast.com/api/f1/current/constructorStandings.json";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var standing = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
            for (item in standing) {
                var i = standing[item];
                var html = `
                    <tr id="tb" class="sa">
                        <td id="round">${i.position}</td>
                        <td id="time">${i.Constructor.name}</td>
                        <td>${i.Constructor.nationality}</td>
                        <td id="name">${i.points}</td>
                        <td id="win">${i.wins}</td>
                    </tr >
                `
                document.getElementById("constructorStanding").insertAdjacentHTML("beforeend", html);
            }

        } else {
            console.error(xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error("An error occurred while fetching the data.");
    };

    xhr.send();
}

function showNextRace(item) {
    var index = 0;
    if (Date.now() <= new Date(item.date)) {
        var html = `
            <tr id="tb${index}" class="sa">
                <td id="round">${item.round}</td>
                <td id="time">${new Date(item.date + " " + item.time)}</td>
                <td>${item.Circuit.circuitName}</td>
                <td id="location">${item.Circuit.Location.locality}, ${item.Circuit.Location.country}</td>
                <td id="name">${item.raceName}</td>
            </tr >
            `
        document.getElementById("futureRaces").insertAdjacentHTML("beforeend", html);
        if (index == 0)
            document.getElementById("tb0").style.color = "red";
        index++
    }
}

getSchedule();
getDriverStanding();
getConstructorStanding();

