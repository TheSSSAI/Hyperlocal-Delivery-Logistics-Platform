import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Product } from '../../types/product.types';

interface ProductCardProps {
  product: Product;
  onPress: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  // This could be enhanced to show a quantity stepper if item is already in cart
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 24; // Two cards per row with some padding

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, onAddToCart }) => {

  const isAvailable = product.stockStatus !== 'OUT_OF_STOCK';

  const handleAddToCart = () => {
    if (isAvailable) {
      onAddToCart(product);
    }
  };

  const handleCardPress = () => {
    onPress(product.id);
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handleCardPress} activeOpacity={0.8}>
      <Image
        source={{ uri: product.imageUrl || 'https://via.placeholder.com/150' }}
        style={styles.image}
        resizeMode="cover"
      />
      {product.stockStatus !== 'AVAILABLE' && (
        <View style={[
          styles.statusBadge,
          product.stockStatus === 'OUT_OF_STOCK' ? styles.outOfStockBadge : styles.limitedStockBadge,
        ]}>
          <Text style={styles.statusText}>
            {product.stockStatus === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Limited Stock'}
          </Text>
        </View>
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>₹{product.price.toFixed(2)}</Text>
          <TouchableOpacity 
            style={[styles.addButton, !isAvailable && styles.addButtonDisabled]} 
            onPress={handleAddToCart}
            disabled={!isAvailable}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  outOfStockBadge: {
    backgroundColor: 'rgba(211, 47, 47, 0.8)',
  },
  limitedStockBadge: {
    backgroundColor: 'rgba(249, 168, 37, 0.9)',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    minHeight: 36, // To ensure consistent height
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#4CAF50', // A primary color
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
  },
});