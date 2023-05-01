const map = L.map('map', {
    center: [
        0, -40
    ],
    zoom: 3
});

const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

street.addTo(map);

const tectonicplates = new L.layerGroup();

d3.json('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json').then(plateData => {

    L.geoJson(plateData, {
        color: 'red',
        weight: 2
    })
        .addTo(tectonicplates)
})

const majorQuakes = new L.layerGroup();

d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson').then(geoData => {
    L.geoJSON(geoData, {
        pointToLayer: function ({ properties: { mag, place } }, latlng) {
            let depth = latlng.alt;
            return L.circleMarker(latlng, {
                radius: mag * 4,
                color: 'black',
                weight: 1,
                fillOpacity: .65,
                fillColor:
                    depth > 90 ? 'purple' :
                        depth > 70 ? 'red' :
                            depth > 50 ? 'orange' :
                                depth > 30 ? 'yellow' :
                                    depth > 10 ? 'green' : 'lime'
            }).bindPopup(`<h2>${place}<br>Magnitude: ${mag}</h2>`).addTo(majorQuakes)
        }
    })
})

L.control
    .layers(
        {
            'Street Map': street
        },
        {
            'Tectonic Plates': tectonicplates,
            'Major Earthquakes': majorQuakes
        })
    .addTo(map);


const legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
    let div = L.DomUtil.create("div", "legend")
    div.innerHTML = `<h1>Test</h1>`;
    return div
}

legend.addTo(map);