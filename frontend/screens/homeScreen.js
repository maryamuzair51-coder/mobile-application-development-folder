
import React, {useEffect,useCallback,useRef,useState,} from 'react';
import {

  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthModal } from '../components/authModalContext';
import { useCart } from '../screens/cartScreen';
import { useWishlist } from '../components/wishlistContext';
import { COLORS } from '../../styling/theme';

import { shopHomeStyles as s } from '../../styling/globalStyles';

const heroImage =
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000';

const categories = [
  {
    name: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500',
  },
  {
    name: 'Clothes',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500',
  },
  {
    name: 'Makeup',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500',
  },
];

const products = [
  {
    id: '1',
    name: 'Everyday leather wallet',
    price: 1200,
    category: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600',
  },
  {
    id: '2',
    name: 'Velvet matte lipstick',
    price: 650,
    category: 'Makeup',
    image:
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600',
  },
  {
    id: '3',
    name: 'Classic everyday handbag',
    price: 2450,
    category: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
  },
  {
    id: '4',
    name: 'Modern linen outfit',
    price: 3200,
    category: 'Clothes',
    image:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600',
  },
  {
    id: '5',
    name: 'Daily beauty essentials',
    price: 950,
    category: 'Makeup',
    image:
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600',
  },
  {
    id: '6',
    name: 'Minimal gold earrings',
    price: 1200,
    category: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600',
  },
];

const reviews = [
  {
    id: '1',
    name: 'Ayesha K.',
    rating: 5,
    product: 'Everyday leather wallet',
    comment: 'Beautiful packaging and lovely product quality!',
  },
  {
    id: '2',
    name: 'Sara M.',
    rating: 5,
    product: 'Velvet matte lipstick',
    comment: 'Loved the shopping experience and product quality.',
  },
  {
    id: '3',
    name: 'Fatima R.',
    rating: 4,
    product: 'Classic everyday handbag',
    comment: 'Lovely collection and easy shopping experience.',
  },
];

const formatPrice = (price) => 
  price.toLocaleString('en-PK');   //1,200

function Heading({ title, action, onPress }) {
  return (
    <View style={s.headingRow}>
      <Text style={s.sectionTitle}>{title}</Text>

      {action ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          <Text style={s.actionText}>{action} →</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const {openAuthModal,isLoggedIn,} = useAuthModal();
  const { addItem, cartCount } = useCart();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [email, setEmail] = useState('');
  const [offerTextWidth, setOfferTextWidth] = useState(0);

  const movement = useRef(new Animated.Value(0)).current;

  // Continuous discount banner with a gap between repeated messages.
  useEffect(() => {
    if (!offerTextWidth) {
      return undefined;
    }

    movement.setValue(0);

    const distance = offerTextWidth + 48;

    const animation = Animated.loop(
      Animated.timing(movement, {
        toValue: -distance,
        duration: 6000,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [movement, offerTextWidth]);
   


  // ------------------------------------------------
  // OPEN CART / SHOPPING BAG
  // ------------------------------------------------
  const openCartScreen = useCallback(() => {
    let currentNavigator = navigation;

    while (currentNavigator) {
      const state = currentNavigator.getState?.();
// get the screen name 
      const routeNames =
        state?.routeNames ||
        state?.routes?.map((route) => route.name) ||
        [];

      const cartRoute = routeNames.find((name) =>
        ['Cart', 'Bag', 'ShoppingCart', 'MyCart'].includes(name)
      );
//open cart
      if (cartRoute) {
        currentNavigator.navigate(cartRoute);
        return;
      }

      currentNavigator = currentNavigator.getParent?.();
    }

    Alert.alert(
      'Cart Unavailable',
      'The Cart screen could not be found. Please check your navigation setup.'
    );
  }, [navigation]);

  // ------------------------------------------------
  // ADD TO CART WITH SHARED LOGIN
  // ------------------------------------------------
  const handleAddToCart = useCallback(
    (product) => {
      if (!product) {
        Alert.alert('Error', 'Please select a product first.');
        return;
      }
// creating object
      const cartProduct = {
        ...product,
        id: String(product.id),
        name: product.name || product.title || 'Product',
        price: Number(product.price) || 0,
        image: product.image || null,
        category: product.category || 'General',
      };

      const finishAddingToCart = () => {
        addItem(cartProduct);

        Alert.alert(
          'Added to Cart',
          `${cartProduct.name} was successfully added to your cart.`,
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

// search  
  const filteredProducts = products.filter((item) => {
  const query = search.trim().toLowerCase();

  const matchesCategory =
    category === 'All' || item.category === category;

  const matchesSearch =
    !query ||
    item.name.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query);

  return matchesCategory && matchesSearch;
  });
  //open the cart
 const openBag = () => {
  openCartScreen();
 };
 // open drawer navigator
  const openDrawer = () => {
    let currentNavigation = navigation;

    while (currentNavigation) {
      if (currentNavigation.openDrawer) {
        currentNavigation.openDrawer();
        return;
      }

      currentNavigation = currentNavigation.getParent?.();
    }

    Alert.alert(
      'Menu unavailable',
      'Please check your drawer navigator configuration.'
    );
  };

  const handleSubscribe = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert(
        'Email required',
        'Please enter your email address.'
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      Alert.alert(
        'Invalid email',
        'Please enter a valid email address.'
      );
      return;
    }

    Alert.alert(
      'Thank you!',
      'Your email is valid. Email subscriptions will be saved when the backend is connected.'
    );

    setEmail('');
  };

  const openAccount = () => {
    try {
      navigation.navigate('Account');
    } catch {
      Alert.alert(
        'Account',
        'Please check the Account screen name in your navigator.'
      );
    }
  };

  return (
    <View style={s.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          s.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <View
          style={[
            s.header,
            { paddingTop: Math.max(insets.top, 12) },
          ]}
        >
          <TouchableOpacity
            style={s.brandRow}
            onPress={openDrawer}
            activeOpacity={0.8}
          >
            <View style={s.logoBox}>
              <Ionicons
                name="bag-handle"
                size={20}
                color={COLORS.white}
              />
            </View>

            <Text style={s.brandName}>MODEVA</Text>
          </TouchableOpacity>

          <View style={s.headerActions}>
            <TouchableOpacity
              onPress={openAccount}
              style={s.iconButton}
              accessibilityLabel="Open account"
            >
              <Ionicons
                name="person-outline"
                size={21}
                color={COLORS.text}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={openBag}
              style={s.iconButton}
              accessibilityLabel="Open shopping bag"
            >
              <Ionicons
                name="bag-outline"
                size={22}
                color={COLORS.text}
              />

              <View style={s.cartBadge}>
                <Text style={s.badgeText}>{cartCount}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* SEARCH */}
        
{/* SEARCH */}
<View style={s.searchBar}>
  <TouchableOpacity
    onPress={() => {
      if (!search.trim()) {
        Alert.alert(
          'Search MODEVA',
          'Please enter a product name or category.'
        );
      }
    }}
    accessibilityLabel="Search"
  >
    <Ionicons
      name="search-outline"
      size={21}
      color={COLORS.terracotta}
    />
  </TouchableOpacity>

  <TextInput
    value={search}
    onChangeText={setSearch}
    placeholder="Search products, clothes, makeup..."
    placeholderTextColor={COLORS.muted}
    style={s.searchInput}
    returnKeyType="search"
    accessibilityLabel="Search products"
    autoCapitalize="none"
    autoCorrect={false}
    onSubmitEditing={() => {
      if (!search.trim()) {
        Alert.alert(
          'Search MODEVA',
          'Please enter a product name or category.'
        );
      }
    }}
  />

  {search.length > 0 && (
    <TouchableOpacity
      onPress={() => setSearch('')}
      accessibilityLabel="Clear search"
    >
      <Ionicons
        name="close-circle"
        size={19}
        color={COLORS.muted}
      />
    </TouchableOpacity>
  )}
</View>


        {/* HERO */}
        <View style={s.hero}>
          <ImageBackground
            source={{ uri: heroImage }}
            style={s.heroImage}
            imageStyle={s.heroImageRadius}
            resizeMode="cover"
          >
            <View style={s.heroOverlay}>
              <Text style={s.eyebrow}>THE SHOEASE EDIT</Text>

              <Text style={s.heroTitle}>
                Everyday.{'\n'}Elevated.
              </Text>

              <TouchableOpacity
                style={s.shopButton}
                onPress={() => navigation.navigate('Explore')}
                activeOpacity={0.8}
              >
                <Text style={s.shopButtonText}>
                  Explore the collection
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* CONTINUOUS DISCOUNT BANNER */}
        <View style={s.offerStrip}>
          <Ionicons
            name="pricetag-outline"
            size={19}
            color={COLORS.terracotta}
          />

          <View style={s.offerClip}>
            {offerTextWidth > 0 ? (
              <Animated.View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  transform: [{ translateX: movement }],
                }}
              >
                <Text style={s.offerText}>
                  20% OFF ON ORDERS ABOVE RS. 1,200
                </Text>

                <View style={{ width: 48 }} />

                <Text style={s.offerText}>
                  20% OFF ON ORDERS ABOVE RS. 1,200
                </Text>
              </Animated.View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={s.offerText}
                  onLayout={(event) => {
                    const width =
                      event.nativeEvent.layout.width;

                    if (width > 0) {
                      setOfferTextWidth(width);
                    }
                  }}
                >
                  20% OFF ON ORDERS ABOVE RS. 1,200
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* CATEGORIES */}
        <View style={s.section}>
          <Heading
            title="Find your favourites"
            action="View all"
            onPress={() => setCategory('All')}
          />

          <View style={s.categoryRow}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={s.categoryItem}
                


 onPress={() => {
  const categoryName = item.name?.trim().toLowerCase();

  if (categoryName === 'accessories') {
    navigation.navigate('Explore', {
      screen: 'Accessories',
    });
  } else if (
    categoryName === 'clothing' ||
    categoryName === 'clothes'
  ) {
    navigation.navigate('Explore', {
      screen: 'Clothing',
    });
  } else if (categoryName === 'makeup') {
    navigation.navigate('Explore', {
      screen: 'Makeup',
    });
  } else {
    setCategory(item.name);
  }
 }}
 activeOpacity={0.8}
 >
  <Image
    source={{ uri: item.image }}
    style={s.categoryImage}
  />

  <Text style={s.categoryName}>
    {item.name}
  </Text>
 </TouchableOpacity>

            ))}
          </View>
        </View>

        {/* COLLECTION */}
        <View style={s.section}>
          <Heading title="Explore the collection" />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.filterRow}
          >
            {['All', 'Accessories', 'Clothes', 'Makeup'].map(
              (item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setCategory(item)}
                  style={[
                    s.filterChip,
                    category === item && s.activeFilterChip,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      s.filterText,
                      category === item &&
                        s.activeFilterText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>

          <View style={s.productGrid}>
            {filteredProducts.map((item) => (
              <View key={item.id} style={s.productCard}>
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        item.name,
                        `Price: Rs. ${formatPrice(item.price)}`
                      )
                    }
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={s.productImage}
                    />
                  </TouchableOpacity>

                  
<TouchableOpacity
  onPress={() => toggleWishlist(item)}
  style={s.heartButton}
  activeOpacity={0.7}
>
  <Ionicons
    name={isWishlisted(item) ? 'heart' : 'heart-outline'}
    size={21}
    color={
      isWishlisted(item)
        ? COLORS.primary
        : COLORS.text
    }
  />
</TouchableOpacity>

                </View>

                <Text
                  style={s.productName}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>

                <Text style={s.productPrice}>
                  Rs. {formatPrice(item.price)}
                </Text>

               
<TouchableOpacity
  style={s.addButton}
  onPress={() => handleAddToCart(item)}
  activeOpacity={0.8}
>
  <Ionicons
    name="bag-add-outline"
    size={15}
    color={COLORS.white}
  />

  <Text style={s.addButtonText}>
    Add to bag
  </Text>
</TouchableOpacity>

  
              </View>
            ))}
          </View>

          {filteredProducts.length === 0 ? (
            <Text style={s.emptyText}>
              No matching products found.
            </Text>
          ) : null}
        </View>

        {/* DELIVERY BENEFITS */}
        <View style={s.benefits}>
          {[
            ['car-outline', 'Pakistan-wide', 'Delivery'],
            [
              'shield-checkmark-outline',
              'Quality checked',
              'Every order',
            ],
            ['refresh-outline', 'Easy returns', 'See our policy'],
          ].map(([icon, title, subtitle]) => (
            <View key={title} style={s.benefitItem}>
              <Ionicons
                name={icon}
                size={21}
                color={COLORS.terracotta}
              />

              <Text style={s.benefitTitle}>{title}</Text>

              <Text style={s.benefitCaption}>
                {subtitle}
              </Text>
            </View>
          ))}
        </View>

        {/* CUSTOMER REVIEWS */}
        <View style={s.section}>
          <Heading title="Love from our customers" />

          {reviews.map((review) => (
            <View key={review.id} style={s.reviewCard}>
              <View style={s.reviewHeader}>
                <View style={s.avatar}>
                  <Text style={s.avatarText}>
                    {review.name.charAt(0)}
                  </Text>
                </View>

                <View style={s.reviewIdentity}>
                  <Text style={s.reviewerName}>
                    {review.name}
                  </Text>

                  <Text style={s.reviewProduct}>
                    {review.product}
                  </Text>
                </View>
              </View>

              <View style={s.stars}>
                {Array.from({ length: 5 }).map(
                  (_, index) => (
                    <Ionicons
                      key={index}
                      name={
                        index < review.rating
                          ? 'star'
                          : 'star-outline'
                      }
                      size={14}
                      color={COLORS.terracotta}
                    />
                  )
                )}
              </View>

              <Text style={s.reviewComment}>
                {review.comment}
              </Text>
            </View>
          ))}
        </View>

        {/* NEWSLETTER */}
        <View style={s.newsletter}>
          <Ionicons
            name="mail-open-outline"
            size={29}
            color={COLORS.terracotta}
          />

          <Text style={s.newsletterTitle}>
            A little something for your inbox
          </Text>

          <Text style={s.newsletterDescription}>
            Discover new arrivals, thoughtful edits and special
            offers.
          </Text>

          <View style={s.newsletterInputRow}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSubscribe}
              style={s.newsletterInput}
              accessibilityLabel="Enter your email"
            />

            <TouchableOpacity
              style={s.subscribeButton}
              onPress={handleSubscribe}
              activeOpacity={0.8}
            >
              <Text style={s.subscribeButtonText}>
                Subscribe
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={s.newsletterNote}>
            Stay updated with new arrivals and special offers.
          </Text>
        </View>

        {/* FOOTER */}
        <View style={s.footer}>
          <View style={s.brandRow}>
            <View style={s.logoBox}>
              <Ionicons
                name="bag-handle"
                size={19}
                color={COLORS.white}
              />
            </View>

            <Text style={s.footerBrandName}>MODEVA</Text>
          </View>

          <Text style={s.footerDescription}>
            Thoughtful finds for your everyday style.
          </Text>

          <View style={s.footerLinks}>
            {[
              'About us',
              'Contact us',
              'Help & support',
              'Shipping & returns',
              'Privacy policy',
              'Terms & conditions',
            ].map((label) => (
              <TouchableOpacity
                key={label}
                onPress={() =>
                  Alert.alert(
                    label,
                    'This page can be connected later.'
                  )
                }
              >
                <Text style={s.footerLinkText}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.footerDivider} />

          <Text style={s.copyright}>
            © 2026 MODEVA. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
