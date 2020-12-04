
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/navigation-guidance-day-v4', // stylesheet location
center: hike.geometry.coordinates,  // starting position [lng, lat]
zoom: 8 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

// marker opens popup w/ local info
new mapboxgl.Marker()
    .setLngLat(hike.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${hike.title}</h3><p>${hike.location}</p>`
        )
    )
    .addTo(map);
