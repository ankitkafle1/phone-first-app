import {
  GoogleMap,
  MarkerF,
  useLoadScript,
} from '@react-google-maps/api';
import Constants from 'expo-constants';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Passenger = {
  id: string;
  name: string;
  status: 'ready' | 'waiting' | 'offline';
  latitude: number;
  longitude: number;
};

type DriverMapProps = {
  driverLocation: {
    latitude: number;
    longitude: number;
  };
  driverSharingLocation: boolean;
  height?: number;
  passengers: Passenger[];
  selectedPassengerId: string;
  onSelectPassenger: (passengerId: string) => void;
};

const mapOptions = {
  clickableIcons: false,
  disableDefaultUI: true,
  fullscreenControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  zoomControl: true,
};

export default function DriverMap({
  driverLocation,
  driverSharingLocation,
  height = 430,
  passengers,
  selectedPassengerId,
  onSelectPassenger,
}: DriverMapProps) {
  const apiKey =
    Constants.expoConfig?.extra?.googleMapsApiKey ??
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <MapFallback
        title="Google Maps API key needed"
        detail="Set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY to show the live Google map."
        driverLocation={driverLocation}
        driverSharingLocation={driverSharingLocation}
        passengers={passengers}
        selectedPassengerId={selectedPassengerId}
        onSelectPassenger={onSelectPassenger}
      />
    );
  }

  return (
    <LoadedGoogleMap
      apiKey={apiKey}
      driverLocation={driverLocation}
      driverSharingLocation={driverSharingLocation}
      height={height}
      passengers={passengers}
      selectedPassengerId={selectedPassengerId}
      onSelectPassenger={onSelectPassenger}
    />
  );
}

function LoadedGoogleMap({
  apiKey,
  driverLocation,
  driverSharingLocation,
  height = 430,
  passengers,
  selectedPassengerId,
  onSelectPassenger,
}: DriverMapProps & { apiKey: string }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });
  const selectedPassenger = passengers.find(
    (passenger) => passenger.id === selectedPassengerId,
  );
  const mapCenter = toGooglePosition(selectedPassenger ?? driverLocation);

  if (loadError) {
    return (
      <MapFallback
        title="Google Maps could not load"
        detail="Check the API key, billing, Maps JavaScript API access, and allowed domains."
        driverLocation={driverLocation}
        driverSharingLocation={driverSharingLocation}
        height={height}
        passengers={passengers}
        selectedPassengerId={selectedPassengerId}
        onSelectPassenger={onSelectPassenger}
      />
    );
  }

  if (!isLoaded) {
    return (
      <View style={[styles.loadingMap, { height }]}>
        <Text style={styles.loadingText}>Loading Google map...</Text>
      </View>
    );
  }

  return (
    <GoogleMap
      center={mapCenter}
      mapContainerStyle={{ height, width: '100%' }}
      options={mapOptions}
      zoom={13}
    >
      <MarkerF
        icon={createMarkerIcon('#d8482f', 'D', 42)}
        position={toGooglePosition(driverLocation)}
        title={driverSharingLocation ? 'Driver location shared' : 'Driver location hidden'}
      />
      {passengers.map((passenger) => (
        <MarkerF
          key={passenger.id}
          icon={createMarkerIcon(
            getPassengerColor(passenger.status),
            getFirstName(passenger.name),
            selectedPassengerId === passenger.id ? 42 : 36,
          )}
          onClick={() => onSelectPassenger(passenger.id)}
          position={toGooglePosition(passenger)}
          title={passenger.name}
        />
      ))}
    </GoogleMap>
  );
}

function toGooglePosition(location: { latitude: number; longitude: number }) {
  return {
    lat: location.latitude,
    lng: location.longitude,
  };
}

function MapFallback({
  title,
  detail,
  driverLocation,
  driverSharingLocation,
  height = 430,
  passengers,
  selectedPassengerId,
  onSelectPassenger,
}: DriverMapProps & { title: string; detail: string }) {
  return (
    <View style={[styles.fallbackMap, { height }]}>
      <View style={styles.fallbackMessage}>
        <Text style={styles.fallbackTitle}>{title}</Text>
        <Text style={styles.fallbackDetail}>{detail}</Text>
      </View>
      <View
        style={[
          styles.fallbackDriver,
          styles.fallbackDriverRed,
          getMarkerPosition(driverLocation),
        ]}
      >
        <Text style={styles.markerText}>D</Text>
      </View>
      {passengers.map((passenger) => (
        <Pressable
          key={passenger.id}
          onPress={() => onSelectPassenger(passenger.id)}
          style={[
            styles.fallbackMarker,
            { backgroundColor: getPassengerColor(passenger.status) },
            selectedPassengerId === passenger.id && styles.selectedFallbackMarker,
            getMarkerPosition(passenger),
          ]}
        >
          <Text numberOfLines={1} style={styles.markerText}>
            {getFirstName(passenger.name)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function getRouteSegmentStyle(
  first: { latitude: number; longitude: number },
  second: { latitude: number; longitude: number },
) {
  const start = getMarkerPositionValue(first);
  const end = getMarkerPositionValue(second);
  const deltaX = end.left - start.left;
  const deltaY = end.top - start.top;
  const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

  return {
    left: `${start.left}%` as const,
    top: `${start.top}%` as const,
    transform: [{ rotate: `${angle}deg` }],
    width: `${length}%` as const,
  };
}

function createMarkerIcon(color: string, label: string, size: number) {
  const width = Math.max(size, Math.min(96, label.length * 8 + 18));
  const fontSize = label.length > 1 ? 11 : size * 0.38;
  const svg = `
    <svg width="${width}" height="${size}" viewBox="0 0 ${width} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="${width - 6}" height="${size - 6}" rx="8" fill="${color}" stroke="white" stroke-width="3"/>
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="800" fill="white">${escapeSvgText(label)}</text>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(width, size),
  };
}

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || name;
}

function getPassengerColor(status: Passenger['status']) {
  if (status === 'ready') {
    return '#1f9a63';
  }

  if (status === 'waiting') {
    return '#e4a72b';
  }

  return '#8e9692';
}

function getMarkerPosition(location: { latitude: number; longitude: number }) {
  const position = getMarkerPositionValue(location);

  return {
    left: `${position.left}%` as const,
    top: `${position.top}%` as const,
  };
}

function getMarkerPositionValue(location: { latitude: number; longitude: number }) {
  const longitudeRange = [85.305, 85.35];
  const latitudeRange = [27.675, 27.725];
  const left =
    ((location.longitude - longitudeRange[0]) /
      (longitudeRange[1] - longitudeRange[0])) *
    100;
  const top =
    (1 -
      (location.latitude - latitudeRange[0]) /
        (latitudeRange[1] - latitudeRange[0])) *
    100;

  return {
    left: Math.min(Math.max(left, 8), 92),
    top: Math.min(Math.max(top, 8), 92),
  };
}

const styles = StyleSheet.create({
  loadingMap: {
    alignItems: 'center',
    backgroundColor: '#dbe9dd',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#1f2d2b',
    fontSize: 14,
    fontWeight: '800',
  },
  fallbackMap: {
    backgroundColor: '#dbe9dd',
    overflow: 'hidden',
    position: 'relative',
  },
  fallbackMessage: {
    backgroundColor: 'rgba(255, 250, 241, 0.94)',
    borderColor: '#eadfce',
    borderRadius: 8,
    borderWidth: 1,
    left: 14,
    maxWidth: 260,
    padding: 12,
    position: 'absolute',
    top: 14,
    zIndex: 2,
  },
  fallbackTitle: {
    color: '#17211f',
    fontSize: 14,
    fontWeight: '900',
  },
  fallbackDetail: {
    color: '#66716e',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  fallbackDriver: {
    alignItems: 'center',
    borderColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 3,
    height: 42,
    justifyContent: 'center',
    marginLeft: -21,
    marginTop: -21,
    position: 'absolute',
    width: 42,
  },
  fallbackDriverRed: {
    backgroundColor: '#d8482f',
  },
  fallbackMarker: {
    alignItems: 'center',
    borderColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 3,
    height: 32,
    justifyContent: 'center',
    marginLeft: -32,
    marginTop: -16,
    paddingHorizontal: 6,
    position: 'absolute',
    width: 64,
  },
  selectedFallbackMarker: {
    borderColor: '#1f2d2b',
    transform: [{ scale: 1.12 }],
  },
  markerText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
});
