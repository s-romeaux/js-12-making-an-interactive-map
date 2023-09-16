const map = L.map('map').setView([0, 0], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let userMarker;

// Setup user star
const starIcon = L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Yellow_Star_with_rounded_edges.svg/42px-Yellow_Star_with_rounded_edges.svg.png?20211220093133',
    iconSize: [35, 35], 
    iconAnchor: [21, 42], 
    popupAnchor: [0, -42], 
});

// Get user location
async function getCoords() {
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                resolve([pos.coords.latitude, pos.coords.longitude]);
            },
            (error) => {
                console.error('Error getting user location:', error);
                resolve([0, 0]);
            },
            options
        );
    });
}

// Pull 4sq data
async function placeSearch(selection, coords) {
    try {
        const searchParams = new URLSearchParams({
            query: selection,
            ll: coords,
            open_now: 'true',
            sort: 'DISTANCE',
            limit: 5, 
        });
        const results = await fetch(
            `https://api.foursquare.com/v3/places/search?${searchParams}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: 'fsq3E9LkTpG0CAGou1iua6Wc9yY6b3pMDd+C2zlyMxaDO3M=', 
                },
            }
        );
        const data = await results.json();
        return data;
    } catch (err) {
        console.error('Error fetching data:', err);
    }
}

// Make the markers
async function createMarkers(locations, map) {
    locations.forEach((location) => {
        let position = [location.geocodes.main.latitude, location.geocodes.main.longitude];
        let marker = L.marker(position);
        marker.addTo(map).bindPopup(`${location.name} ${location.location.address}`).openPopup();
    });
}

window.onload = async () => {
    const coords = await getCoords();
    const strCoords = `${coords[0]},${coords[1]}`;
    
    // Push map & star
    map.setView(coords, 13);
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });
    tiles.addTo(map);

    userMarker = L.marker(coords, { icon: starIcon });
    userMarker.addTo(map).bindPopup('Your location').openPopup();

    // Set up buttons
    document.getElementById('cafes-button').addEventListener('click', async () => {
        const selection = 'cafes';
        console.log(selection, strCoords);
        const result = await placeSearch(selection, strCoords);
        const locations = result.results;
        console.log(locations);
        createMarkers(locations, map);
    });

    document.getElementById('restaurants-button').addEventListener('click', async () => {
        const selection = 'restaurants';
        console.log(selection, strCoords);
        const result = await placeSearch(selection, strCoords);
        const locations = result.results;
        console.log(locations);
        createMarkers(locations, map);
    });

    document.getElementById('hotels-button').addEventListener('click', async () => {
        const selection = 'hotels';
        console.log(selection, strCoords);
        const result = await placeSearch(selection, strCoords);
        const locations = result.results;
        console.log(locations);
        createMarkers(locations, map);
    });

    document.getElementById('markets-button').addEventListener('click', async () => {
        const selection = 'markets';
        console.log(selection, strCoords);
        const result = await placeSearch(selection, strCoords);
        const locations = result.results;
        console.log(locations);
        createMarkers(locations, map);
    });
};