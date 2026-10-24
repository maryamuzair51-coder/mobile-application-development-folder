
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';

const WishlistContext = createContext(null);

const normalizeProduct = (product) => ({
  ...product,

  // Get a product ID from different possible property names
  id: String(
    product?.id ||
    product?.productId ||
    product?._id ||
    product?.name ||
    product?.title ||
    ''
  ),

  // Get the product name or use a default name
  name: product?.name || product?.title || 'Product',

  // Get the current price and convert it to a number
  price: Number(
    product?.price ||
    product?.discountedPrice ||
    product?.salePrice ||
    0
  ),

  // Get the original price
  oldPrice: Number(
    product?.oldPrice ||
    product?.originalPrice ||
    product?.regularPrice ||
    0
  ),

  // Get the product image from available image properties
  image:
    product?.image ||
    product?.thumbnail ||
    product?.imageUrl ||
    product?.images?.[0] ||
    '',
});

// Provider makes wishlist data available to child components
export function WishlistProvider({ children }) {
  // Store all wishlist products in an array
  const [wishlist, setWishlist] = useState([]);

  // Check whether a product is already in the wishlist
  const isWishlisted = useCallback(
    (product) => {
      const normalized = normalizeProduct(product);

      return (
        !!normalized.id &&
        wishlist.some((item) => item.id === normalized.id)
      );
    },
    [wishlist]
  );

  // Add a product to the wishlist or remove it if already present
  const toggleWishlist = useCallback((product) => {
    const normalized = normalizeProduct(product);

    // Do not add a product without an ID
    if (!normalized.id) {
      console.warn('Cannot wishlist a product without an ID.');
      return;
    }

    // Update the wishlist using its previous state
    setWishlist((current) => {
      // Check whether the product already exists
      const exists = current.some(
        (item) => item.id === normalized.id
      );

      // Remove the product if it is already wishlisted
      if (exists) {
        return current.filter(
          (item) => item.id !== normalized.id
        );
      }

      // Otherwise, add the product to the wishlist
      return [...current, normalized];
    });
  }, []);

  // Remove a product using either its object or its ID
  const removeFromWishlist = useCallback((productOrId) => {
    // If an object is provided, first get its normalized ID
    const id =
      typeof productOrId === 'object'
        ? normalizeProduct(productOrId).id
        : String(productOrId);

    // Keep every product except the one being removed
    setWishlist((current) =>
      current.filter((item) => item.id !== id)
    );
  }, []);

  // Share wishlist data and functions with other components
  const value = {
    wishlist,
    toggleWishlist,
    isWishlisted,
    removeFromWishlist,
  };

  // Make the context available to all child screens
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

// Custom hook to access wishlist context
export function useWishlist() {
  const context = useContext(WishlistContext);

  // Show an error if used outside WishlistProvider
  if (!context) {
    throw new Error(
      'useWishlist must be used inside WishlistProvider'
    );
  }

  // Return wishlist data and functions
  return context;
}
