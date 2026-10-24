
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useCart } from './cartScreen';
import { COLORS as C } from '../../styling/theme';
import { useAuthModal } from '../components/authModalContext';


// --------------------------------------------------
// PRODUCT CATEGORIES
// --------------------------------------------------

const CATEGORIES = [
  { key: 'all', label: 'All Clothes' },
  { key: 'tops', label: 'Tops' },
  { key: 'bottoms', label: 'Bottoms' },
  { key: 'dresses', label: 'Dresses' },
  { key: 'shoes', label: 'Shoes' },
  { key: 'outerwear', label: 'Outerwear' },
];

const SAMPLE_PRODUCTS = [
  {
    id: 'sample-1',
    name: 'Classic Cotton T-Shirt',
    price: 1800,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
    rating: 4.7,
    reviews: 124,
    gender: 'male',
    type: 'tops',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'A comfortable everyday cotton T-shirt.',
  },
  {
    id: 'sample-2',
    name: 'Relaxed Fit Shirt',
    price: 2600,
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600',
    rating: 4.6,
    reviews: 86,
    gender: 'male',
    type: 'tops',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'A versatile shirt for casual occasions.',
  },
  {
    id: 'sample-3',
    name: 'Everyday Denim Jeans',
    price: 3200,
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
    rating: 4.8,
    reviews: 98,
    gender: 'male',
    type: 'bottoms',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Comfortable denim for everyday wear.',
  },
  {
    id: 'sample-4',
    name: 'Minimal White Sneakers',
    price: 4200,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    rating: 4.5,
    reviews: 73,
    gender: 'unisex',
    type: 'shoes',
    sizes: ['38', '39', '40', '41', '42'],
    description: 'Clean, minimal sneakers for everyday styling.',
  },
  {
    id: 'sample-5',
    name: 'Floral Summer Dress',
    price: 3500,
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600',
    rating: 4.8,
    reviews: 112,
    gender: 'female',
    type: 'dresses',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'A light and elegant dress for warm days.',
  },
  {
    id: 'sample-6',
    name: 'Everyday Casual Top',
    price: 2100,
    image:
      'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=600',
    rating: 4.6,
    reviews: 65,
    gender: 'female',
    type: 'tops',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'An easy-to-style casual top.',
  },
  {
    id: 'sample-7',
    name: 'Straight Leg Trousers',
    price: 2900,
    image:
      'https://images.unsplash.com/photo-1506629905607-d9a6b9c5f1e1?w=600',
    rating: 4.4,
    reviews: 54,
    gender: 'female',
    type: 'bottoms',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Smart, comfortable trousers.',
  },
  {
    id: 'sample-8',
    name: 'Lightweight Jacket',
    price: 4800,
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
    rating: 4.7,
    reviews: 91,
    gender: 'unisex',
    type: 'outerwear',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'A lightweight layering essential.',
  },
];

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function formatPrice(price) {
  return `Rs. ${Number(price || 0).toLocaleString('en-PK', {
    maximumFractionDigits: 0,
  })}`;
}

function normalizeProduct(product) {
  const name = String(product.title || product.name || 'Clothing Item');
  const category = String(product.category || '').toLowerCase();
  const lowerName = name.toLowerCase();

  let type = 'tops';

  if (
    category.includes('shoe') ||
    category.includes('sneaker') ||
    category.includes('footwear')
  ) {
    type = 'shoes';
  } else if (
    category.includes('dress') ||
    lowerName.includes('dress')
  ) {
    type = 'dresses';
  } else if (
    category.includes('pant') ||
    category.includes('jean') ||
    category.includes('trouser') ||
    lowerName.includes('jeans') ||
    lowerName.includes('trousers')
  ) {
    type = 'bottoms';
  } else if (
    category.includes('jacket') ||
    category.includes('coat') ||
    category.includes('outerwear') ||
    lowerName.includes('jacket')
  ) {
    type = 'outerwear';
  }

  let gender = 'unisex';

  if (/\b(men|mens|man|male)\b/.test(lowerName)) {
    gender = 'male';
  } else if (/\b(women|womens|woman|female|ladies)\b/.test(lowerName)) {
    gender = 'female';
  }

  const rating =
    typeof product.rating === 'object'
      ? product.rating?.rate
      : product.rating;

  return {
    id: `api-${product.id}`,
    originalId: product.id,
    name,
    price: Number(product.price) || 0,
    image:
      product.thumbnail ||
      product.image ||
      product.images?.[0] ||
      null,
    rating: Number(rating) || 0,
    reviews: Number(product.rating?.count) || 0,
    gender,
    type,
    sizes:
      type === 'shoes'
        ? ['38', '39', '40', '41', '42']
        : ['S', 'M', 'L', 'XL'],
    description: product.description || '',
  };
}

function navigateToAvailableRoute(navigation, routeNames, params) {
  let navigator = navigation;

  while (navigator) {
    const registeredRoutes =
      navigator.getState?.()?.routeNames || [];

    const matchedRoute = routeNames.find((name) =>
      registeredRoutes.includes(name)
    );

    if (matchedRoute) {
      navigator.navigate(matchedRoute, params);
      return true;
    }

    navigator = navigator.getParent?.();
  }

  return false;
}

function openParentDrawer(navigation) {
  let navigator = navigation;

  while (navigator) {
    if (typeof navigator.openDrawer === 'function') {
      navigator.openDrawer();
      return;
    }

    navigator = navigator.getParent?.();
  }

  Alert.alert('Menu', 'The drawer menu is not available on this screen.');
}

// --------------------------------------------------
// GENDER SELECTOR
// --------------------------------------------------

function GenderOption({ gender, selected, onPress }) {
  const male = gender === 'male';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={styles.genderOption}
    >
      <View
        style={[
          styles.genderCircle,
          selected && styles.genderCircleSelected,
        ]}
      >
        <Ionicons
          name={male ? 'man-outline' : 'woman-outline'}
          size={29}
          color={selected ? C.white : C.primary}
        />
      </View>

      <Text
        style={[
          styles.genderLabel,
          selected && styles.genderLabelSelected,
        ]}
      >
        {male ? 'Male' : 'Female'}
      </Text>
    </Pressable>
  );
}

// --------------------------------------------------
// CATEGORY CHIP
// --------------------------------------------------

function CategoryChip({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        styles.categoryChip,
        selected && styles.categoryChipSelected,
      ]}
    >
      <Text
        style={[
          styles.categoryChipText,
          selected && styles.categoryChipTextSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// --------------------------------------------------
// PRODUCT CARD
// --------------------------------------------------

function ProductCard({
  product,
  favorite,
  selectedSize,
  onSelectSize,
  onFavorite,
  onAddToCart,
  onOpen,
}) {
  return (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Pressable
          style={styles.productImagePressable}
          onPress={() => onOpen(product)}
          accessibilityRole="button"
          accessibilityLabel={`View ${product.name}`}
        >
          {product.image ? (
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name="image-outline"
                size={32}
                color={C.secondaryText}
              />
            </View>
          )}
        </Pressable>

        <Pressable
          onPress={() => onFavorite(product)}
          style={styles.heartButton}
          accessibilityRole="button"
          accessibilityLabel={
            favorite ? 'Remove from favorites' : 'Add to favorites'
          }
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={20}
            color={favorite ? C.primary : C.text}
          />
        </Pressable>

        {product.rating >= 4.7 && (
          <View style={styles.bestSellerBadge}>
            <Text style={styles.bestSellerBadgeText}>BESTSELLER</Text>
          </View>
        )}
      </View>

      <Pressable onPress={() => onOpen(product)}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
      </Pressable>

      <View style={styles.ratingRow}>
        <Ionicons name="star" size={13} color={C.gold} />
        <Text style={styles.ratingText}>
          {product.rating ? product.rating.toFixed(1) : 'New'}
        </Text>

        {product.reviews > 0 && (
          <Text style={styles.reviewText}>({product.reviews})</Text>
        )}
      </View>

      <Text style={styles.productPrice}>
        {formatPrice(product.price)}
      </Text>

      {product.sizes?.length > 0 && (
        <View style={styles.sizesContainer}>
          <Text style={styles.sizeLabel}>Size</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sizesRow}
          >
            {product.sizes.map((size) => (
              <Pressable
                key={size}
                onPress={() => onSelectSize(product, size)}
                style={[
                  styles.sizeChip,
                  selectedSize === size && styles.sizeChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.sizeChipText,
                    selectedSize === size && styles.sizeChipTextSelected,
                  ]}
                >
                  {size}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      <Pressable
        onPress={() => onAddToCart(product)}
        accessibilityRole="button"
        style={styles.addButton}
      >
        <Ionicons name="bag-add-outline" size={16} color={C.white} />
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </Pressable>
    </View>
  );
}

// --------------------------------------------------
// CLOTHING SCREEN
// --------------------------------------------------

export default function ClothingScreen() {
  const navigation = useNavigation();
  const { openAuthModal, isLoggedIn } = useAuthModal();
  const { addItem, cartCount } = useCart();

  const [gender, setGender] = useState('male');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [sizes, setSizes] = useState({});

  // ------------------------------------------------
  // LOAD CLOTHING
  // ------------------------------------------------

  const loadProducts = useCallback(async () => {
    try {
      const response = await fetch(
        'https://dummyjson.com/products/category/mens-shirts?limit=30'
      );

      if (!response.ok) {
        throw new Error('Could not load products.');
      }

      const data = await response.json();

      const apiProducts = (data.products || []).map(normalizeProduct);

      // Keep sample clothing visible if the API is unavailable
      // or returns no usable items.
      if (apiProducts.length > 0) {
        setProducts([...SAMPLE_PRODUCTS, ...apiProducts]);
      } else {
        setProducts(SAMPLE_PRODUCTS);
      }
    } catch (error) {
      console.warn('Clothing API unavailable; using sample products.', error);
      setProducts(SAMPLE_PRODUCTS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ------------------------------------------------
  // FILTER PRODUCTS
  // ------------------------------------------------

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesGender =
        product.gender === gender || product.gender === 'unisex';

      const matchesCategory =
        category === 'all' || product.type === category;

      const matchesSearch =
        !query ||
        `${product.name} ${product.type} ${product.description || ''}`
          .toLowerCase()
          .includes(query);

      return matchesGender && matchesCategory && matchesSearch;
    });
  }, [products, gender, category, search]);

  const bestSellers = useMemo(
    () =>
      [...visibleProducts]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4),
    [visibleProducts]
  );

  // ------------------------------------------------
  // FAVORITES AND SIZES
  // ------------------------------------------------

  const toggleFavorite = useCallback((product) => {
    setFavorites((previous) =>
      previous.includes(product.id)
        ? previous.filter((id) => id !== product.id)
        : [...previous, product.id]
    );
  }, []);

  const selectSize = useCallback((product, size) => {
    setSizes((previous) => ({
      ...previous,
      [product.id]: size,
    }));
  }, []);

  // ------------------------------------------------
  // CART AND LOGIN
  // ------------------------------------------------

  const openCartScreen = useCallback(() => {
    const opened = navigateToAvailableRoute(navigation, [
      'Cart',
      'Bag',
      'ShoppingCart',
      'MyCart',
    ]);

    if (!opened) {
      Alert.alert(
        'Shopping Bag',
        'The Cart screen could not be found in your navigation.'
      );
    }
  }, [navigation]);

  const addToCart = useCallback(
    (product) => {
      if (!product) {
        Alert.alert('Error', 'Please select a product first.');
        return;
      }

      if (product.sizes?.length && !sizes[product.id]) {
        Alert.alert(
          'Choose a Size',
          `Please select a size for ${product.name} before adding it to your cart.`
        );
        return;
      }

      const cartProduct = {
        ...product,
        id: String(product.id),
        name: product.name || 'Clothing Item',
        price: Number(product.price) || 0,
        image: product.image || null,
        category: 'Clothing',
        selectedSize: sizes[product.id] || null,
      };

      const finishAddingToCart = () => {
        addItem(cartProduct);

        Alert.alert(
          'Added Successfully!',
          `${cartProduct.name} has been added to your cart.`,
          [
            {
              text: 'Continue Shopping',
              style: 'cancel',
            },
            {
              text: 'Continue to Cart',
              onPress: openCartScreen,
            },
          ]
        );
      };

      if (isLoggedIn) {
        finishAddingToCart();
      } else {
        openAuthModal(finishAddingToCart);
      }
    },
    [addItem, isLoggedIn, openAuthModal, openCartScreen, sizes]
  );

  // ------------------------------------------------
  // HEADER ACTIONS
  // ------------------------------------------------

  const openAccount = useCallback(() => {
    const opened = navigateToAvailableRoute(navigation, ['Account']);

    if (!opened && !isLoggedIn) {
      openAuthModal();
    } else if (!opened) {
      Alert.alert(
        'Account',
        'The Account screen is not registered in your navigation.'
      );
    }
  }, [navigation, isLoggedIn, openAuthModal]);

  const openProductDetails = useCallback(
    (product) => {
      const opened = navigateToAvailableRoute(
        navigation,
        ['ProductDetails'],
        {
          product: {
            ...product,
            title: product.name,
            thumbnail: product.image,
            category: 'Clothing',
          },
          category: 'Clothing',
          cartCount,
        }
      );

      if (!opened) {
        Alert.alert(
          product.name,
          `${product.description || 'A great addition to your wardrobe.'}\n\nPrice: ${formatPrice(product.price)}`
        );
      }
    },
    [navigation, cartCount]
  );

  // ------------------------------------------------
  // PRODUCT RENDERER
  // ------------------------------------------------

  const renderProduct = ({ item }) => (
    <ProductCard
      product={item}
      favorite={favorites.includes(item.id)}
      selectedSize={sizes[item.id]}
      onSelectSize={selectSize}
      onFavorite={toggleFavorite}
      onAddToCart={addToCart}
      onOpen={openProductDetails}
    />
  );

  // ------------------------------------------------
  // SCREEN UI
  // ------------------------------------------------

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={C.background}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadProducts();
            }}
            tintColor={C.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.topHeader}>
          <Pressable
            style={styles.brandRow}
            onPress={() => openParentDrawer(navigation)}
          >
            <View style={styles.logoBox}>
              <Ionicons
                name="bag-handle"
                size={19}
                color={C.white}
              />
            </View>
            <Text style={styles.brandName}>MODEVA</Text>
          </Pressable>

          <View style={styles.headerActions}>
            <Pressable
              onPress={openAccount}
              style={styles.iconButton}
              accessibilityLabel="Open account"
            >
              <Ionicons
                name="person-outline"
                size={21}
                color={C.text}
              />
            </Pressable>

            <Pressable
              onPress={openCartScreen}
              style={styles.iconButton}
              accessibilityLabel="Open shopping bag"
            >
              <Ionicons
                name="bag-outline"
                size={22}
                color={C.text}
              />

              <View style={styles.cartBadge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Breadcrumb */}
        <View style={styles.breadcrumb}>
          <Pressable
            onPress={() => {
              const opened = navigateToAvailableRoute(
                navigation,
                ['Home']
              );

              if (!opened) {
                Alert.alert('Navigation', 'Home route was not found.');
              }
            }}
          >
            <Text style={styles.breadcrumbHome}>Home</Text>
          </Pressable>

          <Ionicons
            name="chevron-forward"
            size={14}
            color={C.secondaryText}
          />

          <Text style={styles.breadcrumbCurrent}>Clothing</Text>
        </View>

        {/* Intro */}
        <View style={styles.introHeader}>
          <Text style={styles.eyebrow}>YOUR STYLE, YOUR STORY</Text>

          <Text style={styles.heading}>
            Wear what{'\n'}feels like you.
          </Text>

          <Text style={styles.subtitle}>
            Thoughtful everyday essentials, timeless favourites,
            and styles that make every day feel special.
          </Text>
        </View>

        {/* Gender selectors */}
        <View style={styles.genderRow}>
          <GenderOption
            gender="male"
            selected={gender === 'male'}
            onPress={() => {
              setGender('male');
              setCategory('all');
            }}
          />

          <GenderOption
            gender="female"
            selected={gender === 'female'}
            onPress={() => {
              setGender('female');
              setCategory('all');
            }}
          />
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={20}
            color={C.secondaryText}
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search clothes..."
            placeholderTextColor={C.secondaryText}
            style={styles.searchInput}
            returnKeyType="search"
            autoCapitalize="none"
          />

          {!!search && (
            <Pressable
              onPress={() => setSearch('')}
              accessibilityLabel="Clear search"
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={C.secondaryText}
              />
            </Pressable>
          )}
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map((item) => (
            <CategoryChip
              key={item.key}
              label={item.label}
              selected={category === item.key}
              onPress={() => setCategory(item.key)}
            />
          ))}
        </ScrollView>

        {/* Collection */}
        <View style={styles.countRow}>
          <Text style={styles.sectionHeading}>
            {gender === 'male' ? "Men's Collection" : "Women's Collection"}
          </Text>

          <Text style={styles.itemCount}>
            {visibleProducts.length} items
          </Text>
        </View>

        {loading ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={C.primary} />
            <Text style={styles.stateText}>
              Finding your favourites...
            </Text>
          </View>
        ) : visibleProducts.length === 0 ? (
          <View style={styles.stateContainer}>
            <Ionicons
              name="shirt-outline"
              size={36}
              color={C.secondaryText}
            />
            <Text style={styles.stateText}>
              No clothing items found. Try another category or search.
            </Text>
          </View>
        ) : (
          <>
            {/* Best Sellers */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionHeading}>Best Sellers</Text>
                <Text style={styles.sectionSubtitle}>
                  The styles everyone loves
                </Text>
              </View>

              <Pressable onPress={() => setCategory('all')}>
                <Text style={styles.viewAll}>View All →</Text>
              </Pressable>
            </View>

            <FlatList
              data={bestSellers}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.productRow}
              contentContainerStyle={styles.productGrid}
            />

            {/* Explore All */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionHeading}>Explore All</Text>
                <Text style={styles.sectionSubtitle}>
                  Find your next favourite
                </Text>
              </View>
            </View>

            <FlatList
              data={visibleProducts}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.productRow}
              contentContainerStyle={styles.productGrid}
            />
          </>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.brandRow}>
            <View style={styles.logoBox}>
              <Ionicons
                name="bag-handle"
                size={19}
                color={C.white}
              />
            </View>
            <Text style={styles.footerBrandName}>MODEVA</Text>
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
            © 2026 MODEVA. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --------------------------------------------------
// STYLES
// --------------------------------------------------

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
    paddingTop: 44,
    paddingBottom: 24,
  },

  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 54,
    marginBottom: 15,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  brandName: {
    color: C.text,
    fontFamily: 'Georgia',
    fontSize: 25,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -3,
    right: -2,
    minWidth: 22,
    height: 22,
    paddingHorizontal: 5,
    borderRadius: 11,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: C.white,
    fontSize: 12,
    fontWeight: '800',
  },

  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  breadcrumbHome: {
    fontSize: 13,
    color: C.primary,
    fontWeight: '700',
  },
  breadcrumbCurrent: {
    fontSize: 13,
    color: C.text,
    fontWeight: '700',
  },

  introHeader: {
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: C.primary,
    marginBottom: 8,
  },
  heading: {
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: C.secondaryText,
    marginTop: 8,
    maxWidth: 310,
  },

  genderRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 34,
    marginBottom: 20,
  },
  genderOption: {
    alignItems: 'center',
    gap: 7,
  },
  genderCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderCircleSelected: {
    backgroundColor: C.primary,
    borderColor: C.primary,
    borderWidth: 2,
  },
  genderLabel: {
    fontSize: 12,
    color: C.secondaryText,
    fontWeight: '600',
  },
  genderLabelSelected: {
    color: C.primary,
    fontWeight: '800',
  },

  searchBar: {
    height: 48,
    backgroundColor: C.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 9,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 13,
    color: C.text,
  },

  categoriesRow: {
    gap: 8,
    paddingBottom: 20,
  },
  categoryChip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 13,
    paddingVertical: 10,
    backgroundColor: C.surface,
  },
  categoryChipSelected: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  categoryChipText: {
    fontSize: 11,
    color: C.secondaryText,
    fontWeight: '700',
  },
  categoryChipTextSelected: {
    color: C.white,
    fontWeight: '800',
  },

  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 17,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 21,
    fontWeight: '800',
    color: C.text,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: C.secondaryText,
    marginTop: 4,
  },
  itemCount: {
    fontSize: 12,
    color: C.secondaryText,
    fontWeight: '600',
  },
  viewAll: {
    fontSize: 12,
    fontWeight: '800',
    color: C.primary,
  },

  productGrid: {
    paddingBottom: 8,
  },
  productRow: {
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 15,
  },
  productCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: C.surface,
    borderRadius: 15,
    padding: 9,
    borderWidth: 1,
    borderColor: '#F0E6DC',
  },
  productImageContainer: {
    height: 145,
    borderRadius: 10,
    backgroundColor: C.muted,
    overflow: 'hidden',
    position: 'relative',
  },
  productImagePressable: {
    width: '100%',
    height: '100%',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartButton: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestSellerBadge: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    borderRadius: 5,
    backgroundColor: C.surface,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  bestSellerBadgeText: {
    color: C.primary,
    fontSize: 8,
    fontWeight: '800',
  },
  productName: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    color: C.text,
    marginTop: 9,
    minHeight: 34,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  ratingText: {
    fontSize: 10,
    color: C.text,
    fontWeight: '600',
  },
  reviewText: {
    fontSize: 10,
    color: C.secondaryText,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: C.primary,
    marginTop: 7,
    marginBottom: 9,
  },

  sizesContainer: {
    marginBottom: 9,
  },
  sizeLabel: {
    fontSize: 10,
    color: C.secondaryText,
    fontWeight: '700',
    marginBottom: 6,
  },
  sizesRow: {
    gap: 5,
  },
  sizeChip: {
    minWidth: 27,
    height: 27,
    paddingHorizontal: 6,
    borderRadius: 7,
    backgroundColor: C.background,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeChipSelected: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  sizeChipText: {
    color: C.text,
    fontSize: 9,
    fontWeight: '700',
  },
  sizeChipTextSelected: {
    color: C.white,
  },

  addButton: {
    marginTop: 3,
    borderRadius: 50,
    paddingVertical: 10,
    backgroundColor: C.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  addButtonText: {
    color: C.white,
    fontSize: 11,
    fontWeight: '800',
  },

  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 45,
    gap: 12,
  },
  stateText: {
    fontSize: 13,
    lineHeight: 19,
    color: C.secondaryText,
    textAlign: 'center',
  },

  footer: {
    marginTop: 28,
    paddingHorizontal: 4,
    paddingTop: 22,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: C.border,
    backgroundColor: C.background,
  },
  footerBrandName: {
    color: C.text,
    fontFamily: 'Georgia',
    fontSize: 23,
    fontWeight: '700',
  },
  footerDescription: {
    color: C.secondaryText,
    fontSize: 12,
    marginTop: 12,
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginTop: 18,
  },
  footerLinkText: {
    color: C.text,
    fontSize: 11,
    fontWeight: '500',
  },
  footerDivider: {
    height: 1,
    backgroundColor: C.border,
    marginTop: 20,
    marginBottom: 12,
  },
  copyright: {
    color: C.secondaryText,
    fontSize: 10,
    textAlign: 'center',
  },
});
