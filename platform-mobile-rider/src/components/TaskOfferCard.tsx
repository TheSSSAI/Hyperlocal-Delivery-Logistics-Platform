import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { TaskOfferPayload } from '../features/task/task.types';
import { Location } from '../shared/types/task.types';
import polyline from '@mapbox/polyline';

interface TaskOfferCardProps {
  taskOffer: TaskOfferPayload;
  onAccept: (taskId: string) => void;
  onReject: (taskId: string) => void;
  isProcessing: boolean;
}

const { width } = Dimensions.get('window');

const TaskOfferCard: React.FC<TaskOfferCardProps> = ({
  taskOffer,
  onAccept,
  onReject,
  isProcessing,
}) => {
  const { task, expiresAt, route } = taskOffer;
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const expiryDate = new Date(expiresAt).getTime();
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = expiryDate - now;
      setTimeLeft(Math.max(0, Math.floor(difference / 1000)));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const decodedRoute = useMemo(() => {
    if (!route?.geometry) return [];
    // The geometry is expected to be a polyline encoded string
    const points = polyline.decode(route.geometry);
    return points.map(point => ({
      latitude: point[0],
      longitude: point[1],
    }));
  }, [route?.geometry]);

  const mapRegion = useMemo(() => {
    if (!task.pickupLocation || !task.dropoffLocation) return undefined;

    const midLat = (task.pickupLocation.latitude + task.dropoffLocation.latitude) / 2;
    const midLng = (task.pickupLocation.longitude + task.dropoffLocation.longitude) / 2;
    const latDelta = Math.abs(task.pickupLocation.latitude - task.dropoffLocation.latitude) * 1.5;
    const lngDelta = Math.abs(task.pickupLocation.longitude - task.dropoffLocation.longitude) * 1.5;

    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: Math.max(latDelta, 0.02),
      longitudeDelta: Math.max(lngDelta, 0.02),
    };
  }, [task.pickupLocation, task.dropoffLocation]);

  const formatDistance = (meters: number): string => {
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{timeLeft}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.metricRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>₹{task.earnings.toFixed(2)}</Text>
            <Text style={styles.metricLabel}>Earnings</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>{formatDistance(route?.distance || 0)}</Text>
            <Text style={styles.metricLabel}>Distance</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>{formatDuration(route?.duration || 0)}</Text>
            <Text style={styles.metricLabel}>Time</Text>
          </View>
        </View>

        <View style={styles.mapContainer}>
          {mapRegion && (
            <MapView style={styles.map} initialRegion={mapRegion} pitchEnabled={false} rotateEnabled={false} zoomEnabled={false} scrollEnabled={false}>
              <Marker coordinate={task.pickupLocation} title="Pickup" pinColor="blue" />
              <Marker coordinate={task.dropoffLocation} title="Dropoff" pinColor="green" />
              {decodedRoute.length > 0 && (
                <Polyline coordinates={decodedRoute} strokeColor="#1a73e8" strokeWidth={3} />
              )}
            </MapView>
          )}
        </View>

        <View style={styles.addressContainer}>
            <Text style={styles.addressLabel}>PICKUP</Text>
            <Text style={styles.addressText}>{task.pickupLocation.address}</Text>
            <Text style={styles.addressLabel}>DROPOFF</Text>
            <Text style={styles.addressText}>{task.dropoffLocation.address}</Text>
        </View>

      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [styles.button, styles.rejectButton, (pressed || isProcessing) && styles.buttonPressed]}
          onPress={() => onReject(task.id)}
          disabled={isProcessing || timeLeft === 0}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, styles.acceptButton, (pressed || isProcessing) && styles.buttonPressed]}
          onPress={() => onAccept(task.id)}
          disabled={isProcessing || timeLeft === 0}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  timerContainer: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 4,
    borderColor: '#1C1C1E'
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
    marginTop: 100,
    paddingHorizontal: 20,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginTop: 20,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
  },
  metricBox: {
    alignItems: 'center',
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  metricLabel: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 4,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
    backgroundColor: '#2C2C2E',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  addressContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
  },
  addressLabel: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  addressText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  button: {
    width: width * 0.4,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#34C759',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonPressed: {
    opacity: 0.7,
  },
});

export default TaskOfferCard;