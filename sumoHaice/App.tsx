import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DriverMap from './DriverMap';

type Passenger = {
  id: string;
  ticketNumber?: string;
  name: string;
  stop: string;
  routeInfo?: string;
  eta: string;
  phone: string;
  status: 'ready' | 'waiting' | 'offline';
  lastSeen: string;
  latitude: number;
  longitude: number;
};

type UserLocationInfo = {
  userId?: string;
  name?: string;
  userName?: string;
  phoneNumber?: string;
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  capturedAt?: string;
};

type LocationPoint = {
  latitude: number;
  longitude: number;
};

type LocationShare = {
  shareId: string;
  shareToken: string;
  riderUrl: string;
  location: LocationPoint & {
    accuracyMeters?: number;
  };
  capturedAt: string;
  expiresAt: string;
};

const fallbackDriverLocation = {
  latitude: 27.7172,
  longitude: 85.324,
};

const backendUserLocationsApiUrl = 'http://192.168.1.250:8089/api/user-locations/vehicle1';
const locationPollIntervalMs = 30_000;

const statusCopy = {
  ready: 'Location shared',
  waiting: 'Waiting for location',
  offline: 'No response',
};

const emptyPassengerForm = {
  ticketNumber: '',
  name: '',
  phone: '',
  routeInfo: '',
};

export default function App() {
  const [deviceTime, setDeviceTime] = useState(() => new Date());
  const [driverLocation, setDriverLocation] = useState<LocationPoint>(fallbackDriverLocation);
  const [driverSharingLocation, setDriverSharingLocation] = useState(false);
  const [activeLocationShare, setActiveLocationShare] = useState<LocationShare | null>(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [addPassengerOpen, setAddPassengerOpen] = useState(false);
  const [passengerForm, setPassengerForm] = useState(emptyPassengerForm);
  const [rosterExpanded, setRosterExpanded] = useState(true);
  const [pickedUpPassengerIds, setPickedUpPassengerIds] = useState<string[]>([]);
  const [locationSentPassengerIds, setLocationSentPassengerIds] = useState<string[]>([]);
  const [userLocations, setUserLocations] = useState<UserLocationInfo[]>([]);
  const [passengerRoster, setPassengerRoster] = useState<Passenger[]>([]);
  const [pickupComplete, setPickupComplete] = useState(false);
  const [selectedPassengerId, setSelectedPassengerId] = useState('');
  const apiPassengers = useMemo(
    () => userLocations.map(locationToPassenger),
    [userLocations],
  );
  const passengers = passengerRoster;
  const remainingPassengers = useMemo(
    () => passengers.filter((passenger) => !pickedUpPassengerIds.includes(passenger.id)),
    [passengers, pickedUpPassengerIds],
  );
  const visibleMapPassengers = useMemo(
    () =>
      driverSharingLocation
        ? remainingPassengers.filter((passenger) => passenger.status === 'ready')
        : [],
    [driverSharingLocation, remainingPassengers],
  );
  const sortedPassengers = useMemo(
    () =>
      [...passengers].sort((first, second) => {
        const firstPickedUp = pickedUpPassengerIds.includes(first.id);
        const secondPickedUp = pickedUpPassengerIds.includes(second.id);

        if (firstPickedUp === secondPickedUp) {
          return 0;
        }

        return firstPickedUp ? 1 : -1;
      }),
    [passengers, pickedUpPassengerIds],
  );
  const allPassengersPickedUp =
    driverSharingLocation &&
    !pickupComplete &&
    passengers.length > 0 &&
    remainingPassengers.length === 0;
  const pickupSessionComplete = pickupComplete || allPassengersPickedUp;
  const selectedPassenger =
    passengers.find((passenger) => passenger.id === selectedPassengerId) ?? passengers[0];
  const selectedPassengerIsPickedUp = selectedPassenger
    ? pickedUpPassengerIds.includes(selectedPassenger.id)
    : false;
  const rosterCanCollapse = pickupSessionComplete && sortedPassengers.length > 0;
  const deviceClock = useMemo(() => formatDeviceClock(deviceTime), [deviceTime]);

  useEffect(() => {
    if (apiPassengers.length === 0) {
      return;
    }

    setPassengerRoster((currentPassengers) =>
      mergePassengerRoster(currentPassengers, apiPassengers),
    );
  }, [apiPassengers]);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setDeviceTime(new Date());
    }, 1000);

    return () => {
      clearInterval(clockInterval);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function pollBackendLocations() {
      if (!driverSharingLocation) {
        setUserLocations([]);
        return;
      }

      if (pickupComplete) {
        return;
      }

      const backendUserLocations = await getUserLocation();

      if (!isMounted) {
        return;
      }

      setUserLocations(backendUserLocations);
    }

    void pollBackendLocations();
    const pollInterval = setInterval(() => {
      void pollBackendLocations();
    }, locationPollIntervalMs);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [driverSharingLocation, pickupComplete]);

  useEffect(() => {
    if (!allPassengersPickedUp) {
      return;
    }

    setPickupComplete(true);
  }, [allPassengersPickedUp]);

  useEffect(() => {
    if (!pickupSessionComplete) {
      setRosterExpanded(true);
    }
  }, [pickupSessionComplete]);

  useEffect(() => {
    if (passengers.length === 0) {
      setSelectedPassengerId('');
      return;
    }

    if (!passengers.some((passenger) => passenger.id === selectedPassengerId)) {
      setSelectedPassengerId(passengers[0].id);
    }
  }, [passengers, selectedPassengerId]);

  useEffect(() => {
    if (!driverSharingLocation || !activeLocationShare) {
      return;
    }

    const updateInterval = setInterval(() => {
      void updateLocationShare(activeLocationShare, driverLocation)
        .then(setActiveLocationShare)
        .catch((error) => {
          console.warn('Unable to update location share', error);
        });
    }, 20_000);

    return () => {
      clearInterval(updateInterval);
    };
  }, [activeLocationShare, driverLocation, driverSharingLocation]);

  function togglePassengerPickup(passengerId: string) {
    const isCurrentlyPickedUp = pickedUpPassengerIds.includes(passengerId);
    const nextPendingPassenger = passengers.find(
      (passenger) =>
        passenger.id !== passengerId && !pickedUpPassengerIds.includes(passenger.id),
    );

    setPickedUpPassengerIds((currentIds) =>
      currentIds.includes(passengerId)
        ? currentIds.filter((currentId) => currentId !== passengerId)
        : [...currentIds, passengerId],
    );

    if (isCurrentlyPickedUp) {
      setSelectedPassengerId(passengerId);
      setPickupComplete(false);
      return;
    }

    if (selectedPassengerId === passengerId) {
      setSelectedPassengerId(nextPendingPassenger?.id ?? '');
    }
  }

  function updatePassengerForm(field: keyof typeof passengerForm, value: string) {
    setPassengerForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function addPassenger() {
    const ticketNumber = passengerForm.ticketNumber.trim();
    const name = passengerForm.name.trim();
    const phone = passengerForm.phone.trim();
    const routeInfo = passengerForm.routeInfo.trim();

    if (!ticketNumber || !name || !phone || !routeInfo) {
      return;
    }

    const passenger: Passenger = {
      id: normalizePhoneNumber(phone) || `manual-${ticketNumber}`,
      ticketNumber,
      name,
      stop: routeInfo,
      routeInfo,
      eta: '--',
      phone,
      status: 'waiting',
      lastSeen: 'Added manually',
      latitude: driverLocation.latitude,
      longitude: driverLocation.longitude,
    };

    setPassengerRoster((currentPassengers) =>
      mergePassengerRoster(currentPassengers, [passenger]),
    );
    setPickedUpPassengerIds((currentIds) =>
      currentIds.filter((currentId) => currentId !== passenger.id),
    );
    setPickupComplete(false);
    setRosterExpanded(true);
    setSelectedPassengerId(passenger.id);
    setPassengerForm(emptyPassengerForm);
    setAddPassengerOpen(false);
  }

  async function toggleDriverLocationSharing() {
    if (driverSharingLocation) {
      setDriverSharingLocation(false);
      setActiveLocationShare(null);
      setPassengerRoster([]);
      setUserLocations([]);
      setPickupComplete(false);
      setRosterExpanded(true);
      return;
    }

    setPickupComplete(false);
    const locationShare = await createLocationShare(driverLocation);
    setActiveLocationShare(locationShare);
    setDriverSharingLocation(true);
  }

  async function sendDriverLocation(passenger: Passenger) {
    const locationShare = activeLocationShare ?? (await createLocationShare(driverLocation));
    const smsUrl = getDriverLocationSmsUrl(passenger, locationShare.riderUrl);

    try {
      await Linking.openURL(smsUrl);
      setActiveLocationShare(locationShare);
      setDriverSharingLocation(true);
      setLocationSentPassengerIds((currentIds) =>
        currentIds.includes(passenger.id) ? currentIds : [...currentIds, passenger.id],
      );
    } catch (error) {
      console.warn('Unable to open SMS composer', error);
    }
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
                {pickupSessionComplete ? 'All pickups complete' : 'Passenger locations'}
              </Text>
            </View>
          </View>

          <View style={styles.expandedMapPanel}>
            <DriverMap
              driverLocation={driverLocation}
              driverSharingLocation={driverSharingLocation}
              height={620}
              passengers={visibleMapPassengers}
              selectedPassengerId={selectedPassengerId}
              onSelectPassenger={setSelectedPassengerId}
            />
          </View>

          <View style={styles.expandedFocusCard}>
            {pickupSessionComplete ? (
              <View>
                <Text style={styles.focusName}>Free drive</Text>
                <Text style={styles.focusStop}>Only driver location is being shared</Text>
              </View>
            ) : selectedPassenger ? (
              <>
                <View>
                  <Text style={styles.focusName}>{getFirstName(selectedPassenger.name)}</Text>
                  <Text style={styles.focusStop}>{selectedPassenger.stop}</Text>
                </View>
                <View style={styles.focusEta}>
                  <Text style={styles.focusEtaValue}>{selectedPassenger.eta}</Text>
                  <Text style={styles.focusEtaLabel}>ETA</Text>
                  {!selectedPassengerIsPickedUp && (
                    <Pressable
                      onPress={() => togglePassengerPickup(selectedPassenger.id)}
                      style={({ pressed }) => [
                        styles.focusPickupButton,
                        pressed && styles.buttonPressed,
                      ]}
                    >
                      <Text style={styles.focusPickupText}>Mark pickup</Text>
                    </Pressable>
                  )}
                </View>
              </>
            ) : (
              <View>
                <Text style={styles.focusName}>
                  {driverSharingLocation ? 'Waiting for users' : 'Location hidden'}
                </Text>
                <Text style={styles.focusStop}>
                  {driverSharingLocation
                    ? 'Polling passenger locations'
                    : 'Start sharing to show users'}
                </Text>
              </View>
            )}
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
            <Text style={styles.routeText}>Live pickup locations</Text>
          </View>
          <Pressable
            accessibilityLabel={
              driverSharingLocation
                ? 'Driver location is shared with passengers. Tap to stop sharing.'
                : 'Driver location is hidden from passengers. Tap to share.'
            }
            onPress={() => {
              void toggleDriverLocationSharing();
            }}
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
            <Text style={styles.shiftTime}>{deviceClock.time}</Text>
            <Text style={styles.shiftLabel}>{deviceClock.period}</Text>
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
            onPress={() => {
              void toggleDriverLocationSharing();
            }}
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

        <View style={styles.mapPanel}>
          <View style={styles.mapHeader}>
            <View>
              <Text style={styles.sectionTitle}>Live pickup map</Text>
              <Text style={styles.sectionMeta}>
                {pickupSessionComplete ? 'All pickups complete · free drive' : 'Passenger locations'}
              </Text>
            </View>
            <View style={styles.mapHeaderActions}>
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
            height={520}
            passengers={visibleMapPassengers}
            selectedPassengerId={selectedPassengerId}
            onSelectPassenger={setSelectedPassengerId}
          />

          <View style={styles.focusCard}>
            {pickupSessionComplete ? (
              <View>
                <Text style={styles.focusName}>Free drive</Text>
                <Text style={styles.focusStop}>Only driver location is being shared</Text>
              </View>
            ) : selectedPassenger ? (
              <>
                <View>
                  <Text style={styles.focusName}>{getFirstName(selectedPassenger.name)}</Text>
                  <Text style={styles.focusStop}>{selectedPassenger.stop}</Text>
                </View>
                <View style={styles.focusEta}>
                  <Text style={styles.focusEtaValue}>{selectedPassenger.eta}</Text>
                  <Text style={styles.focusEtaLabel}>ETA</Text>
                  {!selectedPassengerIsPickedUp && (
                    <Pressable
                      onPress={() => togglePassengerPickup(selectedPassenger.id)}
                      style={({ pressed }) => [
                        styles.focusPickupButton,
                        pressed && styles.buttonPressed,
                      ]}
                    >
                      <Text style={styles.focusPickupText}>Mark pickup</Text>
                    </Pressable>
                  )}
                </View>
              </>
            ) : (
              <View>
                <Text style={styles.focusName}>
                  {driverSharingLocation ? 'Waiting for users' : 'Location hidden'}
                </Text>
                <Text style={styles.focusStop}>
                  {driverSharingLocation
                    ? 'Polling passenger locations'
                    : 'Start sharing to show users'}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.rosterHeader}>
          <View>
            <Text style={styles.sectionTitle}>Passenger list</Text>
            {rosterCanCollapse && (
              <Pressable
                onPress={() => setRosterExpanded((current) => !current)}
                style={({ pressed }) => [
                  styles.rosterCollapseButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.rosterCollapseText}>
                  {rosterExpanded ? 'Hide picked up' : 'Show picked up'}
                </Text>
              </Pressable>
            )}
          </View>
          <Text style={styles.sectionMeta}>
            {pickedUpPassengerIds.length} picked up, {remainingPassengers.length} pending
          </Text>
        </View>

        <View style={styles.addPassengerPanel}>
          <Pressable
            onPress={() => setAddPassengerOpen((current) => !current)}
            style={({ pressed }) => [
              styles.addPassengerToggle,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.addPassengerToggleText}>
              {addPassengerOpen ? 'Close' : 'Add passenger'}
            </Text>
          </Pressable>

          {addPassengerOpen && (
            <View style={styles.addPassengerForm}>
              <View style={styles.formRow}>
                <TextInput
                  autoCapitalize="characters"
                  onChangeText={(value) => updatePassengerForm('ticketNumber', value)}
                  placeholder="Ticket number"
                  placeholderTextColor="#8a8174"
                  style={[styles.formInput, styles.formInputCompact]}
                  value={passengerForm.ticketNumber}
                />
                <TextInput
                  onChangeText={(value) => updatePassengerForm('phone', value)}
                  keyboardType="phone-pad"
                  placeholder="Phone number"
                  placeholderTextColor="#8a8174"
                  style={styles.formInput}
                  value={passengerForm.phone}
                />
              </View>
              <TextInput
                onChangeText={(value) => updatePassengerForm('name', value)}
                placeholder="Passenger name"
                placeholderTextColor="#8a8174"
                style={styles.formInput}
                value={passengerForm.name}
              />
              <TextInput
                onChangeText={(value) => updatePassengerForm('routeInfo', value)}
                placeholder="Route info"
                placeholderTextColor="#8a8174"
                style={styles.formInput}
                value={passengerForm.routeInfo}
              />
              <Pressable
                onPress={addPassenger}
                style={({ pressed }) => [
                  styles.addPassengerSubmit,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.addPassengerSubmitText}>Save passenger</Text>
              </Pressable>
            </View>
          )}
        </View>

        {rosterExpanded && (
          <View style={styles.roster}>
            {sortedPassengers.map((passenger) => (
              <PassengerRow
                key={passenger.id}
                isPickedUp={pickedUpPassengerIds.includes(passenger.id)}
                isSelected={selectedPassengerId === passenger.id}
                isLocationSent={locationSentPassengerIds.includes(passenger.id)}
                passenger={passenger}
                onSendLocation={() => {
                  void sendDriverLocation(passenger);
                }}
                onTogglePickup={() => togglePassengerPickup(passenger.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function PassengerRow({
  isPickedUp,
  isLocationSent,
  isSelected,
  passenger,
  onSendLocation,
  onTogglePickup,
}: {
  isPickedUp: boolean;
  isLocationSent: boolean;
  isSelected: boolean;
  passenger: Passenger;
  onSendLocation: () => void;
  onTogglePickup: () => void;
}) {
  const statusLabel = isPickedUp
    ? 'Done'
    : isLocationSent
      ? 'Sent'
      : statusCopy[passenger.status];
  const lastSeenLabel = isPickedUp
    ? 'Pickup done'
    : isLocationSent
      ? 'SMS ready'
      : formatCapturedAtLabel(passenger.lastSeen);

  return (
    <View
      style={[
        styles.passengerRow,
        isSelected && styles.passengerRowSelected,
        isPickedUp && styles.passengerRowPickedUp,
      ]}
    >
      <View style={styles.passengerInfo}>
        <Text style={[styles.passengerName, isPickedUp && styles.passengerNamePickedUp]}>
          {getFirstName(passenger.name)}
        </Text>
        {(passenger.ticketNumber || passenger.routeInfo) && (
          <Text numberOfLines={1} style={styles.passengerRoute}>
            {[passenger.ticketNumber && `Ticket ${passenger.ticketNumber}`, passenger.routeInfo]
              .filter(Boolean)
              .join(' - ')}
          </Text>
        )}
        <Text style={styles.passengerPhone}>{passenger.phone}</Text>
      </View>
      <View style={styles.passengerStatus}>
        <Text
          style={[
            styles.statusText,
            isPickedUp
              ? styles.doneText
              : isLocationSent
                ? styles.sentText
                : styles[`${passenger.status}Text`],
          ]}
        >
          {statusLabel}
        </Text>
        <Text style={styles.lastSeen}>{lastSeenLabel}</Text>
      </View>
      <View style={styles.passengerActions}>
        <Pressable
          onPress={onSendLocation}
          style={({ pressed }) => [
            styles.locationToggle,
            isLocationSent && styles.locationToggleSent,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text
            style={[
              styles.locationToggleText,
              isLocationSent && styles.locationToggleTextSent,
            ]}
          >
            {isLocationSent ? 'Resend' : 'Send'}
          </Text>
        </Pressable>
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
            {isPickedUp ? 'Undo' : 'Pickup'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function getDriverLocationSmsUrl(passenger: Passenger, riderUrl: string) {
  const body = encodeURIComponent(
    `Hi ${passenger.name}, track my live pickup location in the SumoHaice rider app: ${riderUrl}`,
  );
  const separator = Platform.OS === 'ios' ? '&' : '?';

  return `sms:${passenger.phone.replace(/\s/g, '')}${separator}body=${body}`;
}

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || name;
}

function formatDeviceClock(date: Date) {
  const formattedTime = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(date);
  const hour = formattedTime.find((part) => part.type === 'hour')?.value ?? '00';
  const minute = formattedTime.find((part) => part.type === 'minute')?.value ?? '00';
  const period = formattedTime.find((part) => part.type === 'dayPeriod')?.value ?? '';

  return {
    time: `${hour}:${minute}`,
    period: period.toUpperCase(),
  };
}

function locationToPassenger(location: UserLocationInfo): Passenger {
  return {
    id: location.userId ?? normalizePhoneNumber(location.phoneNumber) ?? `${location.latitude}-${location.longitude}`,
    name: location.userName ?? location.name ?? 'Passenger',
    stop: 'Live location',
    eta: '--',
    phone: location.phoneNumber ?? '',
    status: 'ready',
    lastSeen: location.capturedAt ?? '',
    latitude: location.latitude,
    longitude: location.longitude,
  };
}

function mergePassengerRoster(
  currentPassengers: Passenger[],
  incomingPassengers: Passenger[],
) {
  const passengerById = new Map(
    currentPassengers.map((passenger) => [passenger.id, passenger]),
  );

  incomingPassengers.forEach((passenger) => {
    passengerById.set(passenger.id, {
      ...passengerById.get(passenger.id),
      ...passenger,
    });
  });

  return Array.from(passengerById.values());
}

function formatCapturedAtLabel(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `Updated ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

function normalizePhoneNumber(phoneNumber?: string) {
  return phoneNumber?.replace(/\D/g, '') ?? '';
}

async function createLocationShare(location: LocationPoint): Promise<LocationShare> {
  const capturedAt = new Date();
  const expiresAt = new Date(capturedAt.getTime() + 3 * 60 * 60 * 1000);
  const payload = {
    location,
    capturedAt: capturedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  // Placeholder for backend integration:
  // return fetch(`${API_BASE_URL}/location-shares`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // }).then((response) => response.json());
  return Promise.resolve({
    shareId: 'loc_123',
    shareToken: 'share_abc123',
    riderUrl: 'https://sumohaice.app/rider/location/share_abc123',
    ...payload,
  });
}

async function updateLocationShare(
  currentShare: LocationShare,
  location: LocationPoint,
): Promise<LocationShare> {
  const capturedAt = new Date();
  const payload = {
    location,
    capturedAt: capturedAt.toISOString(),
  };

  // Placeholder for backend integration:
  // return fetch(`${API_BASE_URL}/location-shares/${currentShare.shareId}/location`, {
  //   method: 'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // }).then((response) => response.json());
  return Promise.resolve({
    ...currentShare,
    ...payload,
  });
}

async function getUserLocation(): Promise<UserLocationInfo[]> {
  try {
    const response = await fetch(backendUserLocationsApiUrl);

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as UserLocationInfo[];
    return data.filter(
      (location) =>
        Number.isFinite(location.latitude) && Number.isFinite(location.longitude),
    );
  } catch {
    return [];
  }
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
  focusPickupButton: {
    alignItems: 'center',
    backgroundColor: '#e4eefc',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 30,
    minWidth: 104,
    paddingHorizontal: 10,
  },
  focusPickupText: {
    color: '#2559af',
    fontSize: 12,
    fontWeight: '900',
  },
  rosterHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rosterCollapseButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  rosterCollapseText: {
    color: '#2559af',
    fontSize: 12,
    fontWeight: '900',
  },
  addPassengerPanel: {
    backgroundColor: '#fffaf1',
    borderColor: '#eadfce',
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 10,
  },
  addPassengerToggle: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#e4eefc',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 34,
    paddingHorizontal: 12,
  },
  addPassengerToggleText: {
    color: '#2559af',
    fontSize: 13,
    fontWeight: '900',
  },
  addPassengerForm: {
    gap: 8,
  },
  formRow: {
    flexDirection: 'row',
    gap: 8,
  },
  formInput: {
    backgroundColor: '#ffffff',
    borderColor: '#eadfce',
    borderRadius: 8,
    borderWidth: 1,
    color: '#17211f',
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    minHeight: 40,
    paddingHorizontal: 10,
  },
  formInputCompact: {
    flex: 0.8,
  },
  addPassengerSubmit: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#dff4e8',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: 14,
  },
  addPassengerSubmitText: {
    color: '#14734b',
    fontSize: 13,
    fontWeight: '900',
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
    gap: 8,
    minHeight: 54,
    paddingHorizontal: 10,
    paddingVertical: 8,
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
    fontSize: 14,
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
  passengerRoute: {
    color: '#66716e',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 1,
  },
  passengerPhone: {
    color: '#8a8174',
    fontSize: 11,
    marginTop: 1,
  },
  passengerStatus: {
    alignItems: 'flex-end',
    width: 58,
  },
  statusText: {
    fontSize: 11,
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
  sentText: {
    color: '#2559af',
  },
  doneText: {
    color: '#14734b',
  },
  lastSeen: {
    color: '#8a8174',
    fontSize: 9,
    marginTop: 1,
    textAlign: 'right',
  },
  passengerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  locationToggle: {
    alignItems: 'center',
    backgroundColor: '#e4eefc',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 30,
    minWidth: 62,
    paddingHorizontal: 8,
  },
  locationToggleSent: {
    backgroundColor: '#eef3fb',
  },
  locationToggleText: {
    color: '#2559af',
    fontSize: 11,
    fontWeight: '900',
  },
  locationToggleTextSent: {
    color: '#5e6f8b',
  },
  pickupToggle: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 30,
    minWidth: 68,
    paddingHorizontal: 8,
  },
  pickupTogglePending: {
    backgroundColor: '#e4eefc',
  },
  pickupToggleDone: {
    backgroundColor: '#dff4e8',
  },
  pickupToggleText: {
    fontSize: 11,
    fontWeight: '900',
  },
  pickupToggleTextPending: {
    color: '#2559af',
  },
  pickupToggleTextDone: {
    color: '#14734b',
  },
});
