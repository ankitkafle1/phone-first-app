import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DriverMap from './DriverMap';

type Passenger = {
  id: string;
  name: string;
  stop: string;
  eta: string;
  phone: string;
  status: 'ready' | 'waiting' | 'offline';
  lastSeen: string;
  latitude: number;
  longitude: number;
};

type LocationPoint = {
  latitude: number;
  longitude: number;
};

type RouteSummary = {
  distanceKm: number;
  durationText: string;
  waypointOrder: number[];
  source: 'google' | 'fallback';
};

type ExitPoint = LocationPoint & {
  id: string;
  name: string;
  shortName: string;
  corridor: string;
};

const driverLocation = {
  latitude: 27.7172,
  longitude: 85.324,
};

const kathmanduExitPoints: ExitPoint[] = [
  {
    id: 'koteshwor',
    name: 'Koteshwor Exit',
    shortName: 'Koteshwor',
    corridor: 'East / Bhaktapur',
    latitude: 27.6782,
    longitude: 85.3498,
  },
  {
    id: 'kalanki',
    name: 'Kalanki Exit',
    shortName: 'Kalanki',
    corridor: 'West / Thankot',
    latitude: 27.6948,
    longitude: 85.2792,
  },
  {
    id: 'balkhu',
    name: 'Balkhu Exit',
    shortName: 'Balkhu',
    corridor: 'South / Kirtipur',
    latitude: 27.6785,
    longitude: 85.2996,
  },
];

const passengers: Passenger[] = [
  {
    id: '1',
    name: 'Aarav Mehta',
    stop: 'Thamel Chowk',
    eta: '3 min',
    phone: '+977 980 123 0128',
    status: 'ready',
    lastSeen: 'Live now',
    latitude: 27.7154,
    longitude: 85.3123,
  },
  {
    id: '2',
    name: 'Sophia Chen',
    stop: 'Naxal Bhagwati',
    eta: '6 min',
    phone: '+977 980 123 0173',
    status: 'ready',
    lastSeen: 'Live now',
    latitude: 27.717,
    longitude: 85.3287,
  },
  {
    id: '3',
    name: 'Maya Iyer',
    stop: 'New Baneshwor',
    eta: '9 min',
    phone: '+977 980 123 0199',
    status: 'waiting',
    lastSeen: 'Link sent',
    latitude: 27.6928,
    longitude: 85.342,
  },
  {
    id: '4',
    name: 'Noah Williams',
    stop: 'Patan Dhoka',
    eta: '12 min',
    phone: '+977 980 123 0112',
    status: 'offline',
    lastSeen: 'Not opened',
    latitude: 27.6788,
    longitude: 85.3206,
  },
];

const statusCopy = {
  ready: 'Location shared',
  waiting: 'Waiting for location',
  offline: 'No response',
};

export default function App() {
  const [driverSharingLocation, setDriverSharingLocation] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [pickedUpPassengerIds, setPickedUpPassengerIds] = useState<string[]>([]);
  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);
  const [selectedExitId, setSelectedExitId] = useState(kathmanduExitPoints[0].id);
  const [selectedPassengerId, setSelectedPassengerId] = useState(passengers[0].id);
  const finalDestination =
    kathmanduExitPoints.find((exitPoint) => exitPoint.id === selectedExitId) ??
    kathmanduExitPoints[0];
  const remainingPassengers = useMemo(
    () => passengers.filter((passenger) => !pickedUpPassengerIds.includes(passenger.id)),
    [pickedUpPassengerIds],
  );

  const routeStops = useMemo(
    () => getPickupOrder(driverLocation, finalDestination, remainingPassengers),
    [finalDestination, remainingPassengers],
  );
  const routeDistanceKm = useMemo(
    () => getRouteDistanceKm(driverLocation, routeStops, finalDestination),
    [finalDestination, routeStops],
  );
  const routeDistanceLabel = `${(routeSummary?.distanceKm ?? routeDistanceKm).toFixed(1)} km`;
  const routeDurationLabel = routeSummary?.durationText;
  const selectedPassenger =
    passengers.find((passenger) => passenger.id === selectedPassengerId) ??
    passengers[0];

  useEffect(() => {
    setRouteSummary(null);
  }, [pickedUpPassengerIds, selectedExitId]);

  function togglePassengerPickup(passengerId: string) {
    setPickedUpPassengerIds((currentIds) =>
      currentIds.includes(passengerId)
        ? currentIds.filter((currentId) => currentId !== passengerId)
        : [...currentIds, passengerId],
    );
  }

  if (mapExpanded) {
    return (
      <SafeAreaView style={styles.mapScreen}>
        <StatusBar style="dark" />
        <View style={styles.expandedMapShell}>
          <View style={styles.expandedMapTopBar}>
            <Pressable
              onPress={() => setMapExpanded(false)}
              style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
            <View style={styles.expandedMapTitleBlock}>
              <Text style={styles.expandedMapTitle}>Live pickup map</Text>
              <Text style={styles.expandedMapMeta}>
                Exit via {finalDestination.shortName}
                {routeDurationLabel ? ` · ${routeDurationLabel}` : ''}
              </Text>
            </View>
            <View style={styles.expandedDistanceBadge}>
              <Text style={styles.expandedDistanceText}>{routeDistanceLabel}</Text>
            </View>
          </View>

          <View style={styles.expandedMapPanel}>
            <DriverMap
              driverLocation={driverLocation}
              driverSharingLocation={driverSharingLocation}
              finalDestination={finalDestination}
              height={620}
              passengers={passengers}
              routeStops={routeStops}
              selectedPassengerId={selectedPassengerId}
              onRouteResolved={setRouteSummary}
              onSelectPassenger={setSelectedPassengerId}
            />
          </View>

          <View style={styles.expandedFocusCard}>
            <View>
              <Text style={styles.focusName}>{selectedPassenger.name}</Text>
              <Text style={styles.focusStop}>{selectedPassenger.stop}</Text>
            </View>
            <View style={styles.focusEta}>
              <Text style={styles.focusEtaValue}>{selectedPassenger.eta}</Text>
              <Text style={styles.focusEtaLabel}>ETA</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.headerCopy}>
            <Text style={styles.appName}>SumoHaice Driver</Text>
            <Text style={styles.routeText}>Kathmandu pickup route</Text>
          </View>
          <Pressable
            accessibilityLabel={
              driverSharingLocation
                ? 'Driver location is shared with passengers. Tap to stop sharing.'
                : 'Driver location is hidden from passengers. Tap to share.'
            }
            onPress={() => setDriverSharingLocation((current) => !current)}
            style={({ pressed }) => [
              styles.liveDriveIndicator,
              pressed && styles.buttonPressed,
            ]}
          >
            <View
              style={[
                styles.liveDriveHalo,
                driverSharingLocation
                  ? styles.liveDriveHaloActive
                  : styles.liveDriveHaloInactive,
              ]}
            >
              <View
                style={[
                  styles.liveDriveDot,
                  driverSharingLocation
                    ? styles.liveDriveDotActive
                    : styles.liveDriveDotInactive,
                ]}
              />
            </View>
          </Pressable>
          <View style={styles.shiftBadge}>
            <Text style={styles.shiftTime}>07:25</Text>
            <Text style={styles.shiftLabel}>AM</Text>
          </View>
        </View>

        <View style={styles.sharingControlBar}>
          <View style={styles.sharingStatus}>
            <View
              style={[
                styles.sharingStatusDot,
                driverSharingLocation
                  ? styles.sharingStatusDotActive
                  : styles.sharingStatusDotInactive,
              ]}
            />
            <Text style={styles.sharingStatusText}>
              {driverSharingLocation
                ? 'Driver location shared with passengers'
                : 'Driver location hidden from passengers'}
            </Text>
          </View>
          <Pressable
            onPress={() => setDriverSharingLocation((current) => !current)}
            style={({ pressed }) => [
              styles.sharingToggleButton,
              driverSharingLocation ? styles.stopSharingButton : styles.startSharingButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text
              style={[
                styles.sharingToggleText,
                driverSharingLocation ? styles.stopSharingText : styles.startSharingText,
              ]}
            >
              {driverSharingLocation ? 'Stop sharing' : 'Share driver'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.exitSelector}>
          <View style={styles.exitSelectorHeader}>
            <View>
              <Text style={styles.exitSelectorTitle}>Kathmandu exit point</Text>
              <Text style={styles.exitSelectorMeta}>
                Outbound route, customizable by city and direction
              </Text>
            </View>
            <Text style={styles.exitRouteDistance}>{routeDistanceLabel}</Text>
          </View>

          <View style={styles.exitOptions}>
            {kathmanduExitPoints.map((exitPoint) => {
              const isSelected = exitPoint.id === selectedExitId;

              return (
                <Pressable
                  key={exitPoint.id}
                  onPress={() => setSelectedExitId(exitPoint.id)}
                  style={({ pressed }) => [
                    styles.exitOption,
                    isSelected && styles.exitOptionSelected,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.exitOptionName,
                      isSelected && styles.exitOptionNameSelected,
                    ]}
                  >
                    {exitPoint.shortName}
                  </Text>
                  <Text
                    style={[
                      styles.exitOptionCorridor,
                      isSelected && styles.exitOptionCorridorSelected,
                    ]}
                  >
                    {exitPoint.corridor}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.mapPanel}>
          <View style={styles.mapHeader}>
            <View>
              <Text style={styles.sectionTitle}>Live pickup map</Text>
              <Text style={styles.sectionMeta}>
                Pickup route exits via {finalDestination.shortName}
                {routeDurationLabel ? ` · ${routeDurationLabel}` : ''}
              </Text>
            </View>
            <View style={styles.mapHeaderActions}>
              <Text style={styles.distanceText}>{routeDistanceLabel}</Text>
              <Pressable
                onPress={() => setMapExpanded(true)}
                style={({ pressed }) => [styles.openMapButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.openMapText}>Open</Text>
              </Pressable>
            </View>
          </View>

          <DriverMap
            driverLocation={driverLocation}
            driverSharingLocation={driverSharingLocation}
            finalDestination={finalDestination}
            height={520}
            passengers={passengers}
            routeStops={routeStops}
            selectedPassengerId={selectedPassengerId}
            onRouteResolved={setRouteSummary}
            onSelectPassenger={setSelectedPassengerId}
          />

          <View style={styles.focusCard}>
            <View>
              <Text style={styles.focusName}>{selectedPassenger.name}</Text>
              <Text style={styles.focusStop}>{selectedPassenger.stop}</Text>
            </View>
            <View style={styles.focusEta}>
              <Text style={styles.focusEtaValue}>{selectedPassenger.eta}</Text>
              <Text style={styles.focusEtaLabel}>ETA</Text>
            </View>
          </View>
        </View>

        <View style={styles.rosterHeader}>
          <Text style={styles.sectionTitle}>Passenger list</Text>
              <Text style={styles.sectionMeta}>
                {pickedUpPassengerIds.length} picked up, {remainingPassengers.length} pending
              </Text>
        </View>

        <View style={styles.roster}>
          {passengers.map((passenger) => (
            <PassengerRow
              key={passenger.id}
              isPickedUp={pickedUpPassengerIds.includes(passenger.id)}
              isSelected={selectedPassengerId === passenger.id}
              passenger={passenger}
              onSelect={() => setSelectedPassengerId(passenger.id)}
              onTogglePickup={() => togglePassengerPickup(passenger.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PassengerRow({
  isPickedUp,
  isSelected,
  passenger,
  onSelect,
  onTogglePickup,
}: {
  isPickedUp: boolean;
  isSelected: boolean;
  passenger: Passenger;
  onSelect: () => void;
  onTogglePickup: () => void;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => [
        styles.passengerRow,
        isSelected && styles.passengerRowSelected,
        isPickedUp && styles.passengerRowPickedUp,
        pressed && styles.buttonPressed,
      ]}
    >
      <View style={[styles.avatar, isPickedUp && styles.avatarPickedUp]}>
        <Text style={[styles.avatarText, isPickedUp && styles.avatarTextPickedUp]}>
          {passenger.name.charAt(0)}
        </Text>
      </View>
      <View style={styles.passengerInfo}>
        <Text style={[styles.passengerName, isPickedUp && styles.passengerNamePickedUp]}>
          {passenger.name}
        </Text>
        <Text style={styles.passengerStop}>{passenger.stop}</Text>
        <Text style={styles.passengerPhone}>{passenger.phone}</Text>
      </View>
      <View style={styles.passengerStatus}>
        <Text style={[styles.statusText, styles[`${passenger.status}Text`]]}>
          {statusCopy[passenger.status]}
        </Text>
        <Text style={styles.lastSeen}>{isPickedUp ? 'Pickup done' : passenger.lastSeen}</Text>
        <Pressable
          onPress={onTogglePickup}
          style={({ pressed }) => [
            styles.pickupToggle,
            isPickedUp ? styles.pickupToggleDone : styles.pickupTogglePending,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text
            style={[
              styles.pickupToggleText,
              isPickedUp ? styles.pickupToggleTextDone : styles.pickupToggleTextPending,
            ]}
          >
            {isPickedUp ? 'Picked up' : 'Mark pickup'}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

function getPickupOrder(
  start: LocationPoint,
  destination: LocationPoint,
  stops: Passenger[],
) {
  return [...stops].sort((first, second) => {
    const firstProgress = getProgressAlongRoute(start, destination, first);
    const secondProgress = getProgressAlongRoute(start, destination, second);

    if (firstProgress !== secondProgress) {
      return firstProgress - secondProgress;
    }

    return getDistanceKm(start, first) - getDistanceKm(start, second);
  });
}

function getProgressAlongRoute(
  start: LocationPoint,
  destination: LocationPoint,
  point: LocationPoint,
) {
  const routeLatitude = destination.latitude - start.latitude;
  const routeLongitude = destination.longitude - start.longitude;
  const pointLatitude = point.latitude - start.latitude;
  const pointLongitude = point.longitude - start.longitude;
  const routeLength = routeLatitude * routeLatitude + routeLongitude * routeLongitude;

  if (routeLength === 0) {
    return 0;
  }

  const progress =
    (pointLatitude * routeLatitude + pointLongitude * routeLongitude) / routeLength;

  return Math.min(Math.max(progress, 0), 1);
}

function getRouteDistanceKm(
  start: LocationPoint,
  stops: LocationPoint[],
  destination: LocationPoint,
) {
  const route = [start, ...stops, destination];

  return route.reduce((total, point, index) => {
    if (index === 0) {
      return total;
    }

    return total + getDistanceKm(route[index - 1], point);
  }, 0);
}

function getDistanceKm(first: LocationPoint, second: LocationPoint) {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(second.latitude - first.latitude);
  const longitudeDelta = toRadians(second.longitude - first.longitude);
  const firstLatitude = toRadians(first.latitude);
  const secondLatitude = toRadians(second.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f6f3ed',
  },
  mapScreen: {
    flex: 1,
    backgroundColor: '#f6f3ed',
  },
  content: {
    padding: 14,
    paddingBottom: 34,
    gap: 14,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  appName: {
    color: '#1f2d2b',
    fontSize: 25,
    fontWeight: '800',
  },
  routeText: {
    color: '#66716e',
    fontSize: 14,
    marginTop: 4,
  },
  shiftBadge: {
    alignItems: 'center',
    backgroundColor: '#1f2d2b',
    borderRadius: 8,
    minWidth: 62,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  shiftTime: {
    color: '#fffaf1',
    fontSize: 17,
    fontWeight: '800',
  },
  shiftLabel: {
    color: '#cbd8cf',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  buttonPressed: {
    opacity: 0.76,
    transform: [{ scale: 0.99 }],
  },
  liveDriveIndicator: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  liveDriveHalo: {
    alignItems: 'center',
    borderColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  liveDriveHaloActive: {
    backgroundColor: '#dff4e8',
  },
  liveDriveHaloInactive: {
    backgroundColor: '#fbe5df',
  },
  liveDriveDot: {
    borderRadius: 8,
    height: 16,
    width: 16,
  },
  liveDriveDotActive: {
    backgroundColor: '#1f9a63',
  },
  liveDriveDotInactive: {
    backgroundColor: '#d8482f',
  },
  sharingControlBar: {
    alignItems: 'center',
    backgroundColor: '#fffaf1',
    borderColor: '#eadfce',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sharingStatus: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    minWidth: 0,
  },
  sharingStatusDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  sharingStatusDotActive: {
    backgroundColor: '#1f9a63',
  },
  sharingStatusDotInactive: {
    backgroundColor: '#d8482f',
  },
  sharingStatusText: {
    color: '#1f2d2b',
    fontSize: 13,
    fontWeight: '800',
  },
  sharingToggleButton: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: 14,
  },
  startSharingButton: {
    backgroundColor: '#e0f3e8',
  },
  stopSharingButton: {
    backgroundColor: '#fbe5df',
  },
  sharingToggleText: {
    fontSize: 13,
    fontWeight: '900',
  },
  startSharingText: {
    color: '#14734b',
  },
  stopSharingText: {
    color: '#b93820',
  },
  exitSelector: {
    backgroundColor: '#fffaf1',
    borderColor: '#eadfce',
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 12,
  },
  exitSelectorHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  exitSelectorTitle: {
    color: '#17211f',
    fontSize: 14,
    fontWeight: '900',
  },
  exitSelectorMeta: {
    color: '#66716e',
    fontSize: 12,
    marginTop: 3,
  },
  exitRouteDistance: {
    color: '#2559af',
    fontSize: 13,
    fontWeight: '900',
  },
  exitOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  exitOption: {
    backgroundColor: '#f4efe6',
    borderColor: '#eadfce',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 58,
    paddingHorizontal: 9,
    paddingVertical: 9,
  },
  exitOptionSelected: {
    backgroundColor: '#e4eefc',
    borderColor: '#2d6cdf',
  },
  exitOptionName: {
    color: '#1f2d2b',
    fontSize: 13,
    fontWeight: '900',
  },
  exitOptionNameSelected: {
    color: '#2559af',
  },
  exitOptionCorridor: {
    color: '#66716e',
    fontSize: 10,
    lineHeight: 13,
    marginTop: 3,
  },
  exitOptionCorridorSelected: {
    color: '#2559af',
  },
  mapPanel: {
    backgroundColor: '#fffaf1',
    borderColor: '#eadfce',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  mapHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  mapHeaderActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  sectionTitle: {
    color: '#17211f',
    fontSize: 19,
    fontWeight: '800',
  },
  sectionMeta: {
    color: '#66716e',
    fontSize: 13,
    marginTop: 4,
  },
  distanceText: {
    color: '#2d6cdf',
    fontSize: 14,
    fontWeight: '900',
  },
  openMapButton: {
    alignItems: 'center',
    backgroundColor: '#e4eefc',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 34,
    minWidth: 64,
    paddingHorizontal: 12,
  },
  openMapText: {
    color: '#2559af',
    fontSize: 13,
    fontWeight: '900',
  },
  expandedMapShell: {
    flex: 1,
    gap: 10,
    padding: 10,
  },
  expandedMapTopBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: '#1f2d2b',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 72,
    paddingHorizontal: 14,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  expandedMapTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  expandedMapTitle: {
    color: '#17211f',
    fontSize: 18,
    fontWeight: '900',
  },
  expandedMapMeta: {
    color: '#66716e',
    fontSize: 12,
    marginTop: 3,
  },
  expandedDistanceBadge: {
    alignItems: 'center',
    backgroundColor: '#e4eefc',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: 10,
  },
  expandedDistanceText: {
    color: '#2559af',
    fontSize: 13,
    fontWeight: '900',
  },
  expandedMapPanel: {
    borderColor: '#eadfce',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  expandedFocusCard: {
    alignItems: 'center',
    backgroundColor: '#1f2d2b',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  focusCard: {
    alignItems: 'center',
    backgroundColor: '#1f2d2b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  focusName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  focusStop: {
    color: '#cbd8cf',
    fontSize: 13,
    marginTop: 3,
  },
  focusEta: {
    alignItems: 'flex-end',
  },
  focusEtaValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  focusEtaLabel: {
    color: '#cbd8cf',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  rosterHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roster: {
    gap: 10,
  },
  passengerRow: {
    alignItems: 'center',
    backgroundColor: '#fffaf1',
    borderColor: '#eadfce',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  passengerRowSelected: {
    borderColor: '#2d6cdf',
    borderWidth: 2,
  },
  passengerRowPickedUp: {
    backgroundColor: '#f1f7f3',
    borderColor: '#cfe8d8',
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#dfe8f9',
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  avatarText: {
    color: '#2559af',
    fontSize: 16,
    fontWeight: '900',
  },
  avatarPickedUp: {
    backgroundColor: '#dff4e8',
  },
  avatarTextPickedUp: {
    color: '#14734b',
  },
  passengerInfo: {
    flex: 1,
    minWidth: 0,
  },
  passengerName: {
    color: '#17211f',
    fontSize: 15,
    fontWeight: '800',
  },
  passengerNamePickedUp: {
    color: '#5f6c66',
  },
  passengerStop: {
    color: '#66716e',
    fontSize: 13,
    marginTop: 3,
  },
  passengerPhone: {
    color: '#8a8174',
    fontSize: 12,
    marginTop: 3,
  },
  passengerStatus: {
    alignItems: 'flex-end',
    maxWidth: 128,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'right',
  },
  readyText: {
    color: '#14734b',
  },
  waitingText: {
    color: '#9b6508',
  },
  offlineText: {
    color: '#68706c',
  },
  lastSeen: {
    color: '#8a8174',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right',
  },
  pickupToggle: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 30,
    minWidth: 96,
    paddingHorizontal: 10,
  },
  pickupTogglePending: {
    backgroundColor: '#e4eefc',
  },
  pickupToggleDone: {
    backgroundColor: '#dff4e8',
  },
  pickupToggleText: {
    fontSize: 12,
    fontWeight: '900',
  },
  pickupToggleTextPending: {
    color: '#2559af',
  },
  pickupToggleTextDone: {
    color: '#14734b',
  },
});
