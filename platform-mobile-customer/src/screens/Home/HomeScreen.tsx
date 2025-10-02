import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { VendorList } from '../../components/products/VendorList';
import { useProducts } from '../../features/products/useProducts';
import { usePermissions } from '../../hooks/usePermissions';
import { locationService } from '../../services/locationService';
import { HomeScreenProps } from '../../navigation/navigation.types';
import { PERMISSIONS, RESULTS } from 'react-native-permissions';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';

// Implements CUS-010: Customer Views Nearby Vendors Based on Current Location
const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { vendors, isLoading, error, fetchNearbyVendors } = useProducts();
  const { checkPermission, requestPermission } = usePermissions();
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleLocationAndFetch = async () => {
    setLocationError(null);
    try {
      let status = await checkPermission(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (status !== RESULTS.GRANTED) {
        status = await requestPermission(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      }

      if (status === RESULTS.GRANTED) {
        const location = await locationService.getCurrentLocation();
        fetchNearbyVendors({ lat: location.latitude, lng: location.longitude });
      } else {
        setLocationError('Location permission is required to find nearby stores. Please enable it in your settings.');
      }
    } catch (e) {
      setLocationError('Could not determine your location. Please check your GPS and try again.');
    }
  };

  useEffect(() => {
    handleLocationAndFetch();
  }, []);

  const onSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigation.navigate('SearchResults', { query: searchQuery.trim() });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorDisplay message={error} onRetry={handleLocationAndFetch} />;
    }
    if (locationError) {
      return <ErrorDisplay message={locationError} onRetry={handleLocationAndFetch} />;
    }
    if (vendors.length === 0) {
        return <Text style={styles.emptyText}>Sorry, no stores are currently available in your area.</Text>
    }
    return (
      <VendorList
        vendors={vendors}
        onVendorPress={(vendorId) => navigation.navigate('VendorDetail', { vendorId })}
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
    
  },
  content: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen;