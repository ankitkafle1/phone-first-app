import type { StyleProp, ViewStyle } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import type { MapRegion } from './App';

type CurrentLocation = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
};

type MapSurfaceProps = {
  currentLocation: CurrentLocation | null;
  locationText: string;
  region: MapRegion;
  style: StyleProp<ViewStyle>;
};

export default function MapSurface({
  currentLocation,
  locationText,
  region,
  style,
}: MapSurfaceProps) {
  return (
    <MapView
      style={style}
      region={region}
      showsUserLocation
      showsMyLocationButton
    >
      {currentLocation ? (
        <Marker
          coordinate={currentLocation}
          title="Current location"
          description={locationText}
        />
      ) : null}
    </MapView>
  );
}
