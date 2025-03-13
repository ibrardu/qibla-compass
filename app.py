from flask import Flask, render_template, request, jsonify
import math

app = Flask(__name__)

# Kaaba coordinates (Mecca)
KAABA_LAT = 21.4225
KAABA_LON = 39.8262

def calculate_qibla(lat, lon):
    """Calculate Qibla direction from given latitude and longitude."""
    lat1 = math.radians(float(lat))
    lon1 = math.radians(float(lon))
    lat2 = math.radians(KAABA_LAT)
    lon2 = math.radians(KAABA_LON)

    d_lon = lon2 - lon1
    y = math.sin(d_lon) * math.cos(lat2)
    x = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(d_lon)
    bearing = math.atan2(y, x)
    bearing_deg = math.degrees(bearing)
    bearing_deg = (bearing_deg + 360) % 360  # Normalize to 0-360
    return bearing_deg

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    lat = data.get('latitude')
    lon = data.get('longitude')

    if not (lat and lon):
        return jsonify({'error': 'Coordinates required'}), 400

    bearing = calculate_qibla(lat, lon)
    return jsonify({'bearing': bearing})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)