import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, TextInput, Card } from 'react-native-paper';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { useOrders } from '../../features/orders/useOrders';
import { RatingScreenProps } from '../../navigation/navigation.types';
// Assume a StarRating component exists in the shared UI library
// import { StarRating } from 'REPO-UI-COMPONENTS';

// Placeholder StarRating for demonstration
const StarRating = ({ rating, onRate }: { rating: number, onRate: (r: number) => void }) => (
    <View style={{ flexDirection: 'row' }}>
        {[1,2,3,4,5].map(r => 
            <Button key={r} onPress={() => onRate(r)}>{r <= rating ? '★' : '☆'}</Button>
        )}
    </View>
);


// Implements CUS-037, CUS-038
const RatingScreen = ({ route, navigation }: RatingScreenProps) => {
  const { orderId } = route.params;
  const { submitRating, isLoading } = useOrders();

  const [vendorRating, setVendorRating] = useState(0);
  const [vendorReview, setVendorReview] = useState('');
  const [riderRating, setRiderRating] = useState(0);
  const [riderReview, setRiderReview] = useState('');

  const handleSubmit = async () => {
    if (vendorRating === 0 || riderRating === 0) {
      Alert.alert("Rating Required", "Please provide a star rating for both the vendor and the rider.");
      return;
    }

    const success = await submitRating({
      orderId,
      vendor: { rating: vendorRating, review: vendorReview },
      rider: { rating: riderRating, review: riderReview },
    });

    if (success) {
      Alert.alert("Thank You!", "Your feedback has been submitted.");
      navigation.goBack();
    } else {
      Alert.alert("Error", "Failed to submit your rating. Please try again.");
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>Rate Your Experience</Text>
        <Text style={styles.subtitle}>Order ID: {orderId}</Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Rate the Vendor</Text>
            <StarRating rating={vendorRating} onRate={setVendorRating} />
            <TextInput
              label="Tell us about the products and vendor..."
              value={vendorReview}
              onChangeText={setVendorReview}
              multiline
              mode="outlined"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Rate the Delivery</Text>
            <StarRating rating={riderRating} onRate={setRiderRating} />
            <TextInput
              label="Tell us about the rider and delivery..."
              value={riderReview}
              onChangeText={setRiderReview}
              multiline
              mode="outlined"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          Submit Ratings
        </Button>
      </ScrollView>
    </ScreenWrapper>
  );
};

// Need to import ScrollView
import { ScrollView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
      textAlign: 'center',
      marginBottom: 20,
      color: '#666'
  },
  card: {
    marginBottom: 20,
  },
  input: {
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
});

export default RatingScreen;