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
  onRouteResolved?: (summary: {
    distanceKm: number;
    durationText: string;
    waypointOrder: number[];
    source: 'google' | 'fallback';
  }) => void;
  onSelectPassenger: (passengerId: string) => void;
};

export default function DriverMap({
  driverLocation,
  driverSharingLocation,
  finalDestination,
  height = 430,
  passengers,
  routeStops,
  selectedPassengerId,
  onSelectPassenger,
}: DriverMapProps) {
  const routePath = [driverLocation, ...routeStops, finalDestination];

  return (
    <View style={[styles.mapCanvas, { height }]}>
      <View style={[styles.road, styles.roadOne]} />
      <View style={[styles.road, styles.roadTwo]} />
      <View style={[styles.road, styles.roadThree]} />
      {routePath.slice(0, -1).map((point, index) => (
        <View
          key={`${point.latitude}-${point.longitude}-${index}`}
          style={[
            styles.routeSegment,
            getRouteSegmentStyle(point, routePath[index + 1]),
          ]}
        />
      ))}
      <View
        style={[
          styles.driverMarker,
          driverSharingLocation ? styles.driverMarkerSharing : styles.driverMarkerHidden,
          getMarkerPosition(driverLocation),
        ]}
      >
        <Text style={styles.driverMarkerText}>D</Text>
      </View>
      <View style={[styles.destinationMarker, getMarkerPosition(finalDestination)]}>
        <Text style={styles.destinationMarkerText}>{finalDestination.shortName}</Text>
      </View>
      {passengers.map((passenger) => (
        <Pressable
          key={passenger.id}
          onPress={() => onSelectPassenger(passenger.id)}
          style={[
            styles.passengerMarker,
            passenger.status === 'ready' && styles.passengerMarkerReady,
            passenger.status === 'waiting' && styles.passengerMarkerWaiting,
            passenger.status === 'offline' && styles.passengerMarkerOffline,
            selectedPassengerId === passenger.id && styles.passengerMarkerSelected,
            getMarkerPosition(passenger),
          ]}
        >
          <Text style={styles.passengerMarkerText}>{passenger.name.charAt(0)}</Text>
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
  mapCanvas: {
    backgroundColor: '#dbe9dd',
    overflow: 'hidden',
    position: 'relative',
  },
  road: {
    backgroundColor: '#fffaf1',
    borderColor: '#c2d4c8',
    borderWidth: 1,
    position: 'absolute',
  },
  roadOne: {
    height: 34,
    left: -20,
    top: 126,
    transform: [{ rotate: '-14deg' }],
    width: 430,
  },
  roadTwo: {
    height: 420,
    left: 172,
    top: -58,
    transform: [{ rotate: '24deg' }],
    width: 34,
  },
  roadThree: {
    height: 32,
    left: 28,
    top: 222,
    transform: [{ rotate: '18deg' }],
    width: 300,
  },
  routeSegment: {
    backgroundColor: '#2d6cdf',
    borderRadius: 2,
    height: 4,
    marginTop: -2,
    position: 'absolute',
    zIndex: 1,
  },
  driverMarker: {
    alignItems: 'center',
    borderColor: '#fffaf1',
    borderRadius: 8,
    borderWidth: 3,
    height: 42,
    justifyContent: 'center',
    marginLeft: -21,
    marginTop: -21,
    position: 'absolute',
    width: 42,
    zIndex: 3,
  },
  driverMarkerSharing: {
    backgroundColor: '#1f9a63',
  },
  driverMarkerHidden: {
    backgroundColor: '#d8482f',
  },
  driverMarkerText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  passengerMarker: {
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
    zIndex: 2,
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
    zIndex: 3,
  },
  destinationMarkerText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  passengerMarkerReady: {
    backgroundColor: '#1f9a63',
  },
  passengerMarkerWaiting: {
    backgroundColor: '#e4a72b',
  },
  passengerMarkerOffline: {
    backgroundColor: '#8e9692',
  },
  passengerMarkerSelected: {
    borderColor: '#1f2d2b',
    transform: [{ scale: 1.12 }],
  },
  passengerMarkerText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
});
