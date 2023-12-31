function fetchStations(callback) {
    fetch('https://apis.is/petrol')
        .then(response => response.json())
        .then(json => callback(null, json))
        .catch(error => callback(error, null))
}

fetchStations((error, stations) => {
    if (error) { console.log(error); }

    else {
        const all_stations = 'all_stations';
        const favorite_stations = 'favorites';

        const existingArray = JSON.parse(localStorage.getItem('fav_stations'));
        for (let i = 0; i < stations['results'].length; i++) {

            station_key = stations['results'][i]['key'];
            station_name = stations['results'][i]['name'];
            station_bensin = stations['results'][i]['diesel'];
            station_diesel = stations['results'][i]['bensin95'];

            generateStationCard(all_stations, station_key, station_name, station_bensin, station_diesel);
            if (existingArray != null && existingArray.length > 1) {
                for (let j = 0; j < existingArray.length; j++) {
                    if (existingArray[j] == station_key) {
                        generateStationCard(favorite_stations, station_key, station_name, station_bensin, station_diesel);
                    }
                }
            }
        }
        console.log(existingArray);
    }
});

function generateStationCard(where, station_id, station_name, station_bensin, station_diesel) {
    let newDiv = document.createElement('div');
    newDiv.setAttribute('id', station_id);
    newDiv.classList.add('station_card');

    let card_name = document.createElement('p');
    let card_bensin = document.createElement('p');
    let card_diesel = document.createElement('p');

    let card_fav_button = document.createElement('button');
    if (where == 'all_stations') {
        card_fav_button.innerHTML = '+';
        card_fav_button.classList.add('btn_add');
        card_fav_button.setAttribute('onclick', 'localStorageAdd(this.id)');
    }
    else {
        card_fav_button.innerHTML = 'x';
        card_fav_button.classList.add('btn_remove');
        card_fav_button.setAttribute('onclick', 'localStorageRemove(this.id)');
    }
    card_fav_button.setAttribute('id', station_id);

    let name_node = document.createTextNode(station_name);
    let bensin_node = document.createTextNode(station_bensin);
    let diesel_node = document.createTextNode(station_diesel);

    card_name.appendChild(name_node);
    card_bensin.appendChild(bensin_node);
    card_diesel.appendChild(diesel_node);

    newDiv.appendChild(card_name);
    newDiv.appendChild(card_bensin);
    newDiv.appendChild(card_diesel);
    newDiv.appendChild(card_fav_button);

    document.getElementById(where).appendChild(newDiv);
}

function clearLocalStorage() {
    localStorage.clear();
    location.reload();
}

function localStorageAdd(station_id) {
    console.log(station_id);

    if (localStorage.getItem('fav_stations')) {
        const existingArray = JSON.parse(localStorage.getItem('fav_stations'));
        existingArray.push(station_id);

        localStorage.setItem('fav_stations', JSON.stringify(existingArray));
    } else {
        const newArray = [station_id];
        
        localStorage.setItem('fav_stations', JSON.stringify(newArray));
    }
    location.reload();
}

function localStorageRemove(station_id) {
    const existingArray = JSON.parse(localStorage.getItem('fav_stations'));
    for (let i = 0; i < existingArray.length; i++) {
        if (existingArray[i] == station_id) {
            existingArray.splice(i, 1);
            localStorage.setItem('fav_stations', JSON.stringify(existingArray));
        }
    }
    location.reload()
}