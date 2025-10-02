import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useCart } from '../../features/cart/useCart';
import { CartItem } from '../../components/cart/CartItem';
import { CartScreenProps } from '../../navigation/navigation.types';

// Implements CUS-017, CUS-018, CUS-019
const CartScreen = ({ navigation }: CartScreenProps) => {
  const { cart, updateQuantity, removeFromCart, subtotal, taxes, deliveryFee, total } = useCart();

  if (cart.items.length === 0) {
    return (
      <ScreenWrapper>
        <View style={styles.emptyContainer}>
          <Text variant="headlineMedium">Your cart is empty</Text>
          <Button mode="contained" onPress={() => navigation.navigate('Home')} style={styles.shopButton}>
            Start Shopping
          </Button>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <FlatList
        data={cart.items}
        keyExtractor={item => item.productId}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onUpdateQuantity={(quantity) => updateQuantity(item.productId, quantity)}
            onRemove={() => removeFromCart(item.productId)}
          />
        )}
        ListFooterComponent={
          <View style={styles.summaryContainer}>
            <Text variant="headlineSmall" style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text variant="bodyLarge">Subtotal</Text>
              <Text variant="bodyLarge">₹{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodyLarge">Taxes</Text>
              <Text variant="bodyLarge">₹{taxes.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodyLarge">Delivery Fee</Text>
              <Text variant="bodyLarge">₹{deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text variant="titleLarge">Total</Text>
              <Text variant="titleLarge">₹{total.toFixed(2)}</Text>
            </View>
          </View>
        }
      />
      <View style={styles.checkoutButtonContainer}>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Checkout')}
          style={styles.checkoutButton}
          labelStyle={styles.checkoutButtonLabel}
        >
          Proceed to Checkout
        </Button>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopButton: {
    marginTop: 20,
  },
  summaryContainer: {
    padding: 16,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  summaryTitle: {
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  checkoutButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  checkoutButton: {
    paddingVertical: 8,
  },
  checkoutButtonLabel: {
    fontSize: 16,
  },
});

export default CartScreen;