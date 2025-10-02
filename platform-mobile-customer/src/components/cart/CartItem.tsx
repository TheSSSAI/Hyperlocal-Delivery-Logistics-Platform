import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { CartItem as CartItemType } from '../../features/cart/cart.types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemove: (productId: string) => void;
}

const MAX_QUANTITY = 10; // Example business rule

export const CartItem: React.FC<CartItemProps> = React.memo(({ item, onUpdateQuantity, onRemove }) => {
  const handleIncrease = () => {
    if (item.quantity < (item.stock || MAX_QUANTITY)) {
      onUpdateQuantity(item.product.id, item.quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.product.id, item.quantity - 1);
    } else {
      onRemove(item.product.id);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.product.imageUrl || 'https://via.placeholder.com/100' }}
        style={styles.image}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.name} numberOfLines={2}>{item.product.name}</Text>
        <Text style={styles.price}>₹{item.product.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.quantityButton} onPress={handleDecrease}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity 
          style={styles.quantityButton} 
          onPress={handleIncrease} 
          disabled={item.quantity >= (item.stock || MAX_QUANTITY)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    minWidth: 30,
    textAlign: 'center',
  },
});