
// ============================================
// MODEVA CHECKOUT SCREEN
// File: frontend/screens/checkoutScreen.js
// ============================================

import React, { useState } from 'react';

import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS as C } from '../../styling/theme';
import { useCart } from './cartScreen';

// Available payment methods
const PAYMENT_METHODS = [
  {
    id: 'card',
    title: 'Credit / Debit Card',
    icon: 'card-outline',
  },
  {
    id: 'bank',
    title: 'Bank Transfer',
    icon: 'business-outline',
  },
  {
    id: 'cod',
    title: 'Cash on Delivery',
    icon: 'cash-outline',
  },
];

export default function CheckoutScreen({ navigation }) {
  // Get cart information from the existing cart context
  const {
    cartItems = [],
    subtotal = 0,
    discount = 0,
    total = 0,
    clearCart,
  } = useCart();

  // Shipping form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Payment selection and demo card fields
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  // Reusable input field
  const renderInput = (
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default'
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.muted}
        keyboardType={keyboardType}
        autoCapitalize={
          keyboardType === 'email-address' ? 'none' : 'words'
        }
      />
    </View>
  );

  // Validate the checkout form before placing the order
  const validateForm = () => {
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !postalCode.trim()
    ) {
      Alert.alert(
        'Missing Information',
        'Please complete all shipping address fields.'
      );
      return false;
    }

    // Basic phone-number validation
    const phoneDigits = phone.replace(/\D/g, '');

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid phone number.'
      );
      return false;
    }

    // Validate card details when card payment is selected.
    // These fields are for a demonstration only; no payment is processed.
    if (paymentMethod === 'card') {
      const digitsOnly = cardNumber.replace(/\s/g, '');

      if (
        !cardholderName.trim() ||
        !/^\d{13,19}$/.test(digitsOnly) ||
        !/^\d{2}\/\d{2}$/.test(expiryDate) ||
        !/^\d{3,4}$/.test(cvc)
      ) {
        Alert.alert(
          'Invalid Card Details',
          'Please check the cardholder name, card number, expiry date (MM/YY), and CVC.'
        );
        return false;
      }
    }

    return true;
  };

  // Create the order and open the confirmation screen
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      Alert.alert('Your Cart Is Empty', 'Add items before checking out.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    const orderDetails = {
      orderNumber: `MD${Date.now()}`,
      customerName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      paymentMethod,
      items: [...cartItems],
      subtotal,
      discount,
      total,
      orderDate: new Date().toISOString(),
    };

    // Card and bank payments are demo-only in this project.
    // Do not collect or process real card details.
    if (paymentMethod !== 'cod') {
      Alert.alert(
        'Demo Payment',
        'Online payment is not connected yet. Please select Cash on Delivery to place a demo order.'
      );
      return;
    }

    Alert.alert(
      'Confirm Your Order',
      `Place your Modeva order for Rs. ${Number(total).toLocaleString()}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Place Order',
          onPress: () => {
            // Clear the cart after the customer confirms the order
            clearCart();

            // Open the existing order confirmation screen
            navigation.navigate('OrderConfirmation', orderDetails);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={C.background}
      />

      {/* Screen header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={23} color={C.text} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.brandName}>MODEVA</Text>
          <Text style={styles.headerSubtitle}>CHECKOUT</Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons name="lock-closed-outline" size={20} color={C.primary} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Shipping information */}
        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionIcon}>
              <Ionicons name="location-outline" size={21} color={C.primary} />
            </View>

            <View>
              <Text style={styles.sectionTitle}>Shipping Address</Text>
              <Text style={styles.sectionSubtitle}>
                Where should we deliver your order?
              </Text>
            </View>
          </View>

          {renderInput(
            'Full Name',
            fullName,
            setFullName,
            'Enter your full name'
          )}

          {renderInput(
            'Phone Number',
            phone,
            setPhone,
            '03XX XXXXXXX',
            'phone-pad'
          )}

          {renderInput(
            'Street Address',
            address,
            setAddress,
            'House number, street, area'
          )}

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              {renderInput(
                'City',
                city,
                setCity,
                'Enter city'
              )}
            </View>

            <View style={styles.halfWidth}>
              {renderInput(
                'Postal Code',
                postalCode,
                setPostalCode,
                'Postal code',
                'number-pad'
              )}
            </View>
          </View>
        </View>

        {/* Payment method selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionIcon}>
              <Ionicons name="wallet-outline" size={21} color={C.primary} />
            </View>

            <View>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <Text style={styles.sectionSubtitle}>
                Choose how you want to pay
              </Text>
            </View>
          </View>

          {PAYMENT_METHODS.map((method) => {
            const selected = paymentMethod === method.id;

            return (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentOption,
                  selected && styles.paymentOptionSelected,
                ]}
                onPress={() => setPaymentMethod(method.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={method.icon}
                  size={23}
                  color={selected ? C.primary : C.muted}
                />

                <Text
                  style={[
                    styles.paymentTitle,
                    selected && styles.paymentTitleSelected,
                  ]}
                >
                  {method.title}
                </Text>

                <View
                  style={[
                    styles.radioOuter,
                    selected && styles.radioOuterSelected,
                  ]}
                >
                  {selected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Show card fields only when card payment is selected */}
          {paymentMethod === 'card' && (
            <View style={styles.cardDetails}>
              <Text style={styles.cardNote}>
                Demo form only — do not enter real payment details.
              </Text>

              {renderInput(
                'Cardholder Name',
                cardholderName,
                setCardholderName,
                'Name on card'
              )}

              {renderInput(
                'Card Number',
                cardNumber,
                setCardNumber,
                'Enter card number',
                'number-pad'
              )}

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  {renderInput(
                    'Expiry Date',
                    expiryDate,
                    setExpiryDate,
                    'MM/YY',
                    'numbers-and-punctuation'
                  )}
                </View>

                <View style={styles.halfWidth}>
                  {renderInput(
                    'CVC',
                    cvc,
                    setCvc,
                    '3 or 4 digits',
                    'number-pad'
                  )}
                </View>
              </View>
            </View>
          )}

          {paymentMethod === 'bank' && (
            <View style={styles.notice}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={C.primary}
              />
              <Text style={styles.noticeText}>
                Bank transfer is not connected yet. This option is for
                demonstration purposes.
              </Text>
            </View>
          )}

          {paymentMethod === 'cod' && (
            <View style={styles.notice}>
              <Ionicons name="checkmark-circle-outline" size={20} color={C.success} />
              <Text style={styles.noticeText}>
                Pay in cash when your order is delivered.
              </Text>
            </View>
          )}
        </View>

        {/* Order price breakdown */}
        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionIcon}>
              <Ionicons name="receipt-outline" size={21} color={C.primary} />
            </View>

            <View>
              <Text style={styles.sectionTitle}>Order Summary</Text>
              <Text style={styles.sectionSubtitle}>
                Review your total before placing the order
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              Rs. {Number(subtotal).toLocaleString()}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <Text style={styles.discountValue}>
              - Rs. {Number(discount).toLocaleString()}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.freeText}>FREE</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              Rs. {Number(total).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Place order button */}
        <TouchableOpacity
          style={[
            styles.placeOrderButton,
            cartItems.length === 0 && styles.disabledButton,
          ]}
          onPress={handlePlaceOrder}
          activeOpacity={0.85}
        >
          <Text style={styles.placeOrderText}>PLACE ORDER</Text>
          <Ionicons name="arrow-forward" size={19} color={C.white} />
        </TouchableOpacity>

        {/* Small trust message */}
        <View style={styles.secureNote}>
          <Ionicons name="shield-checkmark-outline" size={17} color={C.success} />
          <Text style={styles.secureNoteText}>
            Thank you for shopping with Modeva.
          </Text>
        </View>

        <Text style={styles.footerText}>MODEVA · STYLE THAT SPEAKS.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================
// CHECKOUT SCREEN STYLES
// All main colors come from the shared theme
// ============================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.background,
  },

  header: {
    minHeight: 70,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.background,
  },

  backButton: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },

  brandName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 3,
    color: C.primary,
  },

  headerSubtitle: {
    marginTop: 3,
    fontSize: 10,
    letterSpacing: 2,
    color: C.muted,
  },

  headerIcon: {
    width: 42,
    alignItems: 'flex-end',
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 35,
  },

  section: {
    marginBottom: 20,
    padding: 17,
    borderRadius: 16,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },

  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  sectionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: C.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: C.text,
  },

  sectionSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: C.muted,
  },

  inputGroup: {
    flex: 1,
    marginBottom: 15,
  },

  inputLabel: {
    marginBottom: 7,
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
  },

  input: {
    minHeight: 48,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    backgroundColor: C.background,
    color: C.text,
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },

  halfWidth: {
    flex: 1,
    minWidth: 0,
  },

  paymentOption: {
    minHeight: 57,
    paddingHorizontal: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  paymentOptionSelected: {
    borderColor: C.primary,
    backgroundColor: C.primaryLight,
  },

  paymentTitle: {
    flex: 1,
    fontSize: 13,
    color: C.text,
  },

  paymentTitleSelected: {
    fontWeight: '700',
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: C.muted,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioOuterSelected: {
    borderColor: C.primary,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.primary,
  },

  cardDetails: {
    marginTop: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },

  cardNote: {
    marginBottom: 14,
    fontSize: 12,
    lineHeight: 18,
    color: C.muted,
  },

  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 12,
    marginTop: 4,
    borderRadius: 10,
    backgroundColor: C.background,
  },

  noticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: C.text,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  summaryLabel: {
    fontSize: 14,
    color: C.muted,
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: C.text,
  },

  discountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: C.success,
  },

  freeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    color: C.success,
  },

  summaryDivider: {
    height: 1,
    marginVertical: 5,
    backgroundColor: C.border,
  },

  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: C.text,
  },

  totalValue: {
    fontSize: 19,
    fontWeight: '800',
    color: C.primary,
  },

  placeOrderButton: {
    minHeight: 55,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  disabledButton: {
    opacity: 0.6,
  },

  placeOrderText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: C.white,
  },

  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 17,
  },

  secureNoteText: {
    fontSize: 12,
    color: C.muted,
  },

  footerText: {
    marginTop: 23,
    textAlign: 'center',
    fontSize: 10,
    letterSpacing: 2,
    color: C.muted,
  },
});
