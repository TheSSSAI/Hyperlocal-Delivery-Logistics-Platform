import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useOrders } from '../../features/orders/useOrders';
import { OrderTrackingScreenProps } from '../../navigation/navigation.types';
import { realtimeService } from '../../services/realtimeService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';

// Implements CUS-027, CUS-028, CUS-029
const OrderTrackingScreen = ({ route, navigation }: OrderTrackingScreenProps) => {
  const { orderId } = route.params;
  const { activeOrder, fetchOrderById, isLoading, error } = useOrders();
  const [riderLocation, setRiderLocation] = useState(null);
  const [isStale, setIsStale] = useState(false);
  const [lastSeen, setLastSeen] = useState('');

  useEffect(() => {
    fetchOrderById(orderId);

    const locationSub = realtimeService.subscribeToRiderLocation(orderId, (location) => {
      setRiderLocation(location);
      setIsStale(false);
    });
    
    const staleSub = realtimeService.subscribeToRiderSignalLoss(orderId, (data) => {
        setIsStale(true);
        setLastSeen(data.lastSeen);
    });

    return () => {
      locationSub.unsubscribe();
      staleSub.unsubscribe();
    };
  }, [orderId, fetchOrderById]);

  if (isLoading && !activeOrder) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={() => fetchOrderById(orderId)} />;
  }
  
  if (!activeOrder) {
      return <ErrorDisplay message="Order not found." />;
  }

  const vendorCoords = activeOrder.vendor.location;
  const customerCoords = activeOrder.deliveryAddress.location;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: (vendorCoords.lat + customerCoords.lat) / 2,
            longitude: (vendorCoords.lng + customerCoords.lng) / 2,
            latitudeDelta: Math.abs(vendorCoords.lat - customerCoords.lat) * 1.5,
            longitudeDelta: Math.abs(vendorCoords.lng - customerCoords.lng) * 1.5,
          }}
        >
          <Marker coordinate={{ latitude: vendorCoords.lat, longitude: vendorCoords.lng }} title="Vendor" pinColor="blue" />
          <Marker coordinate={{ latitude: customerCoords.lat, longitude: customerCoords.lng }} title="You" pinColor="green" />
          {riderLocation && (
            <Marker
              coordinate={{ latitude: riderLocation.lat, longitude: riderLocation.lng }}
              title="Rider"
              opacity={isStale ? 0.6 : 1.0}
            />
          )}
        </MapView>
        <Card style={styles.statusCard}>
          <Card.Content>
            <Text variant="titleLarge">Order Status: {activeOrder.status}</Text>
            {isStale && <Text>Rider location last seen: {lastSeen}</Text>}
            <Text>ETA: {activeOrder.eta || 'Calculating...'}</Text>
            <View style={styles.buttonRow}>
                 <Button onPress={() => navigation.navigate('Chat', { orderId, recipient: 'RIDER' })}>Chat with Rider</Button>
                 <Button onPress={() => navigation.navigate('Chat', { orderId, recipient: 'VENDOR' })}>Chat with Vendor</Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  statusCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  }
});

export default OrderTrackingScreen;