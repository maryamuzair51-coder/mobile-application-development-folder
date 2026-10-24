
import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from './theme';

// Shared styles + existing Splash Screen styles
export const globalStyles = StyleSheet.create({
   // Splash Screen — redesigned ShopEase
  splashContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    width: '100%',
    paddingTop: 44,
    paddingBottom: 28,
    justifyContent: 'center',
    backgroundColor: COLORS.cream,
  },

  splashHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  splashLogoBox: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: COLORS.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

 splashBrandName: {
  color: COLORS.text,
  fontFamily: 'Georgia',
  fontSize: 30,
  fontWeight: '700',
  letterSpacing: 2,
},
  splashTagline: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 16,
  },

  splashHeroWrap: {
    width: '100%',
    height: 285,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: COLORS.terracottaLight,
    marginBottom: 24,
    position: 'relative',
  },

  splashHeroImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  splashImageOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 22,
    paddingTop: 22,
    backgroundColor: 'rgba(35, 24, 20, 0.32)',
  },

  splashImageEyebrow: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.8,
    marginBottom: 10,
  },

  splashImageTitle: {
    color: COLORS.white,
    fontFamily: 'Georgia',
    fontSize: 33,
    fontWeight: '700',
    lineHeight: 39,
    maxWidth: 245,
  },

  splashImageCaption: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 9,
    letterSpacing: 0.3,
  },

  splashOfferBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: COLORS.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.cream,
  },

  splashOfferBadgeLabel: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
  },

  splashOfferBadgeValue: {
    color: COLORS.white,
    fontSize: 27,
    lineHeight: 31,
    fontWeight: '800',
  },

  splashOfferBadgeOff: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  splashOffer: {
    width: '100%',
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 17,
  },

  splashOfferIconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: COLORS.terracottaLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  splashOfferTextWrap: {
    flex: 1,
  },

  splashOfferText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
  },

  splashOfferSubtext: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  splashButton: {
    width: '100%',
    minHeight: 58,
    backgroundColor: COLORS.terracotta,
    borderRadius: RADIUS.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 23,
    paddingRight: 7,
    paddingVertical: 7,
  },

  splashButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 4,
  },

  splashButtonArrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  splashFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  splashFooterText: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.4,
    marginLeft: 8,
  },
});
// ShopEase Home Screen styles
// Separate from globalStyles so Splash Screen remains unchanged.
export const shopHomeStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  scrollContent: {
    paddingTop: 12,
    paddingBottom: 24,
  },

  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.terracotta,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },
brandName: {
  color: COLORS.text,
  fontFamily: 'Georgia',
  fontSize: 25,
  fontWeight: 'bold',
  letterSpacing: 1.5,
},


  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  iconButton: {
    width: 30,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cartBadge: {
    position: 'absolute',
    top: 0,
    right: -3,
    minWidth: 15,
    height: 15,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: COLORS.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '700',
  },

  searchBar: {
    height: 44,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 12,
    paddingVertical: 0,
  },

  hero: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 18,
    overflow: 'hidden',
  },

  heroImage: {
    height: 235,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.terracottaLight,
  },

  heroImageRadius: {
    borderRadius: 18,
  },

  heroOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },

  eyebrow: {
    color: COLORS.terracottaLight,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 9,
  },

  heroTitle: {
    color: COLORS.white,
    fontFamily: 'Georgia',
    fontSize: 38,
    fontWeight: 'bold',
    lineHeight: 44,
    marginBottom: 17,
  },

  shopButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: COLORS.terracotta,
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: RADIUS.pill,
  },

  shopButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },

  offerStrip: {
    marginHorizontal: 20,
    minHeight: 43,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.terracottaLight,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  offerClip: {
    flex: 1,
    overflow: 'hidden',
  },

  offerText: {
    color: COLORS.terracotta,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  countdown: {
    textAlign: 'center',
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 6,
  },

  section: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
 sectionTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  actionText: {
    color: COLORS.terracotta,
    fontSize: 11,
  },

  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  categoryItem: {
    flex: 1,
    alignItems: 'center',
  },

  categoryImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    backgroundColor: COLORS.terracottaLight,
  },

  categoryName: {
    marginTop: 7,
    color: COLORS.text,
    fontSize: 11,
  },

  filterRow: {
    gap: 8,
    paddingBottom: 15,
  },

  filterChip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  activeFilterChip: {
    backgroundColor: COLORS.terracotta,
    borderColor: COLORS.terracotta,
  },

  filterText: {
    fontSize: 11,
    color: COLORS.text,
  },

  activeFilterText: {
    color: COLORS.white,
  },

  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },

  productCard: {
    width: '48%',
  },

  productImage: {
    width: '100%',
    height: 165,
    borderRadius: 13,
    backgroundColor: COLORS.terracottaLight,
  },

  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

   productName: {
    marginTop: 8,
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
    minHeight: 30,
  },
productPrice: {
    marginTop: 4,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
  },

  addButton: {
    marginTop: 9,
    borderRadius: RADIUS.pill,
    paddingVertical: 9,
    backgroundColor: COLORS.terracotta,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },

  addButtonText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
  },

  emptyText: {
    color: COLORS.muted,
    textAlign: 'center',
    padding: 20,
  },

  benefits: {
    marginTop: 26,
    marginHorizontal: 20,
    paddingVertical: 16,
    paddingHorizontal: 5,
    borderRadius: 15,
    backgroundColor: COLORS.terracottaLight,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  benefitItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },

  benefitTitle: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },

  benefitCaption: {
    color: COLORS.muted,
    fontSize: 9,
  },

  reviewCard: {
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    backgroundColor: COLORS.white,
  },

  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.terracottaLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: COLORS.terracotta,
    fontWeight: '700',
  },

  reviewIdentity: {
    flex: 1,
  },

  reviewerName: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },

  reviewProduct: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 3,
  },

  stars: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 8,
  },

  reviewComment: {
    color: COLORS.text,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },

  newsletter: {
    marginTop: 26,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: COLORS.terracottaLight,
    alignItems: 'center',
  },

 newsletterTitle: {
    color: COLORS.text,
    fontFamily: 'Georgia',
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  newsletterDescription: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 8,
  },

  newsletterNote: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 10,
  },

newsletterInputRow: {
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  marginTop: 18,
  gap: 8,
},

newsletterInput: {
  flex: 1,
  minWidth: 0,
  height: 48,
  backgroundColor: COLORS.white,
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: 12,
  paddingHorizontal: 12,
  color: COLORS.text,
  fontSize: 14,
},

subscribeButton: {
  minHeight: 48,
  paddingHorizontal: 14,
  backgroundColor: COLORS.terracotta,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
},

subscribeButtonText: {
  color: COLORS.white,
  fontSize: 13,
  fontWeight: '600',
},


  footer: {
    marginTop: 28,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.cream,
  },

  footerBrandName: {
    color: COLORS.text,
    fontFamily: 'Georgia',
    fontSize: 25,
    fontWeight: 'bold',
  },

  footerDescription: {
    color: COLORS.muted,
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
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '500',
  },
  footerDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 20,
    marginBottom: 12,
  },

  copyright: {
    color: COLORS.muted,
    fontSize: 10,
    textAlign: 'center',
  },

});
