import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Searchbar, ActivityIndicator } from 'react-native-paper';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useProducts } from '../../features/products/useProducts';
import { SearchResultsScreenProps } from '../../navigation/navigation.types';
import { VendorList } from '../../components/products/VendorList';
import { ProductCard } from '../../components/products/ProductCard';
import { useCart } from '../../features/cart/useCart';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';

// Implements CUS-011 and CUS-012
const SearchResultsScreen = ({ route, navigation }: SearchResultsScreenProps) => {
  const { query } = route.params;
  const [searchQuery, setSearchQuery] = useState(query);
  const { searchResults, isLoading, error, search } = useProducts();
  const { addToCart, updateQuantity, getCartItemQuantity } = useCart();

  useEffect(() => {
    if (query) {
      search(query, {}); // Initial search without filters
    }
  }, [query]);

  const onSearchSubmit = () => {
    if (searchQuery.trim()) {
      search(searchQuery.trim(), {});
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator animating={true} size="large" style={styles.loader} />;
    }
    if (error) {
      return <ErrorDisplay message={error} onRetry={onSearchSubmit} />;
    }
    if (!searchResults || (searchResults.vendors.length === 0 && searchResults.products.length === 0)) {
      return <Text style={styles.emptyText}>No results found for "{searchQuery}"</Text>;
    }

    const data = [
      ...(searchResults.vendors.length > 0 ? [{ type: 'header', title: 'Stores' }, ...searchResults.vendors] : []),
      ...(searchResults.products.length > 0 ? [{ type: 'header', title: 'Items' }, ...searchResults.products] : []),
    ];

    return (
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id || `header-${index}`}
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return <Text style={styles.sectionHeader}>{item.title}</Text>;
          }
          if (item.storeName) { // Assuming this is how we identify a vendor
            return (
              <VendorList
                vendors={[item]}
                onVendorPress={(vendorId) => navigation.navigate('VendorDetail', { vendorId })}
              />
            );
          } else { // It's a product
            return (
              <ProductCard
                product={item}
                onAddToCart={() => addToCart(item)}
                onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
                cartQuantity={getCartItemQuantity(item.id)}
              />
            );
          }
        }}
      />
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search for stores or items"
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={onSearchSubmit}
          style={styles.searchbar}
        />
        {/* FilterComponent would be added here to implement CUS-012 */}
      </View>
      <View style={styles.content}>
        {renderContent()}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
  },
  searchbar: {
    // styles for searchbar
  },
  content: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
});

export default SearchResultsScreen;