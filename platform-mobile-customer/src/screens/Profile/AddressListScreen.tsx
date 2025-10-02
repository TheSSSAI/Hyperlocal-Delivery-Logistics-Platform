import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useProfile } from '../../features/profile/useProfile';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { AddressListScreenProps } from '../../navigation/navigation.types';

// Implements CUS-009
const AddressListScreen = ({ navigation, route }: AddressListScreenProps) => {
  const { isSelectMode } = route.params || {};
  const { addresses, isLoading, error, fetchAddresses, deleteAddress } = useProfile();

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorDisplay message={error} onRetry={fetchAddresses} />;
    }
    if (addresses.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text>You have no saved addresses.</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={addresses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">{item.addressType || 'Address'}</Text>
              <Text>{item.addressLine1}</Text>
              <Text>{item.city}, {item.pincode}</Text>
            </Card.Content>
            <Card.Actions>
              {isSelectMode ? (
                 <Button onPress={() => {
                     // Here we would typically use a state management solution
                     // to set the selected address for checkout and navigate back.
                     navigation.goBack();
                 }}>Select</Button>
              ) : (
                <>
                  <Button onPress={() => navigation.navigate('AddEditAddress', { addressId: item.id })}>Edit</Button>
                  <Button onPress={() => deleteAddress(item.id)}>Delete</Button>
                </>
              )}
            </Card.Actions>
          </Card>
        )}
      />
    );
  };

  return (
    <ScreenWrapper>
      {renderContent()}
      {!isSelectMode && (
         <Button
            mode="contained"
            icon="plus"
            onPress={() => navigation.navigate('AddEditAddress', {})}
            style={styles.addButton}
          >
            Add New Address
        </Button>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    margin: 16,
  },
});

export default AddressListScreen;