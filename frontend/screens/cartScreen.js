import React, {
  createContext, // Creates context to share data between components
  useCallback,   
  useContext,    
  useMemo,       
  useState,      
} from 'react';

import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS as C } from '../../styling/theme';

// ========================================
// CART CONTEXT
// Shares cart data between app screens
// ========================================

const CartContext = createContext(null);
export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState([]);

  // Adds a product to the cart
  const addItem = useCallback((product, quantity = 1) => {
    // Finds the product ID from available properties
    const id =
      product.id ||
      product.productId ||
      product._id ||
      product.name ||
      product.title;

    if (id == null) return;

    // Makes sure the quantity is at least 1
    const amount = Math.max(1, Number(quantity) || 1);

    
    setCartItems((current) => {
      // Checks whether the same product and variant already exist
      const existing = current.find(
        (item) =>
          String(item.id) === String(id) &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor &&
          item.selectedShade === product.selectedShade
      );

      // Increases quantity if the product already exists
      if (existing) {
        return current.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + amount }
            : item
        );
      }

      // Adds a new product to the cart
      return [
        ...current,
        {
          ...product,
          id,
          name: product.name || product.title || 'Product',
          price: Number(product.price || 0),

          // Gets the product image from available properties
          image:
            typeof product.image === 'string'
              ? product.image
              : product.imageUrl || product.thumbnail || null,

          quantity: amount,
        },
      ];
    });
  }, []);

  // Increases product quantity by one
  const increaseQuantity = useCallback((id) => {
    setCartItems((current) =>
      current.map((item) =>
        String(item.id) === String(id)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }, []);

  // Decreases quantity and removes products at zero
  const decreaseQuantity = useCallback((id) => {
    setCartItems((current) =>
      current
        .map((item) =>
          String(item.id) === String(id)
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  // Removes a product from the cart
  const removeItem = useCallback((id) => {
    setCartItems((current) =>
      current.filter((item) => String(item.id) !== String(id))
    );
  }, []);

  // Removes all products from the cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculates the total price before discount
  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  // Applies a 20% discount when subtotal is above Rs. 1,200
  const discount = subtotal > 1200 ? subtotal * 0.2 : 0;

  // Calculates the final price after discount
  const total = subtotal - discount;

  // Calculates the total number of products in the cart
  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Shares cart data and functions with other components
  const value = {
    cartItems,
    cartCount,
    subtotal,
    discount,
    total,
    addItem,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to access cart data
export const useCart = () => {
  const context = useContext(CartContext);

  // Shows an error if used outside CartProvider
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
};

// ========================================
// CART SCREEN
// Displays products and order summary
// ========================================

export default function CartScreen({ navigation }) {
  // Gets cart data and functions from CartContext
  const {
    cartItems,
    cartCount,
    subtotal,
    discount,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
  } = useCart();

  // Formats prices using Pakistani number formatting
  const formatPrice = (price) =>
    `Rs. ${Number(price).toLocaleString('en-PK', {
      maximumFractionDigits: 2,
    })}`;

  // Displays a single product in the cart
  const renderProduct = (item, index) => (
    <View
      style={styles.productCard}
      key={`${item.id}-${item.selectedSize || ''}-${
        item.selectedColor || ''
      }-${item.selectedShade || ''}-${index}`}
    >
      {/* Displays the product image or a placeholder */}
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons
            name="image-outline"
            size={25}
            color="#B8A99C"
          />
        </View>
      )}

      {/* Shows product details and quantity controls */}
      <View style={styles.productDetails}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>

        {/* Shows selected variant and price per item */}
        <Text style={styles.productDescription}>
          {item.selectedShade ||
            item.selectedColor ||
            item.selectedSize ||
            'Everyday essential'}
          {' · '}
          {formatPrice(item.price)} each
        </Text>

        {/* Shows total price for this product */}
        <Text style={styles.productPrice}>
          {formatPrice(item.price * item.quantity)}
        </Text>

        {/* Quantity increase and decrease buttons */}
        <View style={styles.quantityControl}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => decreaseQuantity(item.id)}
            accessibilityLabel="Decrease quantity"
          >
            <Ionicons name="remove" size={14} color="#302924" />
          </TouchableOpacity>

          <Text style={styles.quantityText}>
            {item.quantity}
          </Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => increaseQuantity(item.id)}
            accessibilityLabel="Increase quantity"
          >
            <Ionicons name="add" size={14} color="#302924" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Removes this product from the cart */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeItem(item.id)}
        accessibilityLabel={`Remove ${item.name}`}
      >
        <Ionicons name="trash-outline" size={16} color="#8F8278" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Sets the status bar appearance */}
      <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />

      {/* Header with back and help buttons */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#302924" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My bag</Text>

        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() =>
            Alert.alert(
              'Need help?',
              'Please contact our support team for assistance.'
            )
          }
        >
          <Ionicons
            name="help-circle-outline"
            size={21}
            color="#302924"
          />
        </TouchableOpacity>
      </View>

      {/* Allows the cart content to scroll */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cart heading and item count */}
        <View style={styles.intro}>
          <Text style={styles.eyebrow}>GOOD CHOICES, ALL YOURS</Text>

          <Text style={styles.heading}>Your little collection.</Text>

          <Text style={styles.subtitle}>
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your bag
          </Text>
        </View>

        {/* Shows an empty message or the cart products */}
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="bag-handle-outline"
              size={48}
              color="#B95132"
            />

            <Text style={styles.emptyTitle}>Your bag is empty</Text>

            <Text style={styles.emptyDescription}>
              Add your favorite products to get started.
            </Text>

            {/* Navigates to the shopping screen */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => navigation?.navigate('Explore')}
            >
              <Text style={styles.continueButtonText}>
                Explore products
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Displays all products in the cart */}
            <View style={styles.productList}>
              {cartItems.map(renderProduct)}
            </View>

            {/* Displays the discount offer */}
            <View style={styles.discountBanner}>
              <Ionicons
                name="gift-outline"
                size={20}
                color="#B95132"
              />

              <View style={styles.discountContent}>
                <Text style={styles.discountTitle}>
                  {subtotal > 1200
                    ? 'A little treat: you unlocked 20% off.'
                    : 'A little treat is waiting for you.'}
                </Text>

                <Text style={styles.discountDescription}>
                  {subtotal > 1200
                    ? `You save ${formatPrice(discount)} on this order.`
                    : `Spend ${formatPrice(
                        Math.max(0, 1201 - subtotal)
                      )} more to unlock 20% off.`}
                </Text>
              </View>
            </View>

            {/* Displays subtotal, discount, and delivery charges */}
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Subtotal ({cartCount} items)
                </Text>

                <Text style={styles.summaryValue}>
                  {formatPrice(subtotal)}
                </Text>
              </View>

              {/* Displays the discount only when applicable */}
              {discount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.discountLabel}>
                    October offer (20%)
                  </Text>

                  <Text style={styles.discountValue}>
                    - {formatPrice(discount)}
                  </Text>
                </View>
              )}

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={styles.summaryValue}>Free</Text>
              </View>

              {/* Shows the final payable amount */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>

                <Text style={styles.totalValue}>
                  {formatPrice(total)}
                </Text>
              </View>
            </View>

            {/* Navigates to the checkout screen */}
            <TouchableOpacity
              style={styles.checkoutButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={styles.checkoutText}>Checkout</Text>

              <Ionicons
                name="arrow-forward"
                size={16}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            {/* Returns to the shopping screen */}
            <TouchableOpacity
              style={styles.continueShopping}
              onPress={() => navigation?.navigate('Explore')}
            >
              <Text style={styles.continueShoppingText}>
                Continue shopping
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ========================================
// CART SCREEN STYLES
// Controls the layout, colors, and spacing
// ========================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.background,
  },

  container: {
    flex: 1,
    backgroundColor: C.background,
  },

  content: {
    paddingHorizontal: 20,
  },

  // Header layout
  header: {
    minHeight: 56,
    paddingTop: 44,
    paddingBottom: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.background,
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.text,
    letterSpacing: 0.2,
  },

  // Scrollable content spacing
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },

  intro: {
    marginBottom: 24,
  },

  eyebrow: {
    color: C.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  heading: {
    fontSize: 29,
    fontWeight: '700',
    color: C.text,
    letterSpacing: -0.7,
    lineHeight: 36,
  },

  subtitle: {
    fontSize: 14,
    color: C.muted,
    marginTop: 8,
  },

  // Product cards layout
  productList: {
    gap: 14,
  },

  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: C.espresso,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  productImage: {
    width: 92,
    height: 112,
    borderRadius: 12,
    backgroundColor: C.primaryLight,
  },

  imagePlaceholder: {
    width: 92,
    height: 112,
    borderRadius: 12,
    backgroundColor: C.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  productDetails: {
    flex: 1,
    paddingLeft: 14,
    paddingVertical: 4,
  },

  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: C.text,
    marginBottom: 7,
  },

  productDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: C.muted,
    marginBottom: 8,
  },

  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: C.primary,
    marginBottom: 10,
  },

  // Quantity control buttons
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    height: 34,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    backgroundColor: C.background,
    gap: 12,
  },

  quantityButton: {
    width: 24,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
    minWidth: 14,
    textAlign: 'center',
  },

  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },

  // Discount offer banner
  discountBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.primaryLight,
    marginTop: 6,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    gap: 12,
  },

  discountContent: {
    flex: 1,
  },

  discountTitle: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    color: C.primary,
    marginBottom: 4,
  },

  discountDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: C.text,
  },

  // Order summary styles
  summary: {
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    padding: 18,
    marginBottom: 22,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },

  summaryLabel: {
    fontSize: 14,
    color: C.muted,
    flexShrink: 1,
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: C.text,
  },

  discountLabel: {
    fontSize: 14,
    color: C.success,
    flexShrink: 1,
  },

  discountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: C.success,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 18,
    marginTop: 2,
  },

  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: C.text,
  },

  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: C.primary,
  },

  // Checkout button
  checkoutButton: {
    minHeight: 54,
    marginTop: 0,
    borderRadius: 28,
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 9,
    elevation: 4,
  },

  checkoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: C.white,
  },

  continueShopping: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 8,
  },

  continueShoppingText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.primary,
  },

  // Empty cart message and button
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 24,
    paddingVertical: 48,
    marginTop: 8,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: C.text,
    marginTop: 18,
  },

  emptyDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: C.muted,
    marginTop: 9,
    textAlign: 'center',
  },

  continueButton: {
    marginTop: 24,
    minHeight: 48,
    backgroundColor: C.primary,
    borderRadius: 26,
    paddingVertical: 13,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueButtonText: {
    color: C.white,
    fontSize: 14,
    fontWeight: '700',
  },
});