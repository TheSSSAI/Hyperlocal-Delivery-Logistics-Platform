import React, { useEffect } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useOrders } from '../../features/orders/useOrders';
import { OrderHistoryItem } from '../../components/orders/OrderHistoryItem';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { OrderHistoryScreenProps } from '../../navigation/navigation.types';

// Implements CUS-039
const OrderHistoryScreen = ({ navigation }: OrderHistoryScreenProps) => {
  const { orders, isLoading, error, fetchOrderHistory } = useOrders();

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorDisplay message={error} onRetry={fetchOrderHistory} />;
    }
    if (orders.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="headlineMedium">You have no past orders</Text>
          <Text>Start shopping to see your orders here.</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <OrderHistoryItem 
            order={item} 
            onPress={() => {
                if(item.status === 'DELIVERED' && !item.isRated) {
                     navigation.navigate('Rating', { orderId: item.id })
                } else {
                     // Navigate to a read-only order detail screen
                }
            }}
          />
        )}
        onRefresh={fetchOrderHistory}
        refreshing={isLoading}
      />
    );
  };

  return <ScreenWrapper>{renderContent()}</ScreenWrapper>;
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrderHistoryScreen;