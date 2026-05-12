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

export default function DriverMap({
  driverLocation,
  driverSharingLocation,
  height = 430,
  passengers,
  selectedPassengerId,
  onSelectPassenger,
}: DriverMapProps) {
  return (
    <View style={[styles.mapCanvas, { height }]}>
      <View style={[styles.road, styles.roadOne]} />
      <View style={[styles.road, styles.roadTwo]} />
      <View style={[styles.road, styles.roadThree]} />
      <View
        style={[
          styles.driverMarker,
          styles.driverMarkerRed,
          getMarkerPosition(driverLocation),
        ]}
      >
        <Text style={styles.driverMarkerText}>D</Text>
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
          <Text numberOfLines={1} style={styles.passengerMarkerText}>
            {getFirstName(passenger.name)}
          </Text>
        </Pressable>
      ))}
    </View>
  );
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

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || name;
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
  driverMarkerRed: {
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
    height: 32,
    justifyContent: 'center',
    marginLeft: -32,
    marginTop: -16,
    paddingHorizontal: 6,
    position: 'absolute',
    width: 64,
    zIndex: 2,
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
    fontSize: 10,
    fontWeight: '900',
  },
});
