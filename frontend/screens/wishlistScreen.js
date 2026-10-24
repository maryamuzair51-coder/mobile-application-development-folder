import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styling/theme';
import { useCart } from './cartScreen';
import { useWishlist } from '../components/wishlistContext';


export default function WishlistScreen({ navigation }) {
  
  const { wishlist, removeFromWishlist } = useWishlist();

  const { addItem } = useCart();

  // Removes a product from the wishlist
  const removeItem = (id) => {
    removeFromWishlist(id);
  };

  // Adds a wishlist product to the shopping cart
  const addToCart = (item) => {
    addItem({
      ...item,
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });

    // Shows confirmation after adding the product
    Alert.alert(
      'Added to Bag',
      `${item.name} added to your shopping bag.`
    );
  };

  // Navigates to the product shopping screen
  const exploreProducts = () => {
    navigation.navigate('Explore');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Controls the phone status bar appearance */}
      <StatusBar
        backgroundColor={COLORS.cream}
        barStyle="dark-content"
      />

      {/* Header with back button, title, and wishlist count */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color={COLORS.text}
          />
        </TouchableOpacity>

        {/* Wishlist heading and subtitle */}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>My Wishlist</Text>
          <Text style={styles.headerSubtitle}>
            Your favourite finds
          </Text>
        </View>

        {/* Displays the number of saved products */}
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{wishlist.length}</Text>
        </View>
      </View>

      {/* Allows the wishlist content to scroll */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Introduction section */}
        <View style={styles.intro}>
          <View style={styles.introIcon}>
            <Ionicons
              name="heart"
              size={25}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.introTextContainer}>
            <Text style={styles.introTitle}>
              Saved for later
            </Text>
            <Text style={styles.introSubtitle}>
              Keep the things you love in one place.
            </Text>
          </View>
        </View>

        {/* Checks whether the wishlist contains products */}
        {wishlist.length > 0 ? (
          <>
            {/* Section heading and total saved items */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Your favourites
              </Text>
              <Text style={styles.itemCount}>
                {wishlist.length}{' '}
                {wishlist.length === 1 ? 'item' : 'items'}
              </Text>
            </View>

            {/* Displays each saved product */}
            {wishlist.map((item) => (
              <View style={styles.productCard} key={item.id}>
                {/* Product image and remove-from-wishlist button */}
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />

                  <TouchableOpacity
                    style={styles.heartButton}
                    onPress={() => removeItem(item.id)}
                    accessibilityLabel={`Remove ${item.name} from wishlist`}
                  >
                    <Ionicons
                      name="heart"
                      size={19}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>

                {/* Product information */}
                <View style={styles.productInfo}>
                  <Text style={styles.category}>
                    {item.category}
                  </Text>

                  <Text
                    style={styles.productName}
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>

                  {/* Displays product rating */}
                  <View style={styles.ratingRow}>
                    <Ionicons
                      name="star"
                      size={13}
                      color="#D99B32"
                    />
                    <Text style={styles.ratingText}>
                      {item.rating}
                    </Text>
                    <Text style={styles.ratingLabel}>
                      Customer rating
                    </Text>
                  </View>

                  {/* Displays current and original prices */}
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>
                      Rs.{' '}
                      {Number(
                        item.price ?? item.discountedPrice ?? 0
                      ).toLocaleString()}
                    </Text>

                    <Text style={styles.oldPrice}>
                      Rs.{' '}
                      {Number(
                        item.oldPrice ?? item.originalPrice ?? 0
                      ).toLocaleString()}
                    </Text>
                  </View>

                  {/* Adds the selected product to the cart */}
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addToCart(item)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="bag-add-outline"
                      size={17}
                      color={COLORS.white}
                    />
                    <Text style={styles.addButtonText}>
                      Add to Bag
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Button to continue browsing products */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={exploreProducts}
            >
              <Text style={styles.continueButtonText}>
                Explore More Products
              </Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </>
        ) : (
          // Empty wishlist message
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name="heart-outline"
                size={48}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              Your wishlist is empty
            </Text>

            <Text style={styles.emptyDescription}>
              Found something you love? Tap the heart on a product
              to save it here for later.
            </Text>

            {/* Button to start shopping */}
            <TouchableOpacity
              style={styles.shopButton}
              onPress={exploreProducts}
              activeOpacity={0.85}
            >
              <Text style={styles.shopButtonText}>
                Start Shopping
              </Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Footer note at the bottom of the screen */}
        <View style={styles.footerNote}>
          <Ionicons
            name="shield-checkmark-outline"
            size={17}
            color={COLORS.success}
          />
          <Text style={styles.footerNoteText}>
            Your favourites, all in one place.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles for the wishlist screen
const styles = StyleSheet.create({
  // Main screen background
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  // Scrollable content spacing
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
  },

  // Header layout
  header: {
    minHeight: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.cream,
    paddingTop: 44,
    paddingBottom: 14,
  },

  // Back button
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  headerTitleContainer: {
    flex: 1,
    marginLeft: 13,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 0.2,
  },

  headerSubtitle: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 3,
  },

  // Badge showing the wishlist item count
  countBadge: {
    minWidth: 34,
    height: 34,
    paddingHorizontal: 8,
    borderRadius: 17,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  countText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },

  // Introduction banner
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    marginBottom: 26,
  },

  introIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  introTextContainer: {
    flex: 1,
  },

  introTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },

  introSubtitle: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: 5,
    lineHeight: 18,
  },

  // Wishlist section heading
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.text,
  },

  itemCount: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondaryText,
  },

  // Individual product card
  productCard: {
    flexDirection: 'row',
    padding: 11,
    marginBottom: 15,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  // Product image container
  imageContainer: {
    width: 124,
    height: 158,
    position: 'relative',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.cream,
  },

  productImage: {
    width: '100%',
    height: '100%',
  },

  // Heart button over the product image
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 33,
    height: 33,
    borderRadius: 17,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  // Product details layout
  productInfo: {
    flex: 1,
    paddingLeft: 13,
    paddingVertical: 3,
    justifyContent: 'center',
  },

  category: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },

  productName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 21,
  },

  // Product rating row
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 4,
  },

  ratingLabel: {
    fontSize: 10,
    color: COLORS.secondaryText,
    marginLeft: 5,
    flexShrink: 1,
  },

  // Current and original price layout
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 9,
    gap: 7,
  },

  price: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },

  oldPrice: {
    fontSize: 11,
    color: COLORS.secondaryText,
    textDecorationLine: 'line-through',
  },

  // Add-to-cart button
  addButton: {
    minHeight: 37,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 11,
    marginTop: 12,
    paddingHorizontal: 8,
    gap: 7,
  },

  addButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },

  // Explore more products button
  continueButton: {
    minHeight: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 7,
  },

  continueButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Empty wishlist container
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 32,
    paddingBottom: 38,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },

  emptyDescription: {
    fontSize: 13,
    color: COLORS.secondaryText,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 23,
  },

  // Start shopping button
  shopButton: {
    minHeight: 50,
    alignSelf: 'stretch',
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  shopButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },

  // Footer message
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    gap: 8,
  },

  footerNoteText: {
    fontSize: 12,
    color: COLORS.secondaryText,
  },
});