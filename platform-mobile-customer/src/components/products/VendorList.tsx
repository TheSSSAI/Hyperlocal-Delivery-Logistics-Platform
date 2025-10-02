import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { VendorSummary } from '../../types/vendor.types';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorDisplay } from '../common/ErrorDisplay';

interface VendorListProps {
  vendors: VendorSummary[];
  onPressVendor: (vendorId: string) => void;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  listHeaderComponent?: React.ReactElement | null;
}

const VendorCard: React.FC<{ vendor: VendorSummary; onPress: (id: string) => void }> = React.memo(({ vendor, onPress }) => (
  <TouchableOpacity style={styles.cardContainer} onPress={() => onPress(vendor.id)} activeOpacity={0.7}>
    <Image 
      source={{ uri: vendor.bannerImageUrl || 'https://via.placeholder.com/300x150' }} 
      style={styles.cardImage} 
    />
    {!vendor.isOnline && (
      <View style={styles.closedOverlay}>
        <Text style={styles.closedText}>CLOSED</Text>
      </View>
    )}
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{vendor.storeName}</Text>
      <Text style={styles.cardSubtitle}>{vendor.cuisineTypes?.join(', ')}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.rating}>⭐ {vendor.averageRating.toFixed(1)}</Text>
        <Text style={styles.distance}>{vendor.distance?.toFixed(1)} km</Text>
      </View>
    </View>
  </TouchableOpacity>
));


export const VendorList: React.FC<VendorListProps> = ({
  vendors,
  onPressVendor,
  isLoading,
  error,
  onRefresh,
  listHeaderComponent,
}) => {
  if (isLoading && !vendors.length) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={onRefresh} />;
  }

  const renderItem = ({ item }: { item: VendorSummary }) => (
    <VendorCard vendor={item} onPress={onPressVendor} />
  );

  return (
    <FlatList
      data={vendors}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      onRefresh={onRefresh}
      refreshing={isLoading}
      ListHeaderComponent={listHeaderComponent}
      ListEmptyComponent={
        !isLoading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No vendors found nearby.</Text>
            <Text style={styles.emptySubtext}>Try searching in a different area.</Text>
          </View>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  closedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  closedText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Dimensions.get('window').height * 0.2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  }
});