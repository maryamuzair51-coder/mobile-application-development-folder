
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthModal } from '../components/authModalContext';
import { useCart } from '../screens/cartScreen';
import { COLORS as C } from '../../styling/theme';


const money = (value) =>
  `Rs. ${Number(value || 0).toLocaleString('en-PK')}`;

export default function ProductDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const authModal = useAuthModal();
  const openAuthModal = authModal?.openAuthModal;
  const { addItem, cartCount } = useCart();

  const params = route.params || {};
  const product = params.product || params.item || params;
  const category = params.category || '';

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(
    product.selectedSize || product.sizes?.[0] || null
  );
  const [selectedColor, setSelectedColor] = useState(
    product.selectedColor || product.colors?.[0] || null
  );
  const [selectedShade, setSelectedShade] = useState(
    product.selectedShade || product.shades?.[0] || null
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const title = product.name || product.title || 'Product Details';
  const price = Number(product.price || product.salePrice || 0);
  const originalPrice = Number(
    product.originalPrice || product.oldPrice || 0
  );

  const ratingValue =
    typeof product.rating === 'number'
      ? product.rating
      : Number(product.rating?.rate || product.rating?.value || 4.8);

  const rating = Number.isFinite(ratingValue) ? ratingValue : 4.8;

  const imageUri =
    typeof product.image === 'string'
      ? product.image
      : product.imageUrl ||
        product.thumbnail ||
        (Array.isArray(product.images) ? product.images[0] : null);

  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  const colors = Array.isArray(product.colors) ? product.colors : [];
  const shades = Array.isArray(product.shades) ? product.shades : [];

  const categoryText = [
    category,
    product.category,
    product.subcategory,
    product.type,
    product.gender,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const isClothing =
    /cloth|dress|shirt|suit|fashion|unstitched|stitched|lawn|abaya|kurta|apparel/.test(
      categoryText
    );

  const isMakeup =
    /makeup|cosmetic|beauty|lipstick|foundation|skincare|skin care|mascara|blush/.test(
      categoryText
    );

  const discount =
    originalPrice > price && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : Number(product.discount || 0);

  const total = price * quantity;

  // Find the navigator that contains a requested screen.
  const findNavigatorForRoute = (screenName) => {
    let current = navigation;

    while (current) {
      const state = current.getState?.();

      if (state?.routeNames?.includes(screenName)) {
        return current;
      }

      current = current.getParent?.();
    }

    return null;
  };

  const navigateTo = (screenName, screenParams = {}) => {
    const target = findNavigatorForRoute(screenName);

    if (!target) return false;

    target.navigate(screenName, screenParams);
    return true;
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (!navigateTo('Home') && !navigateTo('Main')) {
      Alert.alert(
        'Navigation unavailable',
        'Please check that your Home screen is registered.'
      );
    }
  };

  const openDrawer = () => {
    let current = navigation;

    while (current) {
      const state = current.getState?.();

      if (
        state?.type === 'drawer' &&
        typeof current.openDrawer === 'function'
      ) {
        current.openDrawer();
        return;
      }

      current = current.getParent?.();
    }

    if (!navigateTo('Categories')) {
      Alert.alert(
        'Menu unavailable',
        'Please check your drawer navigation setup.'
      );
    }
  };

  const openCart = () => {
    if (!navigateTo('Cart')) {
      Alert.alert(
        'Shopping Bag',
        'Please register the Cart screen in your navigation.'
      );
    }
  };

  const openAccount = () => {
    if (typeof openAuthModal === 'function') {
      openAuthModal();
      return;
    }

    if (!navigateTo('Account') && !navigateTo('Profile')) {
      Alert.alert(
        'My Account',
        'Please register an Account/Profile screen or connect the authentication modal.'
      );
    }
  };

  const addToCart = () => {
  if (!product || !(product.id ?? product.productId ?? product._id)) {
    Alert.alert('Error', 'Product information is missing.');
    return;
  }

  const cartProduct = {
    ...product,
    id: String(product.id ?? product.productId ?? product._id),
    name: title,
    price,
    image: imageUri,
    quantity,
    category: category || product.category || 'Product',
    selectedSize,
    selectedColor,
    selectedShade,
  };

  if (typeof openAuthModal !== 'function') {
    Alert.alert(
      'Login Required',
      'The authentication modal is not connected.'
    );
    return;
  }

  openAuthModal(() => {
    addItem(cartProduct);

    Alert.alert(
      'Added to Bag',
      `${title} has been added to your bag.`
    );
  });
};

  const changeQuantity = (amount) => {
    setQuantity((current) => Math.max(1, current + amount));
  };

  const renderOption = (option, selected, onSelect, prefix) => {
    const label =
      typeof option === 'string' || typeof option === 'number'
        ? String(option)
        : option?.name || option?.label || option?.value || '';

    if (!label) return null;

    const isSelected = selected === option;

    return (
      <Pressable
        key={`${prefix}-${label}`}
        onPress={() => onSelect(option)}
        style={[
          styles.optionButton,
          isSelected && styles.optionButtonSelected,
        ]}
      >
        <Text
          style={[
            styles.optionText,
            isSelected && styles.optionTextSelected,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={C.background}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <View
          style={[
            styles.header,
            { paddingTop: Math.max(insets.top, 12) },
          ]}
        >
          <Pressable
            onPress={openDrawer}
            style={styles.logoRow}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
          >
            <View style={styles.logoBox}>
              <Ionicons
                name="bag-handle"
                size={23}
                color={C.white}
              />
            </View>

            <Text style={styles.logoText}>MOVEDA</Text>
          </Pressable>

          <View style={styles.headerActions}>
            <Pressable
              onPress={openAccount}
              style={styles.headerIcon}
              accessibilityRole="button"
              accessibilityLabel="Open account"
            >
              <Ionicons
                name="person-outline"
                size={25}
                color={C.text}
              />
            </Pressable>

            <Pressable
              onPress={openCart}
              style={styles.headerIcon}
              accessibilityRole="button"
              accessibilityLabel="Open shopping bag"
            >
              <Ionicons
                name="bag-outline"
                size={26}
                color={C.text}
              />

              <View style={styles.cartBadge}>
                <Text style={styles.badgeText}>
                  {cartCount}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* BREADCRUMB */}
        <View style={styles.breadcrumb}>
          <Pressable
            onPress={() => {
              if (!navigateTo('Home')) goBack();
            }}
            accessibilityRole="button"
          >
            <Text style={styles.breadcrumbLink}>Home</Text>
          </Pressable>

          <Ionicons
            name="chevron-forward"
            size={17}
            color={C.muted}
          />

          <Text
            style={styles.breadcrumbCurrent}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        {/* PRODUCT IMAGE */}
        <View style={styles.imageContainer}>
          {imageUri && !imageFailed ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.productImage}
              resizeMode="cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name="image-outline"
                size={58}
                color={C.muted}
              />
              <Text style={styles.placeholderText}>
                Product image unavailable
              </Text>
            </View>
          )}

          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {discount}% OFF
              </Text>
            </View>
          )}

          {product.tag && (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{product.tag}</Text>
            </View>
          )}

          <Pressable
            onPress={() => setIsFavorite((value) => !value)}
            style={styles.favoriteButton}
            accessibilityRole="button"
            accessibilityLabel="Toggle favourite"
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? C.primary : C.text}
            />
          </Pressable>
        </View>

        {/* PRODUCT INFORMATION */}
        <View style={styles.productInfo}>
          <Text style={styles.categoryLabel}>
            {product.category || category || 'MOVEDA COLLECTION'}
          </Text>

          <Text style={styles.productTitle}>{title}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={17} color={C.gold} />

            <Text style={styles.ratingText}>
              {rating.toFixed(1)}
            </Text>

            <Text style={styles.reviewText}>
              ({product.reviewCount || product.reviewsCount || 0} reviews)
            </Text>

            <View style={styles.stockBadge}>
              <View style={styles.stockDot} />
              <Text style={styles.stockText}>Available</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{money(price)}</Text>

            {originalPrice > price && (
              <Text style={styles.originalPrice}>
                {money(originalPrice)}
              </Text>
            )}
          </View>

          {originalPrice > price && (
            <Text style={styles.savingText}>
              You save {money(originalPrice - price)}
            </Text>
          )}

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>
            Product description
          </Text>

          <Text style={styles.description}>
            {product.description ||
              `Discover ${title} from MOVEDA. A stylish choice selected for quality, comfort, and everyday use.`}
          </Text>

          {/* CLOTHING SIZES */}
          {isClothing && sizes.length > 0 && (
            <View style={styles.optionSection}>
              <Text style={styles.sectionTitle}>Select size</Text>

              <View style={styles.optionsRow}>
                {sizes.map((size) =>
                  renderOption(
                    size,
                    selectedSize,
                    setSelectedSize,
                    'size'
                  )
                )}
              </View>
            </View>
          )}

          {/* COLORS */}
          {colors.length > 0 && (
            <View style={styles.optionSection}>
              <Text style={styles.sectionTitle}>Select color</Text>

              <View style={styles.optionsRow}>
                {colors.map((color) =>
                  renderOption(
                    color,
                    selectedColor,
                    setSelectedColor,
                    'color'
                  )
                )}
              </View>
            </View>
          )}

          {/* MAKEUP SHADES */}
          {isMakeup && shades.length > 0 && (
            <View style={styles.optionSection}>
              <Text style={styles.sectionTitle}>Select shade</Text>

              <View style={styles.optionsRow}>
                {shades.map((shade) =>
                  renderOption(
                    shade,
                    selectedShade,
                    setSelectedShade,
                    'shade'
                  )
                )}
              </View>
            </View>
          )}

          <View style={styles.separator} />

          {/* QUANTITY */}
          <View style={styles.quantityRow}>
            <View>
              <Text style={styles.sectionTitle}>Quantity</Text>
              <Text style={styles.mutedSmall}>
                Choose your quantity
              </Text>
            </View>

            <View style={styles.quantityControl}>
              <Pressable
                onPress={() => changeQuantity(-1)}
                style={styles.quantityButton}
                accessibilityLabel="Decrease quantity"
              >
                <Ionicons name="remove" size={19} color={C.text} />
              </Pressable>

              <Text style={styles.quantityText}>{quantity}</Text>

              <Pressable
                onPress={() => changeQuantity(1)}
                style={styles.quantityButton}
                accessibilityLabel="Increase quantity"
              >
                <Ionicons name="add" size={19} color={C.text} />
              </Pressable>
            </View>
          </View>

          {/* SUBTOTAL */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalPrice}>{money(total)}</Text>
          </View>

          {/* ADD TO BAG */}
          <Pressable
            style={styles.addToCartButton}
            onPress={addToCart}
          >
            <Ionicons
              name="bag-add-outline"
              size={22}
              color={C.white}
            />
            <Text style={styles.addToCartText}>Add to Bag</Text>
          </Pressable>

          <Pressable
            style={styles.continueButton}
            onPress={goBack}
          >
            <Text style={styles.continueText}>
              Continue Shopping
            </Text>
          </Pressable>

          {/* BENEFITS */}
          <View style={styles.benefits}>
            <View style={styles.benefitItem}>
              <Ionicons
                name="shield-checkmark-outline"
                size={23}
                color={C.green}
              />
              <Text style={styles.benefitText}>
                Quality Selection
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <Ionicons
                name="cube-outline"
                size={23}
                color={C.green}
              />
              <Text style={styles.benefitText}>
                Careful Packaging
              </Text>
            </View>

            <View style={styles.benefitItem}>
              <Ionicons
                name="headset-outline"
                size={23}
                color={C.green}
              />
              <Text style={styles.benefitText}>
                Customer Support
              </Text>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.brandRow}>
            <View style={styles.footerLogoBox}>
              <Ionicons
                name="bag-handle"
                size={20}
                color={C.white}
              />
            </View>

            <Text style={styles.footerBrand}>MOVEDA</Text>
          </View>

          <Text style={styles.footerDescription}>
            Thoughtful finds for your everyday style.
          </Text>

          <View style={styles.footerLinks}>
            {[
              'About us',
              'Contact us',
              'Help & support',
              'Shipping & returns',
              'Privacy policy',
              'Terms & conditions',
            ].map((label) => (
              <Pressable
                key={label}
                onPress={() =>
                  Alert.alert(
                    label,
                    'This page can be connected later.'
                  )
                }
              >
                <Text style={styles.footerLinkText}>{label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.footerDivider} />

          <Text style={styles.copyright}>
            © 2026 MOVEDA. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

  
const styles = StyleSheet.create({
  // Main screen
  safeArea: {
    flex: 1,
    backgroundColor: C.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 44,
    paddingTop: 24,
  },

  // Header
  header: {
    minHeight: 78,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },

  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  logoText: {
    fontFamily: 'Georgia',
    fontSize: 25,
    fontWeight: 'bold',
    color: C.text,
    letterSpacing: -0.6,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  headerIcon: {
    width: 40,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  cartBadge: {
    position: 'absolute',
    top: 0,
    right: -2,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    color: C.white,
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Breadcrumb
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 18,
  },

  breadcrumbLink: {
    fontSize: 13,
    color: C.primary,
    fontWeight: '700',
  },

  breadcrumbCurrent: {
    flex: 1,
    fontSize: 13,
    color: C.muted,
    fontWeight: '600',
  },

  // Product image
  imageContainer: {
    width: '100%',
    height: 350,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: C.pale,
    position: 'relative',
  },

  productImage: {
    width: '100%',
    height: '100%',
  },

  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  placeholderText: {
    fontSize: 13,
    color: C.muted,
    fontWeight: '500',
  },

  discountBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: C.primary,
    borderRadius: 7,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },

  discountText: {
    color: C.white,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.4,
  },

  tagBadge: {
    position: 'absolute',
    left: 14,
    bottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 7,
    backgroundColor: C.white,
  },

  tagText: {
    color: C.text,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  favoriteButton: {
    position: 'absolute',
    top: 13,
    right: 13,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.white,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  // Product information
  productInfo: {
    paddingTop: 24,
  },

  categoryLabel: {
    color: C.primary,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.3,
    marginBottom: 8,
    textTransform: 'uppercase',
  },

  productTitle: {
    color: C.text,
    fontSize: 27,
    fontWeight: 'bold',
    lineHeight: 35,
    letterSpacing: -0.5,
  },

  // Rating and stock
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },

  ratingText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: C.text,
  },

  reviewText: {
    fontSize: 12,
    color: C.muted,
    marginRight: 5,
  },

  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginLeft: 3,
  },

  stockDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.green,
  },

  stockText: {
    fontSize: 11,
    color: C.green,
    fontWeight: '700',
  },

  // Pricing
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 11,
    marginTop: 17,
  },

  price: {
    fontSize: 27,
    fontWeight: 'bold',
    color: C.primary,
    letterSpacing: -0.4,
  },

  originalPrice: {
    fontSize: 15,
    color: C.muted,
    textDecorationLine: 'line-through',
  },

  savingText: {
    color: C.green,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },

  // Dividers and section headings
  separator: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 23,
  },

  sectionTitle: {
    fontSize: 16,
    color: C.text,
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: -0.2,
  },

  description: {
    fontSize: 14,
    color: C.muted,
    lineHeight: 23,
    letterSpacing: 0.1,
  },

  // Size, color, and makeup shade selectors
  optionSection: {
    marginTop: 24,
  },

  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  optionButton: {
    minWidth: 44,
    minHeight: 42,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.white,
  },

  optionButtonSelected: {
    borderWidth: 1.5,
    borderColor: C.primary,
    backgroundColor: C.primaryLight,
  },

  optionText: {
    color: C.text,
    fontSize: 13,
    fontWeight: '600',
  },

  optionTextSelected: {
    color: C.primary,
    fontWeight: 'bold',
  },

  // Quantity
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
  },

  mutedSmall: {
    fontSize: 12,
    color: C.muted,
    marginTop: 2,
  },

  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
    overflow: 'hidden',
  },

  quantityButton: {
    width: 40,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityText: {
    minWidth: 30,
    textAlign: 'center',
    fontSize: 15,
    color: C.text,
    fontWeight: 'bold',
  },

  // Subtotal
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 17,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },

  totalLabel: {
    fontSize: 14,
    color: C.muted,
    fontWeight: '600',
  },

  totalPrice: {
    fontSize: 21,
    color: C.text,
    fontWeight: 'bold',
  },

  // Add to Bag button
  addToCartButton: {
    minHeight: 56,
    marginTop: 20,
    borderRadius: 13,
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 2,
    shadowColor: C.primary,
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  addToCartText: {
    color: C.white,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },

  // Continue shopping
  continueButton: {
    minHeight: 50,
    marginTop: 12,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.white,
  },

  continueText: {
    color: C.text,
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Customer benefits
  benefits: {
    marginTop: 25,
    padding: 17,
    borderRadius: 15,
    backgroundColor: C.pale,
    gap: 16,
  },

  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  benefitText: {
    color: C.text,
    fontSize: 13,
    fontWeight: '600',
  },

  // Footer
  footer: {
    marginTop: 30,
    paddingTop: 24,
    paddingHorizontal: 2,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  footerLogoBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerBrand: {
    fontFamily: 'Georgia',
    fontSize: 23,
    fontWeight: 'bold',
    color: C.text,
  },

  footerDescription: {
    fontSize: 12,
    color: C.muted,
    marginTop: 12,
    lineHeight: 19,
  },

  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginTop: 19,
  },

  footerLinkText: {
    fontSize: 11,
    color: C.text,
    fontWeight: '500',
  },

  footerDivider: {
    height: 1,
    backgroundColor: C.border,
    marginTop: 21,
    marginBottom: 14,
  },

  copyright: {
    fontSize: 10,
    color: C.muted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
