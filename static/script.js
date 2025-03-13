let qiblaBearing = 0;
let deviceHeading = 0;

document.getElementById('getLocation').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                document.getElementById('coords').textContent = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
                calculateQibla(lat, lon);
            },
            error => {
                alert('Error getting location: ' + error.message);
                document.getElementById('coords').textContent = 'Unable to get location';
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

function calculateQibla(lat, lon) {
    fetch('/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lon })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            qiblaBearing = data.bearing;
            document.getElementById('direction').textContent = `${qiblaBearing.toFixed(2)}° from North`;
            updateCompass();
        }
    })
    .catch(error => {
        alert('Error calculating Qibla: ' + error.message);
    });
}

// Device Orientation (Compass) Support
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(event) {
        if (event.alpha !== null) {  // Alpha is the compass heading
            deviceHeading = event.alpha;  // 0° is North, clockwise
            document.getElementById('heading').textContent = `${deviceHeading.toFixed(2)}°`;
            updateCompass();
        }
    });
} else {
    document.getElementById('heading').textContent = 'Device compass not supported';
}

function updateCompass() {
    const compass = document.getElementById('compass-circle');
    const kaaba = document.getElementById('kaaba');
    
    // Rotate compass based on device heading (opposite direction to align with real North)
    compass.style.transform = `rotate(${-deviceHeading}deg)`;
    
    // Rotate Kaaba to point to Qibla (adjusted by device heading)
    const kaabaAngle = qiblaBearing - deviceHeading;
    kaaba.style.transform = `translate(-50%, -50%) rotate(${kaabaAngle}deg)`;
}