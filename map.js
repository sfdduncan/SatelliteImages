'use strict';

console.log('Loaded map.js');
mapboxgl.accessToken = 'pk.eyJ1Ijoic2ZkdW5jYW4iLCJhIjoiY2x2cjZqdHdiMDlkbDJsb2ZoZm85NHN3eSJ9.BUTbtWZMH590c2NLXDlfVA';

let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [-73.96024, 40.80877],
    zoom: 12
});

map.on('load', function() {
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    map.addControl(new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'imperial'
    }), 'bottom-right');
});

function fetchAndShowSatelliteImage() {
    const address = document.getElementById('address-input').value;
    const apiKey = 'AIzaSyDb1roMDXXuQrXRQ2g_aEg0AC8UShb0U-o';
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    fetch(geocodeUrl)
    .then(response => response.json())
    .then(data => {
        if (data.status === "OK") {
            const lat = data.results[0].geometry.location.lat;
            const lng = data.results[0].geometry.location.lng;
            const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=18&size=600x600&scale=4&maptype=satellite&key=${apiKey}`;

            const imgElement = document.getElementById('satellite-image');
            imgElement.src = mapUrl;
            imgElement.style.display = 'block';

            const downloadButton = document.getElementById('download-button');
            downloadButton.style.display = 'inline';
            downloadButton.onclick = function() { downloadImage(mapUrl); };
        } else {
            alert('Failed to retrieve location. Please check the address.');
        }
    })
    .catch(error => {
        console.error('Error fetching the geocode:', error);
        alert('Error processing your request. Check console for details.');
    });
}

function downloadImage(mapUrl) {
    fetch(mapUrl)
        .then(response => response.blob())
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob); 
            const link = document.createElement('a');
            link.style.display = 'none'; 
            link.href = blobUrl;
            link.download = 'satellite_image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl); 
        })
        .catch(error => console.error('Error downloading the image:'), error));
}
    
