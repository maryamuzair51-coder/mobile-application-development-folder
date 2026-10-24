
import React, { useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styling/theme';
import { globalStyles } from '../../styling/globalStyles';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=90';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const openShop = () => {
    navigation.replace('Main');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.cream,
      }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.cream}
      />

      <ScrollView
        style={{
          flex: 1,
          backgroundColor: COLORS.cream,
        }}
        contentContainerStyle={[
          globalStyles.splashContainer,
          {
            flexGrow: 1,
            backgroundColor: COLORS.cream,
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Brand */}
        <View style={globalStyles.splashHeader}>
          <View style={globalStyles.splashLogoBox}>
            <Ionicons
              name="bag-handle"
              size={25}
              color={COLORS.white}
            />
          </View>

          <Text style={globalStyles.splashBrandName}>
            MOVEDA
          </Text>
        </View>

        <Text style={globalStyles.splashTagline}>
          YOUR EVERYDAY STYLE, REIMAGINED
        </Text>

        {/* Main fashion image */}
        <View style={globalStyles.splashHeroWrap}>
          <ImageBackground
            source={{ uri: HERO_IMAGE }}
            style={globalStyles.splashHeroImage}
            resizeMode="cover"
          >
            <View style={globalStyles.splashImageOverlay}>
              <Text style={globalStyles.splashImageEyebrow}>
                LITTLE FINDS, EVERYDAY JOY
              </Text>

              <Text style={globalStyles.splashImageTitle}>
                A little more you.
              </Text>

              <Text style={globalStyles.splashImageCaption}>
                Discover your next favourite.
              </Text>
            </View>
          </ImageBackground>

          <View style={globalStyles.splashOfferBadge}>
            <Text style={globalStyles.splashOfferBadgeLabel}>
              SPECIAL
            </Text>

            <Text style={globalStyles.splashOfferBadgeValue}>
              20%
            </Text>

            <Text style={globalStyles.splashOfferBadgeOff}>
              OFF
            </Text>
          </View>
        </View>

        {/* Offer information */}
        <View style={globalStyles.splashOffer}>
          <View style={globalStyles.splashOfferIconBox}>
            <Ionicons
              name="pricetag"
              size={22}
              color={COLORS.terracotta}
            />
          </View>

          <View style={globalStyles.splashOfferTextWrap}>
            <Text style={globalStyles.splashOfferText}>
              20% OFF — Limited Stock!
            </Text>

            <Text style={globalStyles.splashOfferSubtext}>
              Find your favourites before they're gone.
            </Text>
          </View>

          <Ionicons
            name="sparkles-outline"
            size={20}
            color={COLORS.terracotta}
          />
        </View>

        {/* Explore button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={globalStyles.splashButton}
          onPress={openShop}
        >
          <Text style={globalStyles.splashButtonText}>
            Explore MOVEDA
          </Text>

          <View style={globalStyles.splashButtonArrow}>
            <Ionicons
              name="arrow-forward"
              size={21}
              color={COLORS.terracotta}
            />
          </View>
        </TouchableOpacity>

        {/* Footer */}
        <View style={globalStyles.splashFooter}>
          <Ionicons
            name="heart"
            size={15}
            color={COLORS.terracotta}
          />

          <Text style={globalStyles.splashFooterText}>
            CURATED FOR YOUR EVERYDAY
          </Text>

          <Ionicons
            name="heart"
            size={15}
            color={COLORS.terracotta}
          />
        </View>
      </ScrollView>
    </View>
  );
}
