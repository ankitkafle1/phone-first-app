import type { CSSProperties } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
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

const iframeStyle: CSSProperties = {
  border: 0,
  flex: 1,
  width: '100%',
};

export default function MapSurface({ region }: MapSurfaceProps) {
  return (
    <iframe
      src={`https://www.google.com/maps?q=${region.latitude},${region.longitude}&z=15&output=embed`}
      style={iframeStyle}
      title="Current location map"
    />
  );
}
