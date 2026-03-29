# Google Maps API Setup Guide

This guide will help you set up Google Maps integration for the HALO healthcare platform.

## Overview

The Google Maps integration includes:
- **Frontend**: Responsive Google Map widget replacing the "Healthcare AI Linked Operations" block
- **Backend**: Secure geocoding proxy endpoint to keep API keys private
- **Responsive Design**: Optimized for both mobile and desktop devices

## Prerequisites

1. Google Cloud Platform account
2. Google Maps Platform API key with appropriate permissions

## Step 1: Create Google Cloud Project & Enable APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API** (for frontend map display)
   - **Geocoding API** (for backend address lookup)
   - **Places API** (required, for nearby medical services search)

## Step 2: Create API Keys

### Frontend API Key (JavaScript API)
1. In Google Cloud Console, go to **APIs & Services > Credentials**
2. Click **Create Credentials > API Key**
3. Name it: `HALO-Frontend-Maps`
4. **Restrict the key**:
   - Application restrictions: **HTTP referrers (web sites)**
   - Add your domains:
     - `http://localhost:*`
     - `http://127.0.0.1:*`
     - `https://yourdomain.com/*` (for production)
   - API restrictions: **Maps JavaScript API, Places API**

### Backend API Key (Server-side)
1. Create another API key
2. Name it: `HALO-Backend-Maps`
3. **Restrict the key**:
   - Application restrictions: **IP addresses**
   - Add your server IPs (or leave unrestricted for development)
   - API restrictions: **Geocoding API**

## Step 3: Configure Environment Variables

### Frontend Configuration
Add to your `client/.env.local`:
```env
# Google Maps JavaScript API (frontend)
VITE_GOOGLE_MAPS_API_KEY=your_frontend_api_key_here
```

### Backend Configuration
Add to your `server/.env`:
```env
# Google Maps Platform API Key (for backend geocoding)
GOOGLE_MAPS_API_KEY=your_backend_api_key_here
```

## Step 4: Verify Installation

### Frontend Dependencies
The required package is already installed:
```bash
npm install @react-google-maps/api
```

### Backend Dependencies
No additional Python packages needed (uses existing `httpx`).

## Step 5: Test the Integration

1. **Start the backend server**:
   ```bash
   cd server
   python main.py
   ```

2. **Start the frontend**:
   ```bash
   cd client
   npm run dev
   ```

3. **Verify the map loads**:
   - Navigate to the home page
   - The map should appear where the "Healthcare AI Linked Operations" block was
   - Map should be responsive (different heights on mobile vs desktop)

4. **Test the geocoding API**:
   - Visit: `http://localhost:8000/api/maps/geocode?query=New Delhi`
   - Should return geocoding results

## Features

### Enhanced GoogleMapWidget Component
- **Geolocation Permission**: Automatically requests user location on first visit
- **Responsive Design**: Adjusts height based on screen size (320px mobile, 420px desktop)
- **Nearby Medical Services**: Automatically finds and displays hospitals, clinics, pharmacies, doctors, and dentists within 5km
- **Interactive Markers**: Click on medical service markers to see details (name, rating, address)
- **Satellite View Toggle**: Switch between map and satellite view with a button
- **Smart Fallback**: Uses New Delhi, India as default if location permission is denied
- **Visual Indicators**: Shows location permission status and loading states
- **Filtered Results**: Only shows well-rated medical services (3+ stars) up to 20 locations

### Backend Geocoding Proxy
- **Endpoint**: `GET /api/maps/geocode`
- **Parameters**:
  - `query`: Address or place to geocode (required)
  - `region`: Region bias, e.g., 'in' for India (optional)
- **Security**: API key is kept server-side
- **Error Handling**: Proper HTTP status codes and error messages

## Customization

### Changing Default Location
Edit `client/src/components/GoogleMapWidget.jsx`:
```javascript
const GoogleMapWidget = ({
  center = { lat: YOUR_LAT, lng: YOUR_LNG }, // Change default location
  zoom = 11,
  marker = true,
}) => {
```

### Map Styling
The map uses these responsive container styles:
- **Mobile**: 320px height
- **Desktop**: 420px height
- **Border radius**: 12px for modern appearance

### Adding More Map Features
You can extend the component with:
- Multiple markers
- Info windows
- Custom map styles
- Drawing tools
- Places autocomplete

## Troubleshooting

### Map Not Loading
1. Check browser console for errors
2. Verify `VITE_GOOGLE_MAPS_API_KEY` is set correctly
3. Ensure the API key has Maps JavaScript API enabled
4. Check domain restrictions on the API key

### Geocoding API Errors
1. Verify `GOOGLE_MAPS_API_KEY` is set in server environment
2. Check that Geocoding API is enabled in Google Cloud Console
3. Verify API key restrictions allow your server IP

### Quota Exceeded
1. Check your Google Cloud Console for API usage
2. Enable billing if you exceed free tier limits
3. Set up quota alerts to monitor usage

## Security Best Practices

1. **Separate API Keys**: Use different keys for frontend and backend
2. **Restrict Keys**: Always add domain/IP restrictions
3. **Environment Variables**: Never commit API keys to version control
4. **Monitor Usage**: Set up alerts for unusual API usage
5. **Rotate Keys**: Regularly rotate API keys for security

## Cost Optimization

1. **Enable APIs Only When Needed**: Don't enable unused APIs
2. **Set Quotas**: Limit daily API usage to control costs
3. **Use Caching**: Cache geocoding results to reduce API calls
4. **Optimize Map Loads**: Only load maps when needed

## Support

For issues with this integration:
1. Check the [Google Maps Platform documentation](https://developers.google.com/maps/documentation)
2. Review the [React Google Maps API documentation](https://react-google-maps-api-docs.netlify.app/)
3. Check the HALO project issues on GitHub

---

**Note**: This integration replaces the previous "Healthcare AI Linked Operations" animation block with a functional, responsive Google Map that enhances the user experience by providing location-based context for healthcare services.
