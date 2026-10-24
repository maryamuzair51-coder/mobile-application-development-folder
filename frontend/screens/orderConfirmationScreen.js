import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styling/theme';


export default function OrderConfirmationScreen({ navigation, route }) {
  const params = route?.params || {};
  const order = params.order || {};
  const total = Number(params.total || 0);
  const paymentMethod = params.paymentMethod || 'cod';

  const paymentLabels = {
    card: 'Credit / Debit Card',
    bank: 'Bank Transfer',
    cod: 'Cash on Delivery',
  };

  const orderNumber =
    order.orderNumber || order.id || 'Order received';

  const goHome = () => {
    // Return to the existing Home tab.
    let parent = navigation;

    while (parent?.getParent?.()) {
      parent = parent.getParent();
    }

    parent?.navigate('Main', {
      screen: 'Shop',
      params: { screen: 'Home' },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.cream}
      />

      <View style={styles.content}>
        <Ionicons
          name="checkmark-circle"
          size={92}
          color={COLORS.success}
        />

        <Text style={styles.title}>Thank You!</Text>

        <Text style={styles.subtitle}>
          Your order has been placed successfully.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Order Number</Text>
          <Text style={styles.value}>{orderNumber}</Text>

          <View style={styles.divider} />

          <Text style={styles.label}>Payment Method</Text>
          <Text style={styles.value}>
            {paymentLabels[paymentMethod] || paymentMethod}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.label}>Total Payable</Text>
          <Text style={styles.total}>
            Rs. {total.toLocaleString('en-PK')}
          </Text>
        </View>

        <Text style={styles.message}>
          Thank you for choosing MOVEDA. We look forward to serving you!
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={goHome}
        >
          <Text style={styles.buttonText}>Continue Shopping</Text>
          <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 18,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  total: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#E9DDD2',
    marginVertical: 16,
  },
  message: {
    fontSize: 13,
    color: COLORS.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
    marginVertical: 22,
  },
  button: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
