import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapSurface from './MapSurface';

const LOCATION_API_URL = 'https://example.com/api/current-location';
const SMS_API_URL = 'https://example.com/api/send-sms';
const FRIEND_PHONE_NUMBER = '+15555555555';

type CurrentLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
};

export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const DEFAULT_REGION: MapRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

type BrowserPosition = {
  coords: {
    accuracy: number | null;
    latitude: number;
    longitude: number;
  };
};

type BrowserPositionError = {
  code?: number;
  message?: string;
};

type BrowserPermissionStatus = {
  state: 'granted' | 'denied' | 'prompt';
};

const LOCATION_TIMEOUT_MS = 12000;
const PERMISSION_TIMEOUT_MS = 10000;

const withTimeout = async <T,>(
  promise: Promise<T>,
  timeoutMs: number,
  message: string
) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

const isChromeGeolocationAllowed = () => {
  if (Platform.OS !== 'web') {
    return true;
  }

  const { hostname, protocol } = globalThis.location;

  return (
    globalThis.isSecureContext ||
    protocol === 'https:' ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname === '[::1]'
  );
};

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation | null>(null);
  const [statusMessage, setStatusMessage] = useState('Share location to continue');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [shouldOpenSettings, setShouldOpenSettings] = useState(false);
  const [smsStatusMessage, setSmsStatusMessage] = useState('');

  const shareCurrentLocation = async (location: CurrentLocation) => {
    try {
      const payload = {
        ...location,
        capturedAt: new Date().toISOString(),
      };

      const response = await fetch(LOCATION_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn('Location API returned an error:', response.status);
      }
    } catch (error) {
      console.warn('Unable to share current location:', error);
    }
  };

  const saveCurrentLocation = (location: CurrentLocation) => {
    console.log('Current location:', location);
    setCurrentLocation(location);
    setStatusMessage('Current location');
    void shareCurrentLocation(location);
  };

  const loadCurrentLocationFromWeb = async () => {
    if (!isChromeGeolocationAllowed()) {
      setCurrentLocation(null);
      setStatusMessage('Chrome needs HTTPS or localhost to share location');
      return;
    }

    const geolocation = globalThis.navigator?.geolocation;

    if (!geolocation) {
      setCurrentLocation(null);
      setStatusMessage('Location is not available in this browser');
      return;
    }

    const position = await new Promise<BrowserPosition>((resolve, reject) => {
      geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      });
    });

    saveCurrentLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
    });
  };

  const getNativePosition = async () => {
    const locationServicesEnabled = await withTimeout(
      Location.hasServicesEnabledAsync(),
      PERMISSION_TIMEOUT_MS,
      'Checking location services timed out'
    );

    if (!locationServicesEnabled) {
      throw new Error('Location services are turned off');
    }

    try {
      const currentPosition = await withTimeout(
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        }),
        LOCATION_TIMEOUT_MS,
        'Getting current location timed out'
      );

      return currentPosition;
    } catch (error) {
      console.warn('Current location timed out, checking last known location:', error);
    }

    const lastKnownPosition = await withTimeout(
      Location.getLastKnownPositionAsync({
        maxAge: 300000,
        requiredAccuracy: 5000,
      }),
      5000,
      'Getting last known location timed out'
    );

    if (lastKnownPosition) {
      return lastKnownPosition;
    }

    throw new Error('Unable to get current location');
  };

  const loadCurrentLocationFromNative = async () => {
    const permission = await withTimeout(
      Location.getForegroundPermissionsAsync(),
      PERMISSION_TIMEOUT_MS,
      'Checking location permission timed out'
    );

    if (
      permission.status !== Location.PermissionStatus.GRANTED &&
      !permission.canAskAgain
    ) {
      setCurrentLocation(null);
      setShouldOpenSettings(true);
      setStatusMessage('Allow location for Expo Go in iOS Settings');
      return;
    }

    const { status, canAskAgain } = await withTimeout(
      Location.requestForegroundPermissionsAsync(),
      PERMISSION_TIMEOUT_MS,
      'Location permission request timed out'
    );

    if (status !== Location.PermissionStatus.GRANTED) {
      setCurrentLocation(null);
      setShouldOpenSettings(!canAskAgain);
      setStatusMessage(
        canAskAgain
          ? 'Share location to continue'
          : 'Allow location for Expo Go in iOS Settings'
      );
      return;
    }

    setShouldOpenSettings(false);
    setStatusMessage('Getting current location...');
    const position = await getNativePosition();

    saveCurrentLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
    });
  };

  const loadCurrentLocation = async () => {
    console.log('Share location pressed');
    setIsLoadingLocation(true);
    setStatusMessage(
      Platform.OS === 'web'
        ? 'Waiting for Chrome location permission...'
        : 'Opening location permission...'
    );

    try {
      if (Platform.OS === 'web') {
        await loadCurrentLocationFromWeb();
      } else {
        await loadCurrentLocationFromNative();
      }
    } catch (error) {
      console.warn('Unable to get current location:', error);
      setCurrentLocation(null);
      setStatusMessage(getLocationErrorMessage(error));
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const openAppSettings = async () => {
    if (Platform.OS === 'web') {
      return;
    }

    await Linking.openSettings();
  };

  useEffect(() => {
    const loadAlreadySharedLocation = async () => {
      try {
        if (Platform.OS === 'web') {
          const permission = await globalThis.navigator?.permissions?.query?.({
            name: 'geolocation' as PermissionName,
          });
          const browserPermission = permission as BrowserPermissionStatus | undefined;

          if (browserPermission?.state === 'granted') {
            setIsLoadingLocation(true);
            await loadCurrentLocationFromWeb();
            setIsLoadingLocation(false);
          }

          return;
        }

        const permission = await withTimeout(
          Location.getForegroundPermissionsAsync(),
          PERMISSION_TIMEOUT_MS,
          'Checking location permission timed out'
        );

        if (permission.status === Location.PermissionStatus.GRANTED) {
          setIsLoadingLocation(true);
          const lastKnownPosition = await withTimeout(
            Location.getLastKnownPositionAsync({
              maxAge: 300000,
              requiredAccuracy: 5000,
            }),
            5000,
            'Getting last known location timed out'
          );

          if (lastKnownPosition) {
            saveCurrentLocation({
              latitude: lastKnownPosition.coords.latitude,
              longitude: lastKnownPosition.coords.longitude,
              accuracy: lastKnownPosition.coords.accuracy,
            });
          }

          setIsLoadingLocation(false);
        }
      } catch (error) {
        console.warn('Unable to load already shared location:', error);
        setIsLoadingLocation(false);
      }
    };

    loadAlreadySharedLocation();
  }, []);

  const getLocationErrorMessage = (error: unknown) => {
    const locationError = error as BrowserPositionError;

    if (Platform.OS === 'web' && locationError.code === 1) {
      return 'Allow location in Chrome, then tap Share location again';
    }

    if (Platform.OS === 'web' && locationError.code === 3) {
      return 'Location timed out. Tap Share location again';
    }

    return 'Share location to continue';
  };

  const createLocationSmsMessage = (location: CurrentLocation) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;

    return `Here is my current location: ${mapsUrl}`;
  };

  const sendLocationSmsFromWeb = async (message: string) => {
    const response = await fetch(SMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: FRIEND_PHONE_NUMBER,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error(`SMS API returned ${response.status}`);
    }
  };

  const sendLocationSms = async () => {
    if (!currentLocation) {
      setSmsStatusMessage('Share location first');
      return;
    }

    try {
      const message = createLocationSmsMessage(currentLocation);

      if (Platform.OS === 'web') {
        setSmsStatusMessage('Sending SMS...');
        await sendLocationSmsFromWeb(message);
        setSmsStatusMessage('SMS sent');
        return;
      }

      const canSendSms = await SMS.isAvailableAsync();

      if (!canSendSms) {
        setSmsStatusMessage('SMS is not available on this device');
        return;
      }

      const result = await SMS.sendSMSAsync(
        [FRIEND_PHONE_NUMBER],
        message
      );

      console.log('SMS result:', result);
      setSmsStatusMessage('SMS ready to send');
    } catch (error) {
      console.warn('Unable to send location SMS:', error);
      setSmsStatusMessage('Unable to open SMS');
    }
  };

  const region = useMemo<MapRegion>(() => {
    if (!currentLocation) {
      return DEFAULT_REGION;
    }

    return {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }, [currentLocation]);

  const locationText = currentLocation
    ? `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`
    : statusMessage;

  if (!currentLocation) {
    const primaryLabel = isLoadingLocation
      ? 'Checking...'
      : shouldOpenSettings
        ? 'Open iOS Settings'
        : 'Share location';
    const handleShareLocationPress = () => {
      if (shouldOpenSettings) {
        void openAppSettings();
        return;
      }

      void loadCurrentLocation();
    };

    return (
      <View style={styles.permissionContainer}>
        {isLoadingLocation ? <ActivityIndicator color="#0f766e" size="large" /> : null}
        <Text style={styles.permissionTitle}>Share location</Text>
        <Text style={styles.permissionText}>{statusMessage}</Text>
        {Platform.OS === 'web' ? (
          <View style={styles.webButton}>
            <Button
              disabled={isLoadingLocation}
              onPress={handleShareLocationPress}
              title={primaryLabel}
            />
          </View>
        ) : (
          <Pressable
            disabled={isLoadingLocation}
            hitSlop={12}
            onPress={handleShareLocationPress}
            style={({ pressed }) => [
              styles.permissionButton,
              pressed || isLoadingLocation ? styles.permissionButtonPressed : null,
            ]}
          >
            <Text style={styles.permissionButtonText}>{primaryLabel}</Text>
          </Pressable>
        )}
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapSurface
        currentLocation={currentLocation}
        locationText={locationText}
        region={region}
        style={styles.map}
      />
      <View style={styles.locationPanel}>
        <Text style={styles.locationLabel}>{statusMessage}</Text>
        <Text style={styles.locationValue}>{locationText}</Text>
        <Pressable
          hitSlop={12}
          onPress={() => {
            void sendLocationSms();
          }}
          style={({ pressed }) => [
            styles.smsButton,
            pressed ? styles.permissionButtonPressed : null,
          ]}
        >
          <Text style={styles.smsButtonText}>Send location SMS</Text>
        </Pressable>
        {smsStatusMessage ? (
          <Text style={styles.smsStatus}>{smsStatusMessage}</Text>
        ) : null}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f1f3',
  },
  map: {
    flex: 1,
  },
  locationPanel: {
    backgroundColor: '#ffffff',
    borderTopColor: '#d7dbe0',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 12,
  },
  locationLabel: {
    color: '#5c6670',
    fontSize: 12,
    marginBottom: 4,
  },
  locationValue: {
    color: '#14181f',
    fontSize: 14,
    fontWeight: '600',
  },
  permissionContainer: {
    alignItems: 'center',
    backgroundColor: '#f0f1f3',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  permissionTitle: {
    color: '#14181f',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 18,
  },
  permissionText: {
    color: '#5c6670',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 320,
    textAlign: 'center',
  },
  permissionButton: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 8,
    marginTop: 22,
    minWidth: 160,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  permissionButtonPressed: {
    opacity: 0.72,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  webButton: {
    marginTop: 22,
    minWidth: 180,
  },
  smsButton: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 8,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  smsButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  smsStatus: {
    color: '#5c6670',
    fontSize: 12,
    marginTop: 8,
  },
});
