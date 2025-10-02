import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, RadioButton } from 'react-native-paper';
import { ScreenWrapper } from '../../components/common/ScreenWrapper';
import { PaymentScreenProps } from '../../navigation/navigation.types';
import { useOrders } from '../../features/orders/useOrders';
import { useCart } from '../../features/cart/useCart';
import RazorpayCheckout from 'react-native-razorpay';
import { environment } from '../../config/environment';

// Implements CUS-022, CUS-023, CUS-024, CUS-025
const PaymentScreen = ({ route, navigation }: PaymentScreenProps) => {
  const { addressId, vendorInstructions, riderInstructions } = route.params;
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD' | null>(null);
  const { createOrder, isLoading, error } = useOrders();
  const { cart, total, clearCart } = useCart();
  
  // This would be fetched from a config service in a real app
  const COD_LIMIT = 2500;

  const handlePayment = async () => {
    if (!paymentMethod) {
      Alert.alert("Payment Method", "Please select a payment method.");
      return;
    }

    const orderPayload = {
      items: cart.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      addressId,
      paymentMethod,
      vendorInstructions,
      riderInstructions,
    };

    const result = await createOrder(orderPayload);
    
    if (result && result.success) {
      if (paymentMethod === 'ONLINE' && result.paymentDetails) {
        // CUS-025: Initiate online payment
        const options = {
          description: `Payment for Order ${result.order.id}`,
          image: 'https://your.logo.url/image.png',
          currency: 'INR',
          key: environment.razorpayKeyId,
          amount: result.paymentDetails.amount,
          name: 'Hyperlocal Marketplace',
          order_id: result.paymentDetails.orderId,
          prefill: {
            // email: user.email,
            // contact: user.mobile,
            // name: user.name
          },
          theme: { color: '#6200ee' }
        };
        RazorpayCheckout.open(options).then(async (data) => {
          // handle success
          Alert.alert(`Success`, `Payment successful: ${data.razorpay_payment_id}`);
          // The backend should confirm via webhook, but we can optimistically navigate
          await clearCart();
          navigation.replace('OrderConfirmation', { orderId: result.order.id });
        }).catch((error) => {
          // handle failure
          Alert.alert(`Error`, `Payment failed: ${error.code} ${error.description}`);
        });

      } else if (paymentMethod === 'COD') {
        // CUS-022: Confirm COD order
        await clearCart();
        navigation.replace('OrderConfirmation', { orderId: result.order.id });
      }
    } else {
       // CUS-024: Handles stock-out and other pre-payment errors from createOrder
       Alert.alert("Order Failed", error || "Could not place your order. Please try again.");
    }
  };

  const isCodDisabled = total > COD_LIMIT;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>Select Payment Method</Text>

        <RadioButton.Group onValueChange={newValue => setPaymentMethod(newValue as any)} value={paymentMethod}>
          <View style={styles.option}>
            <Text>UPI / Credit / Debit Card</Text>
            <RadioButton value="ONLINE" />
          </View>
          <View style={styles.option}>
            <View>
              <Text style={isCodDisabled ? styles.disabledText : {}}>Cash on Delivery</Text>
              {isCodDisabled && <Text style={styles.disabledSubText}>Not available for orders over ₹{COD_LIMIT}</Text>}
            </View>
            <RadioButton value="COD" disabled={isCodDisabled} />
          </View>
        </RadioButton.Group>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handlePayment}
          disabled={!paymentMethod || isLoading}
          loading={isLoading}
          style={styles.button}
        >
          {paymentMethod === 'COD' ? 'Confirm Order' : 'Proceed to Pay'}
        </Button>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  disabledText: {
    color: '#999',
  },
  disabledSubText: {
      color: '#999',
      fontSize: 12,
  },
  errorText: {
      color: 'red',
      textAlign: 'center',
      marginTop: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    paddingVertical: 8,
  },
});

export default PaymentScreen;