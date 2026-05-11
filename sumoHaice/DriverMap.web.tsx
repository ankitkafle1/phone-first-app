import {
  DirectionsRenderer,
  GoogleMap,
  MarkerF,
  PolylineF,
  useLoadScript,
} from '@react-google-maps/api';
import Constants from 'expo-constants';
import { useEffect, useMemo, useState } from 'react';
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
  finalDestination: {
    name: string;
    shortName: string;
    latitude: number;
    longitude: number;
  };
  height?: number;
  passengers: Passenger[];
  routeStops: Passenger[];
  selectedPassengerId: string;
  onRouteResolved?: (summary: RouteSummary) => void;
  onSelectPassenger: (passengerId: string) => void;
};

type RouteSummary = {
  distanceKm: number;
  durationText: string;
  waypointOrder: number[];
  source: 'google' | 'fallback';
};

const mapOptions = {
  clickableIcons: false,
  disableDefaultUI: true,
  fullscreenControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  zoomControl: true,
};

const routeOptions = {
  clickable: false,
  geodesic: true,
  strokeColor: '#2d6cdf',
  strokeOpacity: 0.86,
  strokeWeight: 5,
};

export default function DriverMap({
  driverLocation,
  driverSharingLocation,
  finalDestination,
  height = 430,
  passengers,
  routeStops,
  selectedPassengerId,
  onRouteResolved,
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
        finalDestination={finalDestination}
        passengers={passengers}
        routeStops={routeStops}
        selectedPassengerId={selectedPassengerId}
        onRouteResolved={onRouteResolved}
        onSelectPassenger={onSelectPassenger}
      />
    );
  }

  return (
    <LoadedGoogleMap
      apiKey={apiKey}
      driverLocation={driverLocation}
      driverSharingLocation={driverSharingLocation}
      finalDestination={finalDestination}
      height={height}
      passengers={passengers}
      routeStops={routeStops}
      selectedPassengerId={selectedPassengerId}
      onRouteResolved={onRouteResolved}
      onSelectPassenger={onSelectPassenger}
    />
  );
}

function LoadedGoogleMap({
  apiKey,
  driverLocation,
  driverSharingLocation,
  finalDestination,
  height = 430,
  passengers,
  routeStops,
  selectedPassengerId,
  onRouteResolved,
  onSelectPassenger,
}: DriverMapProps & { apiKey: string }) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [directionsError, setDirectionsError] = useState<string | null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const directPath = useMemo(
    () => [driverLocation, ...routeStops, finalDestination].map(toGooglePosition),
    [driverLocation, finalDestination, routeStops],
  );

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const service = new google.maps.DirectionsService();
    setDirections(null);
    setDirectionsError(null);

    service.route(
      {
        destination: toGooglePosition(finalDestination),
        optimizeWaypoints: true,
        origin: toGooglePosition(driverLocation),
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: routeStops.map((stop) => ({
          location: toGooglePosition(stop),
          stopover: true,
        })),
      },
      (result, status) => {
        if (status !== google.maps.DirectionsStatus.OK || !result) {
          setDirectionsError(status);
          return;
        }

        setDirections(result);
        onRouteResolved?.(getRouteSummary(result));
      },
    );
  }, [driverLocation, finalDestination, isLoaded, onRouteResolved, routeStops]);

  if (loadError) {
    return (
      <MapFallback
        title="Google Maps could not load"
        detail="Check the API key, billing, Maps JavaScript API access, and allowed domains."
        driverLocation={driverLocation}
        driverSharingLocation={driverSharingLocation}
        finalDestination={finalDestination}
        height={height}
        passengers={passengers}
        routeStops={routeStops}
        selectedPassengerId={selectedPassengerId}
        onRouteResolved={onRouteResolved}
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
      center={toGooglePosition(driverLocation)}
      mapContainerStyle={{ height, width: '100%' }}
      options={mapOptions}
      zoom={13}
    >
      {directions ? (
        <DirectionsRenderer
          directions={directions}
          options={{
            polylineOptions: routeOptions,
            preserveViewport: false,
            suppressMarkers: true,
          }}
        />
      ) : (
        <PolylineF options={routeOptions} path={directPath} />
      )}
      <MarkerF
        icon={createMarkerIcon(driverSharingLocation ? '#1f9a63' : '#d8482f', 'D', 42)}
        position={toGooglePosition(driverLocation)}
        title={driverSharingLocation ? 'Driver location shared' : 'Driver location hidden'}
      />
      <MarkerF
        icon={createMarkerIcon('#2d6cdf', finalDestination.shortName, 46)}
        position={toGooglePosition(finalDestination)}
        title={finalDestination.name}
      />
      {passengers.map((passenger) => (
        <MarkerF
          key={passenger.id}
          icon={createMarkerIcon(
            getPassengerColor(passenger.status),
            passenger.name.charAt(0),
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

function getRouteSummary(result: google.maps.DirectionsResult): RouteSummary {
  const route = result.routes[0];
  const totals = route.legs.reduce(
    (summary, leg) => ({
      meters: summary.meters + (leg.distance?.value ?? 0),
      seconds: summary.seconds + (leg.duration?.value ?? 0),
    }),
    { meters: 0, seconds: 0 },
  );

  return {
    distanceKm: totals.meters / 1000,
    durationText: formatDuration(totals.seconds),
    source: 'google',
    waypointOrder: route.waypoint_order ?? [],
  };
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.max(1, Math.round(totalSeconds / 60));

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes === 0
    ? `${hours} hr`
    : `${hours} hr ${remainingMinutes} min`;
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
  finalDestination,
  height = 430,
  passengers,
  routeStops,
  selectedPassengerId,
  onSelectPassenger,
}: DriverMapProps & { title: string; detail: string }) {
  const routePath = [driverLocation, ...routeStops, finalDestination];

  return (
    <View style={[styles.fallbackMap, { height }]}>
      <View style={styles.fallbackMessage}>
        <Text style={styles.fallbackTitle}>{title}</Text>
        <Text style={styles.fallbackDetail}>{detail}</Text>
      </View>
      <View
        style={[
          styles.fallbackDriver,
          driverSharingLocation
            ? styles.fallbackDriverSharing
            : styles.fallbackDriverHidden,
          getMarkerPosition(driverLocation),
        ]}
      >
        <Text style={styles.markerText}>D</Text>
      </View>
      {routePath.slice(0, -1).map((point, index) => (
        <View
          key={`${point.latitude}-${point.longitude}-${index}`}
          style={[
            styles.routeSegment,
            getRouteSegmentStyle(point, routePath[index + 1]),
          ]}
        />
      ))}
      <View style={[styles.destinationMarker, getMarkerPosition(finalDestination)]}>
        <Text style={styles.destinationMarkerText}>{finalDestination.shortName}</Text>
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
          <Text style={styles.markerText}>{passenger.name.charAt(0)}</Text>
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
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="${size - 6}" height="${size - 6}" rx="8" fill="${color}" stroke="white" stroke-width="3"/>
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="${size * 0.38}" font-weight="800" fill="white">${label}</text>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(size, size),
  };
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
  fallbackDriverSharing: {
    backgroundColor: '#1f9a63',
  },
  fallbackDriverHidden: {
    backgroundColor: '#d8482f',
  },
  routeSegment: {
    backgroundColor: '#2d6cdf',
    borderRadius: 2,
    height: 4,
    marginTop: -2,
    position: 'absolute',
    transformOrigin: 'left center',
    zIndex: 1,
  },
  destinationMarker: {
    alignItems: 'center',
    backgroundColor: '#2d6cdf',
    borderColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 3,
    height: 44,
    justifyContent: 'center',
    marginLeft: -22,
    marginTop: -22,
    position: 'absolute',
    width: 44,
    zIndex: 2,
  },
  destinationMarkerText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  fallbackMarker: {
    alignItems: 'center',
    borderColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 3,
    height: 36,
    justifyContent: 'center',
    marginLeft: -18,
    marginTop: -18,
    position: 'absolute',
    width: 36,
  },
  selectedFallbackMarker: {
    borderColor: '#1f2d2b',
    transform: [{ scale: 1.12 }],
  },
  markerText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
});
