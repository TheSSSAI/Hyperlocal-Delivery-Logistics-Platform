import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useProducts } from '../../features/products/useProducts';
import { VendorDetailScreenProps } from '../../navigation/navigation.types';
import { ProductCard } from '../../components/products/ProductCard';
import { useCart } from '../../features/cart/useCart';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';

// Implements CUS-013: Customer Views Vendor Profile Page
const VendorDetailScreen = ({ route }: VendorDetailScreenProps) => {
  const { vendorId } = route.params;
  const { selectedVendor, isLoading, error, fetchVendorById } = useProducts();
  const { addToCart, updateQuantity, getCartItemQuantity } = useCart();

  useEffect(() => {
    fetchVendorById(vendorId);
  }, [vendorId, fetchVendorById]);

  if (isLoading && !selectedVendor) {
    return <ActivityIndicator animating={true} size="large" style={styles.loader} />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={() => fetchVendorById(vendorId)} />;
  }

  if (!selectedVendor) {
    return (
      <ScreenWrapper>
        <Text style={styles.emptyText}>Vendor not found.</Text>
      </ScreenWrapper>
    );
  }

  const renderProduct = ({ item }: { item: any }) => (
    <ProductCard
      product={item}
      onAddToCart={() => addToCart(item)}
      onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
      cartQuantity={getCartItemQuantity(item.id)}
    />
  );
  
  const groupedProducts = selectedVendor.products.reduce((acc, product) => {
      const category = product.categoryName || 'Uncategorized';
      if (!acc[category]) {
          acc[category] = [];
      }
      acc[category].push(product);
      return acc;
  }, {} as Record<string, any[]>);

  const sections = Object.keys(groupedProducts).map(category => ({
      title: category,
      data: groupedProducts[category]
  }));

  return (
    <ScreenWrapper>
      <FlatList
        ListHeaderComponent={
          <>
            <Image source={{ uri: selectedVendor.bannerImage || 'https://via.placeholder.com/400x200' }} style={styles.banner} />
            <View style={styles.headerContainer}>
              <Text variant="headlineMedium">{selectedVendor.storeName}</Text>
              <Text variant="bodyMedium">{selectedVendor.address}</Text>
              <Text variant="bodyMedium">⭐ {selectedVendor.averageRating.toFixed(1)}</Text>
              <Text variant="bodyLarge" style={selectedVendor.isOnline ? styles.open : styles.closed}>
                {selectedVendor.isOnline ? 'Open' : 'Currently Closed'}
              </Text>
            </View>
          </>
        }
        data={sections.flatMap(section => [{isHeader: true, title: section.title}, ...section.data])}
        keyExtractor={(item, index) => item.id || `header-${index}`}
        renderItem={({item}) => {
            if (item.isHeader) {
                return <Text style={styles.categoryHeader}>{item.title}</Text>;
            }
            return renderProduct({item});
        }}
        contentContainerStyle={styles.listContent}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: 200,
  },
  headerContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  open: {
    color: 'green',
    fontWeight: 'bold',
  },
  closed: {
    color: 'red',
    fontWeight: 'bold',
  },
  categoryHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
      textAlign: 'center',
      marginTop: 50,
      fontSize: 16,
  }
});

export default VendorDetailScreen;