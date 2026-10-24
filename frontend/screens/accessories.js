
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
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from './cartScreen';
import { COLORS as COLOR } from '../../styling/theme';
import { useAuthModal } from '../components/authModalContext';


// --------------------------------------------------
// API CONFIGURATION
// --------------------------------------------------

const DUMMYJSON_BASE = 'https://dummyjson.com/products';
const FAKESTORE_BASE = 'https://fakestoreapi.com/products';

const DUMMYJSON_CATEGORIES = [
  'mens-watches',
  'womens-watches',
  'womens-bags',
  'womens-jewellery',
  'sunglasses',
  'fragrances',
];

const CATEGORY_LABELS = {
  all: 'All Items',
  wallets: 'Purses / Wallets',
  watches: 'Watches',
  jewelry: 'Jewellery',
  bags: 'Bags',
  sunglasses: 'Sunglasses',
  fragrances: 'Fragrances',
};

const CATEGORIES = Object.entries(CATEGORY_LABELS).map(
  ([key, label]) => ({ key, label })
);

// --------------------------------------------------
// NORMALIZE PRODUCTS FROM BOTH APIS
// --------------------------------------------------

function normalizeProduct(product, source) {
  const category = String(product.category || '').toLowerCase();
  const name = String(product.title || product.name || '');
  const lowerName = name.toLowerCase();

  let type = null;
  let gender = 'unisex';

  if (category.startsWith('mens-')) {
    gender = 'male';
  } else if (category.startsWith('womens-')) {
    gender = 'female';
  }

  // Jewellery: Fake Store API spells this category "jewelery".
  if (
    category.includes('jewelery') ||
    category.includes('jewellery') ||
    category.includes('jewelry')
  ) {
    type = 'jewelry';
  } else if (
    category.includes('watch') ||
    /\bwatch(es)?\b/.test(lowerName)
  ) {
    type = 'watches';
  } else if (
    category.includes('sunglasses') ||
    /\bsunglasses\b/.test(lowerName)
  ) {
    type = 'sunglasses';
  } else if (
    category.includes('fragrance') ||
    category.includes('perfume')
  ) {
    type = 'fragrances';
  } else if (
    category.includes('bag') ||
    /\b(bag|purse|handbag|wallet|pouch)\b/.test(lowerName)
  ) {
    type = /\b(wallet|purse|pouch)\b/.test(lowerName)
      ? 'wallets'
      : 'bags';
  }

  // Exclude clothing, electronics, sports products, and
  // anything that cannot be identified as an accessory.
  if (!type) {
    return null;
  }

  // Infer gender from the name when the category does not specify it.
  if (gender === 'unisex') {
    if (/\b(men|mens|man's|male)\b/.test(lowerName)) {
      gender = 'male';
    } else if (
      /\b(women|womens|woman|female|ladies)\b/.test(lowerName)
    ) {
      gender = 'female';
    }
  }

  const ratingValue =
    typeof product.rating === 'object'
      ? product.rating?.rate
      : product.rating;

  return {
    // Prefix the ID to prevent collisions between the APIs.
    id: `${source}-${product.id}`,
    originalId: product.id,
    source,
    name,
    price: Number(product.price) || 0,
    image:
      product.thumbnail ||
      product.image ||
      product.images?.[0] ||
      null,
    rating: Number(ratingValue) || 0,
    reviews: Number(product.rating?.count) || 0,
    category,
    type,
    gender,
    description: product.description || '',
  };
}

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function formatPrice(price) {
  return `Rs. ${Number(price || 0).toLocaleString('en-PK', {
    maximumFractionDigits: 0,
  })}`;
}

function openParentDrawer(navigation) {
  let currentNavigation = navigation;

  while (currentNavigation) {
    if (typeof currentNavigation.openDrawer === 'function') {
      currentNavigation.openDrawer();
      return;
    }

    currentNavigation = currentNavigation.getParent?.();
  }

  Alert.alert(
    'Navigation',
    'The drawer menu is not available from this screen.'
  );
}

function navigateToAvailableRoute(navigation, routeName, params) {
  let currentNavigation = navigation;

  while (currentNavigation) {
    const routeNames = currentNavigation.getState?.()?.routeNames || [];

    if (routeNames.includes(routeName)) {
      currentNavigation.navigate(routeName, params);
      return true;
    }

    currentNavigation = currentNavigation.getParent?.();
  }

  return false;
}

// --------------------------------------------------
// GENDER SELECTOR
// --------------------------------------------------

function GenderOption({ gender, selected, onPress }) {
  const isMale = gender === 'male';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={styles.genderOption}
    >
      <View
        style={[
          styles.genderCircle,
          selected && styles.genderCircleSelected,
        ]}
      >
        <Ionicons
          name={isMale ? 'man-outline' : 'woman-outline'}
          size={29}
          color={selected ? COLOR.white : COLOR.primary}
        />
      </View>

      <Text
        style={[
          styles.genderLabel,
          selected && styles.genderLabelSelected,
        ]}
      >
        {isMale ? 'Male' : 'Female'}
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
          accessibilityLabel={`View ${product.name} details`}
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
                color={COLOR.secondaryText}
              />
            </View>
          )}
        </Pressable>

        <Pressable
          onPress={() => onFavorite(product)}
          accessibilityRole="button"
          accessibilityLabel={
            favorite ? 'Remove from favorites' : 'Add to favorites'
          }
          style={styles.heartButton}
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={20}
            color={favorite ? COLOR.primary : COLOR.text}
          />
        </Pressable>

        {product.rating >= 4.5 && (
          <View style={styles.bestSellerBadge}>
            <Text style={styles.bestSellerBadgeText}>
              BESTSELLER
            </Text>
          </View>
        )}
      </View>

      <Pressable onPress={() => onOpen(product)}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
      </Pressable>

      <View style={styles.ratingRow}>
        <Ionicons name="star" size={13} color={COLOR.gold} />

        <Text style={styles.ratingText}>
          {product.rating ? product.rating.toFixed(1) : 'New'}
        </Text>

        {product.reviews > 0 && (
          <Text style={styles.reviewText}>
            ({product.reviews})
          </Text>
        )}
      </View>

      <Text style={styles.productPrice}>
        {formatPrice(product.price)}
      </Text>

      <Pressable
        onPress={() => onAddToCart(product)}
        accessibilityRole="button"
        style={styles.addButton}
      >
        <Ionicons
          name="bag-add-outline"
          size={16}
          color={COLOR.white}
        />
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </Pressable>
    </View>
  );
}

// --------------------------------------------------
// ACCESSORIES SCREEN
// --------------------------------------------------

export default function AccessoriesScreen() {
  const navigation = useNavigation();

  const { openAuthModal, isLoggedIn } = useAuthModal();
  const { addItem, cartCount } = useCart();

  const [gender, setGender] = useState('male');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);

  // ------------------------------------------------
  // FETCH FROM BOTH APIS
  // ------------------------------------------------

  const loadProducts = useCallback(async () => {
    setError('');

    try {
      const dummyRequests = DUMMYJSON_CATEGORIES.map(
        async (slug) => {
          const response = await fetch(
            `${DUMMYJSON_BASE}/category/${encodeURIComponent(slug)}?limit=100`
          );

          if (!response.ok) {
            throw new Error(`DummyJSON category failed: ${slug}`);
          }

          const data = await response.json();

          return (data.products || [])
            .map((product) => normalizeProduct(product, 'dummy'))
            .filter(Boolean);
        }
      );

      const fakeStoreRequest = (async () => {
        const response = await fetch(FAKESTORE_BASE);

        if (!response.ok) {
          throw new Error('Fake Store API request failed');
        }

        const data = await response.json();

        return (Array.isArray(data) ? data : [])
          .map((product) => normalizeProduct(product, 'fake'))
          .filter(Boolean);
      })();

      const results = await Promise.allSettled([
        ...dummyRequests,
        fakeStoreRequest,
      ]);

      const successfulResults = results
        .filter((result) => result.status === 'fulfilled')
        .flatMap((result) => result.value);

      const uniqueProducts = Array.from(
        new Map(
          successfulResults.map((product) => [product.id, product])
        ).values()
      );

      if (uniqueProducts.length === 0) {
        setProducts([]);
        setError(
          'We could not load accessories. Check your connection and try again.'
        );
      } else {
        setProducts(uniqueProducts);
      }

      // Report partial failures without hiding successful results.
      const failedRequests = results.filter(
        (result) => result.status === 'rejected'
      );

      if (failedRequests.length > 0) {
        console.warn(
          `${failedRequests.length} accessory API request(s) failed.`
        );
      }
    } catch (err) {
      console.error('Accessories loading error:', err);
      setError(
        'We could not load accessories. Check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ------------------------------------------------
  // FILTER BY GENDER, CATEGORY, AND SEARCH
  // ------------------------------------------------

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesGender =
        product.gender === gender || product.gender === 'unisex';

      const matchesCategory =
        category === 'all' || product.type === category;

      const searchableText = [
        product.name,
        product.category,
        product.type,
        product.description,
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        query.length === 0 || searchableText.includes(query);

      return (
        matchesGender &&
        matchesCategory &&
        matchesSearch
      );
    });
  }, [products, gender, category, search]);

  const bestSellers = useMemo(
    () =>
      [...visibleProducts]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4),
    [visibleProducts]
  );

  const bestSellerIds = useMemo(
    () => new Set(bestSellers.map((product) => product.id)),
    [bestSellers]
  );

  const exploreProducts = useMemo(
  () => visibleProducts,
  [visibleProducts]
);

  // ------------------------------------------------
  // GENDER AND FAVORITES
  // ------------------------------------------------

  const selectGender = (value) => {
    setGender(value);
    setCategory('all');
  };

  const toggleFavorite = (product) => {
    setFavorites((previous) =>
      previous.includes(product.id)
        ? previous.filter((id) => id !== product.id)
        : [...previous, product.id]
    );
  };

  
  // ------------------------------------------------
  // OPEN CART SCREEN
  // ------------------------------------------------
  const openCartScreen = useCallback(() => {
    let navigator = navigation;

    while (navigator) {
      const state = navigator.getState?.();
      const routeNames =
        state?.routeNames ||
        state?.routes?.map((route) => route.name) ||
        [];

      const cartRoute = routeNames.find((name) =>
        ['Cart', 'Bag', 'ShoppingCart', 'MyCart'].includes(name)
      );

      if (cartRoute) {
        navigator.navigate(cartRoute);
        return;
      }

      navigator = navigator.getParent?.();
    }

    Alert.alert(
      'Navigation Error',
      'Cart screen is not registered. Please check your navigation files.'
    );
  }, [navigation]);

  // ------------------------------------------------
  // ADD TO CART WITH SHARED LOGIN
  // ------------------------------------------------
  const addToCart = useCallback(
    (product) => {
      if (!product) {
        Alert.alert('Error', 'Please select a product first.');
        return;
      }

      const cartProduct = {
        ...product,
        id: String(product.id),
        name: product.name || 'Accessory',
        price: Number(product.price) || 0,
        image: product.image || null,
        category: 'Accessories',
      };

      const finishAddingToCart = () => {
        addItem(cartProduct);

        Alert.alert(
          'Success',
          `${cartProduct.name} added to your cart successfully!`,
          [
            {
              text: 'Continue to Cart',
              onPress: openCartScreen,
            },
          ],
          { cancelable: false }
        );
      };

      if (isLoggedIn) {
        finishAddingToCart();
      } else {
        openAuthModal(finishAddingToCart);
      }
    },
    [addItem, isLoggedIn, openAuthModal, openCartScreen]
  );

  // ------------------------------------------------
  // HEADER ACTIONS
  // ------------------------------------------------

  const openAccount = () => {
    if (isLoggedIn) {
      const opened = navigateToAvailableRoute(
        navigation,
        'Account'
      );

      if (!opened) {
        Alert.alert(
          'Account',
          'You are already logged in.'
        );
      }
    } else {
      openAuthModal();
    }
  };

  const openBag = () => {
    const opened = navigateToAvailableRoute(navigation, 'Cart');

    if (!opened) {
      Alert.alert(
        'Shopping Bag',
        'The Cart screen could not be found in your navigation.'
      );
    }
  };

  const openProductDetails = (product) => {
    const categoryTitle =
      CATEGORY_LABELS[product.type] || 'Accessories';

    const productDetailsParams = {
      product: {
        ...product,
        title: product.name,
        name: product.name,
        image: product.image,
        thumbnail: product.image,
        category: categoryTitle,
        description:
          product.description ||
          `${product.name} from the MODEVA accessories collection.`,
      },
      category: 'Accessories',
      cartCount,
    };

    const opened = navigateToAvailableRoute(
      navigation,
      'ProductDetails',
      productDetailsParams
    );

    if (!opened) {
      Alert.alert(
        'Product Details',
        'The ProductDetails screen is not registered in the current navigation.'
      );
    }
  };

  const renderProduct = ({ item }) => (
    <ProductCard
      product={item}
      favorite={favorites.includes(item.id)}
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
        backgroundColor={COLOR.background}
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
            tintColor={COLOR.primary}
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
                color={COLOR.white}
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
                color={COLOR.text}
              />
            </Pressable>

            <TouchableOpacity
              onPress={openBag}
              style={styles.iconButton}
              accessibilityLabel="Open shopping bag"
            >
              <Ionicons
                name="bag-outline"
                size={22}
                color={COLOR.text}
              />

              <View style={styles.cartBadge}>
                <Text style={styles.badgeText}>
                  {cartCount}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Breadcrumb */}
        <View style={styles.breadcrumb}>
          <Pressable
            onPress={() => {
              const opened = navigateToAvailableRoute(
                navigation,
                'Home'
              );

              if (!opened) {
                Alert.alert(
                  'Navigation',
                  'The Home route could not be found.'
                );
              }
            }}
          >
            <Text style={styles.breadcrumbHome}>Home</Text>
          </Pressable>

          <Ionicons
            name="chevron-forward"
            size={14}
            color={COLOR.secondaryText}
          />

          <Text style={styles.breadcrumbCurrent}>
            Accessories
          </Text>
        </View>

        {/* Intro */}
        <View style={styles.introHeader}>
          <Text style={styles.eyebrow}>
            THE FINISHING TOUCH
          </Text>

          <Text style={styles.heading}>
            Small details. Big{'\n'}mood.
          </Text>

          <Text style={styles.subtitle}>
            Everyday companions, beautifully considered.
            Find the pieces that make it yours.
          </Text>
        </View>

        {/* Gender selectors */}
        <View style={styles.genderRow}>
          <GenderOption
            gender="male"
            selected={gender === 'male'}
            onPress={() => selectGender('male')}
          />

          <GenderOption
            gender="female"
            selected={gender === 'female'}
            onPress={() => selectGender('female')}
          />
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={20}
            color={COLOR.secondaryText}
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search accessories..."
            placeholderTextColor={COLOR.secondaryText}
            style={styles.searchInput}
            returnKeyType="search"
            autoCapitalize="none"
          />

          {search.length > 0 && (
            <Pressable
              onPress={() => setSearch('')}
              accessibilityLabel="Clear search"
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={COLOR.secondaryText}
              />
            </Pressable>
          )}
        </View>

        {/* Category chips */}
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

        {/* Collection title */}
        <View style={styles.countRow}>
          <Text style={styles.sectionHeading}>
            {gender === 'male'
              ? 'Male Collection'
              : 'Female Collection'}
          </Text>

          <Text style={styles.itemCount}>
            {visibleProducts.length} items
          </Text>
        </View>

        {/* Loading, error, empty and product states */}
        {loading ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={COLOR.primary} />
            <Text style={styles.stateText}>
              Finding your accessories...
            </Text>
          </View>
        ) : error && products.length === 0 ? (
          <View style={styles.stateContainer}>
            <Ionicons
              name="cloud-offline-outline"
              size={36}
              color={COLOR.primary}
            />

            <Text style={styles.stateText}>{error}</Text>

            <Pressable
              onPress={() => {
                setLoading(true);
                loadProducts();
              }}
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </Pressable>
          </View>
        ) : visibleProducts.length === 0 ? (
          <View style={styles.stateContainer}>
            <Ionicons
              name="search-outline"
              size={36}
              color={COLOR.secondaryText}
            />

            <Text style={styles.stateText}>
              No accessories found. Try another category or search.
            </Text>
          </View>
        ) : (
          <>
            {/* Best sellers */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionHeading}>
                  Best Sellers
                </Text>

                <Text style={styles.sectionSubtitle}>
                  The pieces everyone loves
                </Text>
              </View>

              <Pressable
                onPress={() => setCategory('all')}
              >
                <Text style={styles.viewAll}>
                  View All →
                </Text>
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

            {/* Explore all */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionHeading}>
                  Explore All
                </Text>

                <Text style={styles.sectionSubtitle}>
                  Find your everyday favourites
                </Text>
              </View>
            </View>

            {exploreProducts.length > 0 ? (
              <FlatList
                data={exploreProducts}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={styles.productRow}
                contentContainerStyle={styles.productGrid}
              />
            ) : (
              <Text style={styles.endText}>
                You have explored all available items.
              </Text>
            )}
          </>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.brandRow}>
            <View style={styles.logoBox}>
              <Ionicons
                name="bag-handle"
                size={19}
                color={COLOR.white}
              />
            </View>

            <Text style={styles.footerBrandName}>
              MODEVA
            </Text>
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
                <Text style={styles.footerLinkText}>
                  {label}
                </Text>
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
    backgroundColor: COLOR.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
  },

  // Header
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
    backgroundColor: COLOR.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  brandName: {
    color: COLOR.text,
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
    backgroundColor: COLOR.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: COLOR.white,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },

  // Breadcrumb
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  breadcrumbHome: {
    fontSize: 13,
    color: COLOR.primary,
    fontWeight: '700',
  },
  breadcrumbCurrent: {
    fontSize: 13,
    color: COLOR.text,
    fontWeight: '700',
  },

  // Intro
  introHeader: {
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: COLOR.primary,
    marginBottom: 8,
  },
  heading: {
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '800',
    color: COLOR.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: COLOR.secondaryText,
    marginTop: 8,
    maxWidth: 300,
  },

  // Gender
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
    backgroundColor: COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderCircleSelected: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
    borderWidth: 2,
  },
  genderLabel: {
    fontSize: 12,
    color: COLOR.secondaryText,
    fontWeight: '600',
  },
  genderLabelSelected: {
    color: COLOR.primary,
    fontWeight: '800',
  },

  // Search
  searchBar: {
    height: 48,
    backgroundColor: COLOR.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLOR.border,
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
    color: COLOR.text,
  },

  // Categories
  categoriesRow: {
    gap: 8,
    paddingBottom: 20,
  },
  categoryChip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLOR.border,
    paddingHorizontal: 13,
    paddingVertical: 10,
    backgroundColor: COLOR.surface,
  },
  categoryChipSelected: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
  },
  categoryChipText: {
    fontSize: 11,
    color: COLOR.secondaryText,
    fontWeight: '700',
  },
  categoryChipTextSelected: {
    color: COLOR.white,
    fontWeight: '800',
  },

  // Section headers
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
    color: COLOR.text,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: COLOR.secondaryText,
    marginTop: 4,
  },
  itemCount: {
    fontSize: 12,
    color: COLOR.secondaryText,
    fontWeight: '600',
  },
  viewAll: {
    fontSize: 12,
    fontWeight: '800',
    color: COLOR.primary,
  },

  // Product cards
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
    backgroundColor: COLOR.surface,
    borderRadius: 15,
    padding: 9,
    borderWidth: 1,
    borderColor: '#F0E6DC',
  },
  productImageContainer: {
    height: 145,
    borderRadius: 10,
    backgroundColor: COLOR.muted,
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
    backgroundColor: COLOR.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestSellerBadge: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    borderRadius: 5,
    backgroundColor: COLOR.surface,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  bestSellerBadgeText: {
    color: COLOR.primary,
    fontSize: 8,
    fontWeight: '800',
  },
  productName: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    color: COLOR.text,
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
    color: COLOR.text,
    fontWeight: '600',
  },
  reviewText: {
    fontSize: 10,
    color: COLOR.secondaryText,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: COLOR.primary,
    marginTop: 7,
    marginBottom: 9,
  },
  addButton: {
    marginTop: 3,
    borderRadius: 50,
    paddingVertical: 10,
    backgroundColor: COLOR.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  addButtonText: {
    color: COLOR.white,
    fontSize: 11,
    fontWeight: '800',
  },

  // Loading and empty states
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 45,
    gap: 12,
  },
  stateText: {
    fontSize: 13,
    lineHeight: 19,
    color: COLOR.secondaryText,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLOR.primary,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: COLOR.white,
    fontSize: 12,
    fontWeight: '800',
  },
  endText: {
    fontSize: 12,
    color: COLOR.secondaryText,
    paddingVertical: 20,
    textAlign: 'center',
  },

  // Footer
  footer: {
    marginTop: 28,
    paddingHorizontal: 4,
    paddingTop: 22,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: COLOR.border,
    backgroundColor: COLOR.background,
  },
  footerBrandName: {
    color: COLOR.text,
    fontFamily: 'Georgia',
    fontSize: 23,
    fontWeight: '700',
  },
  footerDescription: {
    color: COLOR.secondaryText,
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
    color: COLOR.text,
    fontSize: 11,
    fontWeight: '500',
  },
  footerDivider: {
    height: 1,
    backgroundColor: COLOR.border,
    marginTop: 20,
    marginBottom: 12,
  },
  copyright: {
    color: COLOR.secondaryText,
    fontSize: 10,
    textAlign: 'center',
  },
});
