import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { OrderSummary } from '../../features/orders/orders.types';

interface OrderHistoryItemProps {
  order: OrderSummary;
  onPress: (orderId: string) => void;
}

const getStatusColor = (status: string): string => {
  switch (status.toUpperCase()) {
    case 'DELIVERED':
      return '#4CAF50'; // Green
    case 'CANCELLED':
      return '#F44336'; // Red
    case 'IN TRANSIT':
      return '#2196F3'; // Blue
    default:
      return '#757575'; // Grey
  }
};

export const OrderHistoryItem: React.FC<OrderHistoryItemProps> = ({ order, onPress }) => {
  const handlePress = () => onPress(order.id);

  const formattedDate = new Date(order.placedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.vendorName}>{order.vendorName}</Text>
        <Text style={styles.total}>₹{order.total.toFixed(2)}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.date}>{formattedDate}</Text>
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: '#757575',
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});