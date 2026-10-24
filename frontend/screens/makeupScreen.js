
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
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
import { useAuthModal } from '../components/authModalContext';
import { COLORS as C } from '../../styling/theme';

// --------------------------------------------------
// API CONFIGURATION
// --------------------------------------------------

const API_URLS = {
  makeup: 'https://dummyjson.com/products/category/beauty?limit=0',
  skincare: 'https://dummyjson.com/products/category/skin-care?limit=0',
  fragrance: 'https://dummyjson.com/products/category/fragrances?limit=0',
  store: 'https://fakestoreapi.com/products',
};

const USD_TO_PKR = 280;



// --------------------------------------------------
// CATEGORIES
// --------------------------------------------------

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'makeup', label: 'Makeup' },
  { key: 'skincare', label: 'Skincare' },
  { key: 'fragrance', label: 'Fragrance' },
  { key: 'sale', label: 'Sale' },
];

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const money = (amount) =>
  `Rs. ${Math.round(Number(amount || 0)).toLocaleString('en-PK')}`;

const toPKR = (amount) =>
  Math.round(Number(amount || 0) * USD_TO_PKR);

function normalizeBeauty(item, category = 'makeup') {
  const originalPrice = Number(item.price || 0);
  const discount = Math.max(
    0,
    Math.min(90, Number(item.discountPercentage || 0))
  );

  const onSale = Number(item.id) % 3 === 0 && discount > 0;

  return {
    id: `${category}-${item.id}`,
    name: String(item.title || 'Beauty Product'),
    description:
      item.description || 'Discover your new beauty essential.',
    image: item.thumbnail || item.images?.[0] || item.image || null,
    price: toPKR(
      onSale
        ? originalPrice * (1 - discount / 100)
        : originalPrice
    ),
    originalPrice: onSale ? toPKR(originalPrice) : null,
    discount: onSale ? Math.max(1, Math.round(discount)) : 0,
    rating: Number(item.rating?.rate ?? item.rating ?? 0),
    category,
    brand: item.brand || 'MOVEDA Beauty',
    stock: Number(item.stock ?? 0),
    sale: onSale,
  };
}

function normalizeShopProduct(item, index) {
  const title = String(item.title || '');
  const description = String(item.description || '');

  const beautyKeywords =
    /\b(makeup|cosmetic|lipstick|mascara|eyeliner|foundation|concealer|blush|eyeshadow|lip gloss|nail polish|perfume|fragrance|skincare|skin care|moisturizer|moisturiser|serum|cleanser|sunscreen|beauty|face cream)\b/i;

  if (!beautyKeywords.test(`${title} ${description}`)) {
    return null;
  }

  const originalPrice = Number(item.price || 0);
  const onSale = index % 4 === 0;
  const discount = onSale ? 15 : 0;

  return {
    id: `store-${item.id}`,
    name: title || 'Beauty Product',
    description: description || 'Discover another beauty find.',
    image: item.image || null,
    price: toPKR(
      onSale ? originalPrice * (1 - discount / 100) : originalPrice
    ),
    originalPrice: onSale ? toPKR(originalPrice) : null,
    discount,
    rating: Number(item.rating?.rate || 0),
    category: 'makeup',
    brand: 'MOVEDA Picks',
    stock: 1,
    sale: onSale,
  };
}

// Search the current navigator and its parents for a route.
function navigateToRoute(navigation, routeName, params) {
  let current = navigation;

  while (current) {
    const routeNames = current.getState?.()?.routeNames || [];

    if (routeNames.includes(routeName)) {
      current.navigate(routeName, params);
      return true;
    }

    current = current.getParent?.();
  }

  return false;
}

function openParentDrawer(navigation) {
  let current = navigation;

  while (current) {
    if (typeof current.openDrawer === 'function') {
      current.openDrawer();
      return;
    }

    current = current.getParent?.();
  }

  Alert.alert(
    'MOVEDA',
    'The drawer menu could not be opened. Check your navigation setup.'
  );
}

// --------------------------------------------------
// CATEGORY CHIP
// --------------------------------------------------

function CategoryChip({ item, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text
        style={[
          styles.chipText,
          selected && styles.chipTextSelected,
        ]}
      >
        {item.label}
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
  onOpen,
  onAdd,
}) {
  return (
    <View style={styles.productCard}>
      <View style={styles.imageBox}>
        <Pressable
          style={styles.imagePressable}
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
                color={C.secondary}
              />
            </View>
          )}
        </Pressable>

        {product.sale && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleText}>
              {product.discount}% OFF
            </Text>
          </View>
        )}

        <Pressable
          style={styles.heartButton}
          onPress={() => onFavorite(product)}
          accessibilityRole="button"
          accessibilityLabel={
            favorite ? 'Remove from wishlist' : 'Add to wishlist'
          }
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={19}
            color={favorite ? '#D93045' : '#555555'}
          />
        </Pressable>
      </View>

      <Text style={styles.productTag} numberOfLines={1}>
        {product.brand}
      </Text>

      <Pressable onPress={() => onOpen(product)}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
      </Pressable>

      <Text style={styles.shortDescription} numberOfLines={2}>
        {product.description}
      </Text>

      <View style={styles.ratingRow}>
        <Ionicons name="star" size={13} color={C.gold} />
        <Text style={styles.ratingText}>
          {Number(product.rating || 0).toFixed(1)}
        </Text>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.productPrice}>
          {money(product.price)}
        </Text>

        {product.sale && product.originalPrice != null && (
          <Text style={styles.originalPrice}>
            {money(product.originalPrice)}
          </Text>
        )}
      </View>

      <Pressable
        style={styles.addButton}
        onPress={() => onAdd(product)}
        accessibilityRole="button"
        accessibilityLabel={`Add ${product.name} to bag`}
      >
        <Ionicons
          name="bag-add-outline"
          size={16}
          color={C.white}
        />
        <Text style={styles.addButtonText}>Add to Bag</Text>
      </Pressable>
    </View>
  );
}

// --------------------------------------------------
// MAKEUP SCREEN
// --------------------------------------------------

export default function MakeupScreen() {
  const navigation = useNavigation();

  const { addItem, cartCount = 0 } = useCart();

  const { isLoggedIn, openAuthModal } = useAuthModal();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);

  // ------------------------------------------------
  // NAVIGATION
  // ------------------------------------------------

  const openHome = () => {
    const opened = navigateToRoute(navigation, 'Home');

    if (!opened && navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    if (!opened) {
      Alert.alert(
        'MOVEDA',
        'The Home route could not be found. Check your navigation setup.'
      );
    }
  };

  const openAccount = () => {
    const opened = navigateToRoute(navigation, 'Account');

    if (!opened) {
      Alert.alert(
        'MODEVA',
        'The Account route could not be found. Check the registered tab name.'
      );
    }
  };

  const openBag = () => {
    const opened =
      navigateToRoute(navigation, 'Bag') ||
      navigateToRoute(navigation, 'Cart');

    if (!opened) {
      Alert.alert(
        'MODEVA',
        'The Bag or Cart route could not be found. Check your bottom navigation.'
      );
    }
  };

  // ------------------------------------------------
  // ADD TO BAG — LOGIN REQUIRED
  // ------------------------------------------------

  const handleAddToCart = useCallback(
    (product) => {
      const addProduct = () => {
        const cartProduct = {
          ...product,
          id: String(product.id),
          name: product.name || 'Beauty Product',
          price: Number(product.price || 0),
          image: product.image || null,
          category: product.category || 'makeup',
          quantity: 1,
        };

        addItem(cartProduct);

        Alert.alert(
          'Added to Bag',
          `${cartProduct.name} has been added to your bag.`,
          [
            {
              text: 'Continue Shopping',
              style: 'cancel',
            },
            {
              text: 'Go to Bag',
              onPress: openBag,
            },
          ]
        );
      };

      if (!isLoggedIn) {
        openAuthModal(addProduct);
        return;
      }

      addProduct();
    },
    [addItem, isLoggedIn, openAuthModal]
  );

  // ------------------------------------------------
  // LOAD PRODUCTS FROM APIs
  // ------------------------------------------------

  const loadProducts = useCallback(async () => {
    setError('');

    try {
      const requests = [
        fetch(API_URLS.makeup),
        fetch(API_URLS.skincare),
        fetch(API_URLS.fragrance),
        fetch(API_URLS.store),
      ];

      const results = await Promise.allSettled(requests);
      const combinedProducts = [];
      let failedCount = 0;

      const beautyCategories = [
        'makeup',
        'skincare',
        'fragrance',
      ];

      for (let i = 0; i < 3; i++) {
        const result = results[i];

        if (
          result.status !== 'fulfilled' ||
          !result.value.ok
        ) {
          failedCount++;
          continue;
        }

        try {
          const data = await result.value.json();

          if (Array.isArray(data.products)) {
            combinedProducts.push(
              ...data.products.map((item) =>
                normalizeBeauty(item, beautyCategories[i])
              )
            );
          } else {
            failedCount++;
          }
        } catch {
          failedCount++;
        }
      }

      const storeResult = results[3];

      if (
        storeResult.status === 'fulfilled' &&
        storeResult.value.ok
      ) {
        try {
          const storeData = await storeResult.value.json();

          if (Array.isArray(storeData)) {
            combinedProducts.push(
              ...storeData
                .map((item, index) =>
                  normalizeShopProduct(item, index)
                )
                .filter(Boolean)
            );
          } else {
            failedCount++;
          }
        } catch {
          failedCount++;
        }
      } else {
        failedCount++;
      }

      if (combinedProducts.length === 0) {
        throw new Error('No beauty products could be loaded.');
      }

      setProducts(combinedProducts);

      if (failedCount > 0) {
        setError(
          'Some product sources could not load. Showing available products.'
        );
      }
    } catch (e) {
      console.warn('Makeup product loading error:', e);

      setError(
        'Could not load products. Check your internet and try again.'
      );

      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ------------------------------------------------
  // SEARCH AND CATEGORY FILTERS
  // ------------------------------------------------

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === 'all' ||
        (category === 'sale' && product.sale) ||
        product.category === category;

      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  // ------------------------------------------------
  // WISHLIST
  // ------------------------------------------------

  const isFavorite = (product) =>
    favorites.includes(product.id);

  const toggleFavorite = (product) => {
    setFavorites((previous) =>
      previous.includes(product.id)
        ? previous.filter((id) => id !== product.id)
        : [...previous, product.id]
    );
  };

  // ------------------------------------------------
  // PRODUCT DETAILS
  // ------------------------------------------------

  const openProductDetails = (product) => {
    const formattedCategory =
      product.category === 'makeup'
        ? 'Makeup'
        : product.category === 'skincare'
        ? 'Skincare'
        : product.category === 'fragrance'
        ? 'Fragrance'
        : product.category;

    const params = {
      product: {
        ...product,
        category: formattedCategory,
      },
      category: product.category,
      cartCount,
    };

    const opened = navigateToRoute(
      navigation,
      'ProductDetails',
      params
    );

    if (!opened) {
      Alert.alert(
        product.name,
        `${product.description}\n\nPrice: ${money(product.price)}`
      );
    }
  };

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
            tintColor={C.primary}
            onRefresh={() => {
              setRefreshing(true);
              loadProducts();
            }}
          />
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable
            style={styles.brandRow}
            onPress={() => openParentDrawer(navigation)}
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

            <Text style={styles.brandName}>MODEVA</Text>
          </Pressable>

          <View style={styles.headerActions}>
            <Pressable
              onPress={openAccount}
              style={styles.headerIcon}
              accessibilityRole="button"
              accessibilityLabel="Account"
            >
              <Ionicons
                name="person-outline"
                size={23}
                color={C.text}
              />
            </Pressable>

            <Pressable
              onPress={openBag}
              style={styles.headerIcon}
              accessibilityRole="button"
              accessibilityLabel={`Shopping bag, ${cartCount} items`}
            >
              <Ionicons
                name="bag-outline"
                size={24}
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
          <Pressable onPress={openHome}>
            <Text style={styles.breadcrumbHome}>Home</Text>
          </Pressable>

          <Ionicons
            name="chevron-forward"
            size={14}
            color={C.secondary}
          />

          <Text style={styles.breadcrumbCurrent}>Makeup</Text>
        </View>

        {/* INTRODUCTION */}
        <Text style={styles.eyebrow}>THE BEAUTY SHELF</Text>

        <Text style={styles.heading}>
          Your everyday glow.
        </Text>

        <Text style={styles.subtitle}>
          Soft colours, effortless finishes. Beauty staples to
          help you feel your best self.
        </Text>

        {/* SEARCH */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={18}
            color={C.secondary}
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search beauty essentials"
            placeholderTextColor={C.secondary}
            style={styles.searchInput}
            returnKeyType="search"
          />

          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons
                name="close-circle"
                size={19}
                color={C.secondary}
              />
            </Pressable>
          )}
        </View>

        {/* CATEGORY FILTERS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {CATEGORIES.map((item) => (
            <CategoryChip
              key={item.key}
              item={item}
              selected={category === item.key}
              onPress={() => setCategory(item.key)}
            />
          ))}
        </ScrollView>

        {/* PRODUCT SECTION */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionHeading}>
              {category === 'sale'
                ? 'Special Offers'
                : category === 'all'
                ? 'Beauty Essentials'
                : category.charAt(0).toUpperCase() +
                  category.slice(1)}
            </Text>

            <Text style={styles.sectionSubtitle}>
              {visibleProducts.length} products to discover
            </Text>
          </View>

          <Pressable
            onPress={() => {
              setCategory('all');
              setSearch('');
            }}
          >
            <Text style={styles.viewAll}>Reset</Text>
          </Pressable>
        </View>

        {/* LOADING / ERROR / PRODUCTS */}
        {loading ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator
              size="large"
              color={C.primary}
            />

            <Text style={styles.stateText}>
              Finding your beauty favourites...
            </Text>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.stateContainer}>
            <Ionicons
              name="cloud-offline-outline"
              size={36}
              color={C.secondary}
            />

            <Text style={styles.stateText}>{error}</Text>

            <Pressable
              style={styles.retryButton}
              onPress={() => {
                setLoading(true);
                loadProducts();
              }}
            >
              <Text style={styles.addButtonText}>
                Try Again
              </Text>
            </Pressable>
          </View>
        ) : visibleProducts.length === 0 ? (
          <View style={styles.stateContainer}>
            <Ionicons
              name="search-outline"
              size={35}
              color={C.secondary}
            />

            <Text style={styles.stateText}>
              No products found. Try another search.
            </Text>
          </View>
        ) : (
          <>
            {!!error && (
              <Text style={styles.stateText}>{error}</Text>
            )}

            <View style={styles.productGrid}>
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  favorite={isFavorite(product)}
                  onFavorite={toggleFavorite}
                  onOpen={openProductDetails}
                  onAdd={handleAddToCart}
                />
              ))}
            </View>
          </>
        )}

        {/* BEAUTY SHADE PANEL */}
        <View style={styles.shadePanel}>
          <Text style={styles.shadeTitle}>
            A shade of you.
          </Text>

          <View style={styles.shadeRow}>
            {[
              '#D9A18B',
              '#C17A65',
              '#A55243',
              '#783C35',
            ].map((shade) => (
              <View
                key={shade}
                style={[
                  styles.shadeCircle,
                  { backgroundColor: shade },
                ]}
              />
            ))}

            <Pressable
              onPress={() =>
                Alert.alert(
                  'Beauty shades',
                  'Explore your favourite beauty products above.'
                )
              }
            >
              <Text style={styles.shadeLink}>
                Find your shade →
              </Text>
            </Pressable>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Pressable
            style={styles.brandRow}
            onPress={() => openParentDrawer(navigation)}
          >
            <View style={styles.logoBox}>
              <Ionicons
                name="bag-handle"
                size={23}
                color={C.white}
              />
            </View>

            <Text style={styles.footerBrand}>MODEVA</Text>
          </Pressable>

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

  // Header
  header: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },
  brandName: {
    fontSize: 25,
    fontWeight: '800',
    color: C.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 38,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconButton: {
    width: 38,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -3,
    minWidth: 19,
    height: 19,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: C.white,
    fontSize: 10,
    fontWeight: '800',
  },

  // Breadcrumb
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
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

  // Page heading
  introHeader: {
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
    color: C.primary,
    marginBottom: 7,
  },
  heading: {
    fontSize: 30,
    lineHeight: 37,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: C.secondaryText || C.secondary,
    marginTop: 7,
    marginBottom: 18,
  },

  // Search
  searchBar: {
    height: 47,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 13,
    color: C.text,
  },

  // Categories
  categoriesRow: {
    gap: 8,
    paddingBottom: 19,
  },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  chipSelected: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  chipText: {
    fontSize: 11,
    color: C.secondaryText || C.secondary,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: C.white,
    fontWeight: '800',
  },
  categoryChip: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  categoryChipSelected: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  categoryChipText: {
    fontSize: 11,
    color: C.secondaryText || C.secondary,
    fontWeight: '700',
  },
  categoryChipTextSelected: {
    color: C.white,
    fontWeight: '800',
  },

  // Section headings
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 15,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: C.text,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: C.secondaryText || C.secondary,
    marginTop: 4,
  },
  itemCount: {
    fontSize: 12,
    color: C.secondaryText || C.secondary,
    fontWeight: '600',
  },
  viewAll: {
    fontSize: 12,
    fontWeight: '800',
    color: C.primary,
  },

  // Product grid
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 15,
  },
  productCard: {
    width: '48.5%',
    marginBottom: 15,
    padding: 8,
    backgroundColor: C.surface,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: C.border,
  },

  // Product image
  imageBox: {
    height: 155,
    borderRadius: 10,
    backgroundColor: C.muted || '#F2E8DF',
    overflow: 'hidden',
    position: 'relative',
  },
  productImageContainer: {
    height: 155,
    borderRadius: 10,
    backgroundColor: C.muted || '#F2E8DF',
    overflow: 'hidden',
    position: 'relative',
  },
  imagePressable: {
    width: '100%',
    height: '100%',
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

  // Sale and wishlist
  saleBadge: {
    position: 'absolute',
    left: 7,
    bottom: 7,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 5,
    backgroundColor: C.primary,
  },
  saleText: {
    fontSize: 9,
    color: C.white,
    fontWeight: '800',
  },
  bestSellerBadge: {
    position: 'absolute',
    left: 7,
    bottom: 7,
    borderRadius: 5,
    backgroundColor: C.surface,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  bestSellerBadgeText: {
    color: C.primary,
    fontSize: 9,
    fontWeight: '800',
  },
  heartButton: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 32,
    height: 32,
    borderRadius: 17,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Product details
  productTag: {
    fontSize: 9,
    color: C.primary,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 9,
  },
  productName: {
    fontSize: 12,
    lineHeight: 17,
    minHeight: 34,
    fontWeight: '700',
    color: C.text,
    marginTop: 7,
  },
  shortDescription: {
    fontSize: 10,
    lineHeight: 14,
    color: C.secondaryText || C.secondary,
    minHeight: 27,
    marginTop: 3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
  },
  ratingText: {
    fontSize: 10,
    color: C.text,
    fontWeight: '700',
  },
  reviewText: {
    fontSize: 10,
    color: C.secondaryText || C.secondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 8,
    marginBottom: 9,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: C.primary,
    marginTop: 7,
    marginBottom: 9,
  },
  originalPrice: {
    fontSize: 10,
    color: '#9B9189',
    textDecorationLine: 'line-through',
  },

  // Add to bag
  addButton: {
    minHeight: 37,
    borderRadius: 24,
    paddingHorizontal: 7,
    paddingVertical: 9,
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

  // Loading and empty states
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 42,
    gap: 12,
  },
  stateText: {
    fontSize: 13,
    lineHeight: 20,
    color: C.secondaryText || C.secondary,
    textAlign: 'center',
    marginVertical: 5,
  },
  retryButton: {
    backgroundColor: C.primary,
    borderRadius: 22,
    paddingHorizontal: 23,
    paddingVertical: 11,
  },
  retryText: {
    color: C.white,
    fontSize: 12,
    fontWeight: '800',
  },
  endText: {
    fontSize: 12,
    color: C.secondaryText || C.secondary,
    paddingVertical: 20,
    textAlign: 'center',
  },

  // Beauty shades panel
  shadePanel: {
    backgroundColor: '#F2E2D7',
    padding: 15,
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 17,
  },
  shadeTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: C.text,
  },
  shadeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  shadeCircle: {
    width: 17,
    height: 17,
    borderRadius: 9,
  },
  shadeLink: {
    color: C.primary,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 5,
  },

  // Footer
  footer: {
    marginTop: 28,
    paddingTop: 23,
    paddingHorizontal: 4,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: C.border,
    backgroundColor: C.background,
  },
  footerBrand: {
    fontSize: 25,
    fontWeight: '800',
    color: C.text,
  },
  footerBrandName: {
    fontSize: 25,
    fontWeight: '800',
    color: C.text,
  },
  footerDescription: {
    fontSize: 12,
    lineHeight: 19,
    color: C.secondaryText || C.secondary,
    marginTop: 11,
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 18,
    rowGap: 14,
    marginTop: 20,
  },
  footerLinkText: {
    fontSize: 11,
    fontWeight: '600',
    color: C.text,
  },
  footerDivider: {
    height: 1,
    backgroundColor: C.border,
    marginTop: 22,
    marginBottom: 14,
  },
  copyright: {
    fontSize: 10,
    color: C.secondaryText || C.secondary,
    textAlign: 'center',
  },
});
