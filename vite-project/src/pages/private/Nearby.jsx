import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Droplets, Navigation, List, Map } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const blueIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Cache geocoding results so we don't re-fetch same location
const geocodeCache = {};

const geocodeLocation = async (locationStr) => {
  if (!locationStr) return null;

  const cacheKey = locationStr.trim().toLowerCase();
  if (geocodeCache[cacheKey]) return geocodeCache[cacheKey];

  try {
    const query = cacheKey.includes('nepal') ? locationStr.trim() : `${locationStr.trim()}, Nepal`;
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: query, format: 'json', limit: 1 },
      headers: { 'Accept-Language': 'en' },
    });
    if (res.data && res.data.length > 0) {
      const coords = { lat: parseFloat(res.data[0].lat), lng: parseFloat(res.data[0].lon) };
      geocodeCache[cacheKey] = coords;
      return coords;
    }
  } catch {
    // silently fail
  }
  return { lat: 27.7172, lng: 85.3240 };
};

const Nearby = () => {
  const [requests, setRequests] = useState([]);
  const [allGeocoded, setAllGeocoded] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [geocoding, setGeocoding] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(false);
  const [view, setView] = useState('list');
  const [radius, setRadius] = useState(10);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {
          setUserLocation({ lat: 27.7172, lng: 85.3240 });
          setLocationError(true);
        }
      );
    } else {
      setUserLocation({ lat: 27.7172, lng: 85.3240 });
      setLocationError(true);
    }
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/requests/all')
      .then(res => {
        const pending = res.data.filter(r => r.status === 'pending');
        setRequests(pending);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
        toast.error("Failed to load nearby requests");
      });
  }, []);

  // Geocode all requests once we have both requests + user location
  useEffect(() => {
    if (!userLocation || requests.length === 0) return;

    const geocodeAll = async () => {
      setGeocoding(true);
      const withCoords = await Promise.all(
        requests.map(async (req) => {
          const coords = await geocodeLocation(req.hospitalLocation);
          const dist = getDistance(userLocation.lat, userLocation.lng, coords.lat, coords.lng);
          return { ...req, coords, distance: dist };
        })
      );
      const sorted = withCoords.sort((a, b) => a.distance - b.distance);
      setAllGeocoded(sorted);
      setFiltered(sorted);
      setGeocoding(false);
    };

    geocodeAll();
  }, [userLocation, requests]);

  const applyFilters = (searchVal, radiusVal) => {
    return allGeocoded
      .filter(r =>
        r.hospitalLocation.toLowerCase().includes(searchVal.toLowerCase()) &&
        r.distance < radiusVal
      )
      .sort((a, b) => a.distance - b.distance);
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    setFiltered(applyFilters(val, radius));
  };

  const handleRadiusChange = (km) => {
    setRadius(km);
    setFiltered(applyFilters(search, km));
  };

  const handleRespond = async (requestId) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(`http://localhost:5000/api/requests/accept/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("You accepted this request! Go save a life! 🩸");
      const res = await axios.get('http://localhost:5000/api/requests/all');
      const pending = res.data.filter(r => r.status === 'pending');
      setRequests(pending);
    } catch (err) {
      if (err.response?.status === 400) toast.error(err.response.data.message);
      else toast.error("Failed to accept request. Try again!");
    }
  };

  const myId = parseInt(localStorage.getItem("user_id"));
  const displayList = filtered;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-2 md:px-0">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
            <MapPin size={22} className="text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-800">Nearby Requests</h1>
            <p className="text-xs md:text-sm text-gray-400">
              {locationError
                ? 'Showing requests in Kathmandu (location access denied)'
                : userLocation
                  ? 'Showing requests sorted by distance from you'
                  : 'Getting your location...'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by hospital or location..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 bg-white shadow-sm"
          />
          <div className="flex gap-2">
            <button onClick={() => setView('list')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition ${view === 'list' ? 'bg-red-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-500'}`}>
              <List size={14} /> List
            </button>
            <button onClick={() => setView('map')}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition ${view === 'map' ? 'bg-red-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-500'}`}>
              <Map size={14} /> Map
            </button>
          </div>
        </div>

        {/* Radius chips */}
        <div className="flex gap-2 flex-wrap mb-6">
          {[5, 10, 20, 50].map(km => (
            <button key={km} onClick={() => handleRadiusChange(km)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition ${radius === km ? 'bg-orange-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:border-orange-300'}`}>
              Within {km} km
            </button>
          ))}
          <button onClick={() => handleRadiusChange(999)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition ${radius === 999 ? 'bg-orange-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:border-orange-300'}`}>
            Show All
          </button>
        </div>

        {loading || !userLocation || geocoding ? (
          <div className="text-center text-gray-400 py-20 animate-pulse">
            {loading ? 'Loading requests...' : geocoding ? 'Locating hospitals...' : 'Getting your location...'}
          </div>
        ) : displayList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 md:p-16 text-center shadow-sm">
            <Droplets size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium text-sm">No requests found nearby</p>
            <p className="text-gray-300 text-xs mt-1">Try increasing the radius filter above</p>
          </div>
        ) : view === 'list' ? (
          <div className="space-y-3 md:space-y-4">
            {displayList.map(req => (
              <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-red-100 transition-colors">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 rounded-xl flex items-center justify-center font-black text-red-500 text-xs md:text-sm shrink-0">
                    {req.bloodGroup}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">{req.patientName}</p>
                    <p className="text-[10px] md:text-xs text-gray-400 flex items-center gap-1 truncate">
                      <MapPin size={10} className="shrink-0 text-orange-400" /> {req.hospitalLocation} · {req.unitsNeeded} units
                    </p>
                    <p className="text-[10px] text-orange-500 font-bold mt-0.5 flex items-center gap-1">
                      <Navigation size={9} /> {req.distance.toFixed(1)} km away
                    </p>
                  </div>
                </div>
                <div className="flex justify-end sm:block shrink-0">
                  {req.requesterId === myId ? (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-medium whitespace-nowrap">Your Request</span>
                  ) : (
                    <button onClick={() => handleRespond(req.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-red-600 transition shadow-sm w-full sm:w-auto">
                      Respond 🩸
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style={{ height: '500px' }}>
           
            <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[userLocation.lat, userLocation.lng]} icon={blueIcon}>
                <Popup><div className="text-xs font-bold text-blue-600">📍 You are here</div></Popup>
              </Marker>
              {radius < 999 && (
                <Circle
                  center={[userLocation.lat, userLocation.lng]}
                  radius={radius * 1000}
                  pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.05 }}
                />
              )}
              {displayList.map(req => (
                <Marker key={req.id} position={[req.coords.lat, req.coords.lng]} icon={redIcon}>
                  <Popup>
                    <div className="text-xs space-y-1 min-w-[160px]">
                      <p className="font-black text-red-600 text-sm">{req.bloodGroup}</p>
                      <p className="font-bold text-gray-800">{req.patientName}</p>
                      <p className="text-gray-500">{req.hospitalLocation}</p>
                      <p className="text-gray-400">{req.unitsNeeded} units needed</p>
                      <p className="text-orange-500 font-bold">{req.distance.toFixed(1)} km away</p>
                      {req.requesterId !== myId && (
                        <button onClick={() => handleRespond(req.id)}
                          className="w-full mt-2 bg-red-500 text-white py-1.5 rounded-lg text-[10px] font-bold hover:bg-red-600 transition">
                          Respond 🩸
                        </button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {!loading && !geocoding && userLocation && displayList.length > 0 && (
          <p className="text-center text-xs text-gray-300 mt-4">
            Showing {displayList.length} request{displayList.length !== 1 ? 's' : ''} within {radius === 999 ? 'all areas' : `${radius} km`}
          </p>
        )}
      </div>
    </Layout>
  );
};

export default Nearby;