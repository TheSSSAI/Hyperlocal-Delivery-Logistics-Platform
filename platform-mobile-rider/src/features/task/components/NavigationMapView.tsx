import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { Location } from '../../../shared/types/task.types';
import { environment } from '../../../config/environment';
import { navigationService } from '../../../lib/navigationService';
import { OnRouteProgressData } from '@rnmapbox/maps/lib/typescript/src/types/OnRouteProgressData';

MapboxGL.setAccessToken(environment.mapbox.accessToken);

interface NavigationMapViewProps {
  destination: Location;
  onProgressUpdate?: (progress: OnRouteProgressData) => void;
}

const NavigationMapView: React.FC<NavigationMapViewProps> = ({
  destination,
  onProgressUpdate,
}) => {
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const [route, setRoute] = useState<any>(null); // Mapbox Route object
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const newRoute = await navigationService.getRoute(destination);
        if (newRoute) {
          setRoute(newRoute);
        } else {
          setError('Could not calculate a route to the destination.');
        }
      } catch (e) {
        console.error('Failed to fetch route:', e);
        setError('Navigation service is temporarily unavailable.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoute();
  }, [destination]);

  useEffect(() => {
    // Center camera on the route when it's first loaded
    if (route && cameraRef.current) {
        cameraRef.current.fitBounds(
            [route.geometry.coordinates[0][0], route.geometry.coordinates[0][1]],
            [route.geometry.coordinates[route.geometry.coordinates.length - 1][0], route.geometry.coordinates[route.geometry.coordinates.length - 1][1]],
            [100, 40, 100, 40],
            500
        );
    }
  }, [route]);


  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.statusText}>Calculating route...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map} styleURL={MapboxGL.StyleURL.Dark}>
        <MapboxGL.UserLocation visible={true} showsUserHeadingIndicator={true} />
        <MapboxGL.Camera
          ref={cameraRef}
          followUserLocation
          followUserMode={MapboxGL.UserTrackingMode.FollowWithHeading}
          followZoomLevel={16}
        />
        {route && (
            <>
                <MapboxGL.ShapeSource id="routeSource" shape={route.geometry}>
                    <MapboxGL.LineLayer id="routeLine" style={{lineColor: '#007AFF', lineWidth: 7}} />
                </MapboxGL.ShapeSource>
                <MapboxGL.PointAnnotation
                    id="destination-marker"
                    coordinate={[destination.longitude, destination.latitude]}
                    title="Destination"
                />
            </>
        )}
         <MapboxGL.NavigationProgress onProgress={onProgressUpdate} />
      </MapboxGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  map: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
  },
  statusText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default NavigationMapView;