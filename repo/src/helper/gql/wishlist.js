import { gql } from '@apollo/client';

export const GET_WISHLIST = gql`
  {
    wishlist {
      items {
        __typename
        id
        product {
          sku
          id
          name
          thumbnail {
            url
            path
            label
          }
          price {
            regularPrice {
              amount {
                value
                currency
              }
            }
            minimalPrice {
              amount {
                value
                currency
              }
            }
          }
          special_price
          pricing {
            you_save
            discount
            salable_quantity
            alhan_points
          }
          stock_status
          sale_badge
          market_badge
          feature_badge
          type_id
          only_x_left_in_stock
          hello_ar_product_code
          url_key
        }
      }
    }
  }
`;

export const REMOVE_SINGLE_PRODUCT_FROM_WISHLIST = gql`
  mutation removeProductFromWishlist($itemId: ID!) {
    removeProductFromWishlist(itemId: $itemId)
  }
`;

export const CLEAR_WISHLIST = gql`
  mutation {
    clearWishlist
  }
`;

export const MOVE_SINGLE_PRODUCT_TO_CART = gql`
  mutation moveWishlistItemToCart($wishlistItemId: Int!) {
    moveWishlistItemToCart(wishlistItemId: $wishlistItemId)
  }
`;

export const ADD_PRODUCT_TO_WISHLIST = gql`
  mutation ($wishlistItem: WishlistItemInput!) {
    saveWishlistItem(wishlistItem: $wishlistItem) {
      added_at
      description
      id
      product {
        name
      }
      qty
      sku
    }
  }
`;

export const MOVE_WISHLIST_TO_CART = gql`
  mutation {
    moveWishlistToCart
  }
`;
