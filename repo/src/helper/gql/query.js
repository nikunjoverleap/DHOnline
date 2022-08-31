import { gql } from '@apollo/client';

export const HOME_PAGE_LIST = gql`
  query getHomePageList($pageId: String, $locale: String) {
    # add your query
    getPage(pageId: $pageId, locale: $locale) {
      pageName
      selectRows
      selectTabs
    }
  }
`;

export const CATEGORIES_PAGE_LIST = gql`
  query getCategoriesPageList($pageId: String, $locale: String) {
    getPage(pageId: $pageId, locale: $locale) {
      pageName
      selectRows
      selectTabs
    }
  }
`;

export const GENERATE_CUSTOMER_TOKEN_BY_FIREBASE = gql`
  query generateCustomerTokenByFirebase($token: String!) {
    generateCustomerTokenByFirebase(token: $token) {
      token
    }
  }
`;

export const VIEW_CART_GUEST = gql`
  query ($cart_id: String) {
    cartData: getCartForCustomer(guestCartId: $cart_id) {
      subtotal
      items_qty
      tax_amount
      grand_total
      discount_amount
      base_currency_code: quote_currency_code
      subtotal_with_discount
      coupon_code
      cod_charge
      shipping_amount
      is_virtual
      alhan_points
      ahlan
      applied_rule_ids
      minimum_order_amount
      minimum_order_description
      order_can_be_placed
      applied_coupon_description
      items {
        qty
        sku
        name
        price
        item_id
        row_total
        tax_amount
        tax_percent
        discount_amount
        discount_percent
        you_save
        free_product
        product {
          id
          sku
          name
          qty
          stock_status
          url_key
          canonical_url
          type_id
          product_variant {
            label
            url
            value
          }
          categories {
            name
          }
          thumbnail {
            url
            path
            label
          }
          product_links {
            position
            link_type
            linked_product_sku
          }
          crosssell_products {
            sku
            name
          }
        }
        additional_options {
          label
          values
        }
        bundle_options {
          label
          type
          uid
          values {
            id
            label
            price
            quantity
            uid
          }
        }
        gift_card_cart_item_data {
          sender_name
          sender_email
          recipient_name
          recipient_email
          message
        }
      }
      applied_store_credit {
        applied_balance {
          currency
          value
        }
        current_balance {
          currency
          value
        }
      }
      applied_gift_cards(guestCartId: $cart_id) {
        code
        applied_balance {
          currency
          value
        }
        current_balance {
          currency
          value
        }
        expiration_date
      }
    }
  }
`;

export const SAVE_TO_WISHLIST = gql`
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
export const GET_CUSTOMER_PROFILE = gql`
  query {
    customer {
      created_at
      group_id
      prefix
      firstname
      middlename
      lastname
      suffix
      email
      mobilenumber
      default_billing
      default_shipping
      dob
      taxvat
      is_social_login
      social_login_type
      id
      is_subscribed
      ahlan_id
      addresses {
        id
        customer_id
        country_id
        street
        company
        telephone
        fax
        postcode
        city
        firstname
        lastname
        middlename
        prefix
        suffix
        vat_id
        default_shipping
        default_billing
        latitude
        longitude
        danube_address_type
        flat_number
        map_fields
        region {
          region_code
          region
          region_id
        }
      }
    }
  }
`;

export const VIEW_CART_CUSTOMER = gql`
  query {
    cartData: getCartForCustomer {
      subtotal
      items_qty
      tax_amount
      grand_total
      discount_amount
      base_currency_code: quote_currency_code
      subtotal_with_discount
      coupon_code
      cod_charge
      shipping_amount
      is_virtual
      alhan_points
      ahlan
      applied_rule_ids
      minimum_order_amount
      minimum_order_description
      order_can_be_placed
      applied_coupon_description
      items {
        qty
        sku
        name
        price
        item_id
        row_total
        tax_amount
        tax_percent
        discount_amount
        discount_percent
        you_save
        free_product
        product {
          id
          sku
          name
          qty
          stock_status
          url_key
          canonical_url
          type_id
          product_variant {
            label
            url
            value
          }
          categories {
            name
          }
          thumbnail {
            url
            path
            label
          }
          product_links {
            position
            link_type
            linked_product_sku
          }
          crosssell_products {
            sku
            name
          }
        }
        additional_options {
          label
          values
        }
        bundle_options {
          label
          type
          uid
          values {
            id
            label
            price
            quantity
            uid
          }
        }
        gift_card_cart_item_data {
          sender_name
          sender_email
          recipient_name
          recipient_email
          message
        }
      }
      applied_store_credit {
        applied_balance {
          currency
          value
        }
        current_balance {
          currency
          value
        }
      }
      applied_gift_cards {
        code
        applied_balance {
          currency
          value
        }
        current_balance {
          currency
          value
        }
        expiration_date
      }
    }
  }
`;

export const GET_CART_PAYMNENT_METHOD_WITHOUT_PARAM = gql`
  {
    getPaymentMethods {
      pre_selected_payment
      code
      title
      __typename
      instructions
    }
  }
`;

export const GET_CART_PAYMNENT_METHOD_WITH_PARAM = gql`
  query ($guestCartId: String!) {
    getPaymentMethods(guestCartId: $guestCartId) {
      code
      title
      instructions
      pre_selected_payment
      errors
    }
  }
`;

export const ESTIMATED_SHIPPING_COST = gql`
  mutation ($_address_0: EstimateShippingCostsAddress!) {
    estimateShippingCosts(address: $_address_0) {
      amount
      available
      base_amount
      method_code
      carrier_code
      method_title
      carrier_title
      error_message
      price_excl_tax
      price_incl_tax
    }
  }
`;

export const GUEST_ESTIMATED_SHIPPING_COST = gql`
  mutation (
    $_address_0: EstimateShippingCostsAddress!
    $_guestCartId_0: String!
  ) {
    estimateShippingCosts(address: $_address_0, guestCartId: $_guestCartId_0) {
      amount
      available
      base_amount
      method_code
      carrier_code
      method_title
      carrier_title
      error_message
      price_excl_tax
      price_incl_tax
    }
  }
`;

export const CUSTOMER_WALLET = gql`
  {
    customer {
      store_credit {
        balance_history(pageSize: 20, currentPage: 1) {
          items {
            action
            actual_balance {
              currency
              value
            }
            balance_change {
              currency
              value
            }
            date_time_changed
            details
            status
          }
          page_info {
            current_page
            page_size
            total_pages
          }
          total_count
        }
        current_balance {
          currency
          value
        }
        enabled
      }
    }
  }
`;

export const SET_PAYMENT_METHOD = gql`
  mutation ($paymentMethod_input: S_SetPaymentMethodOnCartInput!) {
    paymentMethod: s_setPaymentMethodOnCart(input: $paymentMethod_input) {
      cart {
        selected_payment_method {
          code
          title
          purchase_order_number
        }
      }
    }
  }
`;

export const WISHLIST = gql`
  query {
    wishlist {
      items_count
      updated_at
      items {
        id
        sku
        qty
        description
        product {
          id
          sku
          name
          type_id
          stock_status
          special_price
          reviewImages
          hello_ar_product_code
          delivery_days
          is_returnable
          allow_click_and_collect
          sale_badge
          market_badge
          feature_badge
          product_variant {
            label
            url
            value
          }
          card_slideshow {
            label
            path
            url
          }
          product_details {
            label
            value
            url
          }
          only_x_left_in_stock
          pricing {
            discount
            salable_quantity
            you_save
            alhan_points
          }
          related_products {
            sku
            name
          }
          upsell_products {
            sku
            name
          }
          tier_prices {
            value
            customer_group_id
          }
          price {
            minimalPrice {
              amount {
                value
                currency
              }
            }
            regularPrice {
              amount {
                value
                currency
              }
            }
          }
          breadcrumbs {
            category_name
            category_url_key
          }
          thumbnail {
            url
            path
            label
          }
          categories {
            name
            url_path
            url_key
            id
            breadcrumbs {
              category_name
              category_url_key
            }
          }
          short_description {
            html
          }
          attributes {
            attribute_id
            attribute_value
            attribute_code
            attribute_type
            is_swatch
            attribute_label
            attribute_options {
              label
              value
              swatch_data {
                type
                value
              }
            }
          }
          custom_options {
            option_id
            type
            title
            is_required
            ... on CustomOptionTypeSelect {
              values {
                title
                value_id
                price_type
                sku
                price {
                  currency
                  value
                }
              }
            }
            ... on CustomOptionTypeText {
              price_type
              max_characters
              sku
              price {
                currency
                value
              }
            }
          }
          buy_together {
            id
            sku
            name
            type_id
            stock_status
            special_price
            reviewImages
            hello_ar_product_code
            delivery_days
            is_returnable
            allow_click_and_collect
            product_variant {
              label
              url
              value
            }
            card_slideshow {
              label
              path
              url
            }
            product_details {
              label
              value
              url
            }
            only_x_left_in_stock
            pricing {
              discount
              salable_quantity
              you_save
              alhan_points
            }
            related_products {
              sku
              name
            }
            upsell_products {
              sku
              name
            }
            tier_prices {
              value
              customer_group_id
            }
            price {
              minimalPrice {
                amount {
                  value
                  currency
                }
              }
              regularPrice {
                amount {
                  value
                  currency
                }
              }
            }
            breadcrumbs {
              category_name
              category_url_key
            }
            thumbnail {
              url
              path
              label
            }
            categories {
              name
              url_path
              url_key
              id
              breadcrumbs {
                category_name
                category_url_key
              }
            }
            short_description {
              html
            }
            custom_options {
              option_id
              type
              title
              is_required
              ... on CustomOptionTypeSelect {
                values {
                  title
                  value_id
                  price_type
                  sku
                  price {
                    currency
                    value
                  }
                }
              }
              ... on CustomOptionTypeText {
                price_type
                max_characters
                sku
                price {
                  currency
                  value
                }
              }
            }
          }
          url_key
          review_summary {
            each_rating_percentage {
              fiveStar
              fourStar
              oneStar
              threeStar
              twoStar
            }
            rating_summary
            review_count
          }
          ... on ConfigurableProduct {
            configurable_options {
              attribute_code
              values {
                value_index
              }
            }
            variants {
              product {
                id
                sku
                name
                type_id
                stock_status
                special_price
                reviewImages
                hello_ar_product_code
                delivery_days
                is_returnable
                allow_click_and_collect
                sale_badge
                market_badge
                feature_badge
                product_variant {
                  label
                  url
                  value
                }
                card_slideshow {
                  label
                  path
                  url
                }
                product_details {
                  label
                  value
                  url
                }
                only_x_left_in_stock
                pricing {
                  discount
                  salable_quantity
                  you_save
                  alhan_points
                }
                related_products {
                  sku
                  name
                }
                upsell_products {
                  sku
                  name
                }
                tier_prices {
                  value
                  customer_group_id
                }
                price {
                  minimalPrice {
                    amount {
                      value
                      currency
                    }
                  }
                  regularPrice {
                    amount {
                      value
                      currency
                    }
                  }
                }
                breadcrumbs {
                  category_name
                  category_url_key
                }
                thumbnail {
                  url
                  path
                  label
                }
                categories {
                  name
                  url_path
                  url_key
                  id
                  breadcrumbs {
                    category_name
                    category_url_key
                  }
                }
                short_description {
                  html
                }
                attributes {
                  attribute_id
                  attribute_value
                  attribute_code
                  attribute_type
                  is_swatch
                  attribute_label
                }
                custom_options {
                  option_id
                  type
                  title
                  is_required
                  ... on CustomOptionTypeSelect {
                    values {
                      title
                      value_id
                      price_type
                      sku
                      price {
                        currency
                        value
                      }
                    }
                  }
                  ... on CustomOptionTypeText {
                    price_type
                    max_characters
                    sku
                    price {
                      currency
                      value
                    }
                  }
                }
                buy_together {
                  id
                  sku
                  name
                  type_id
                  stock_status
                  special_price
                  reviewImages
                  hello_ar_product_code
                  delivery_days
                  is_returnable
                  allow_click_and_collect
                  product_variant {
                    label
                    url
                    value
                  }
                  card_slideshow {
                    label
                    path
                    url
                  }
                  product_details {
                    label
                    value
                    url
                  }
                  only_x_left_in_stock
                  pricing {
                    discount
                    salable_quantity
                    you_save
                    alhan_points
                  }
                  related_products {
                    sku
                    name
                  }
                  upsell_products {
                    sku
                    name
                  }
                  tier_prices {
                    value
                    customer_group_id
                  }
                  price {
                    minimalPrice {
                      amount {
                        value
                        currency
                      }
                    }
                    regularPrice {
                      amount {
                        value
                        currency
                      }
                    }
                  }
                  breadcrumbs {
                    category_name
                    category_url_key
                  }
                  thumbnail {
                    url
                    path
                    label
                  }
                  categories {
                    name
                    url_path
                    url_key
                    id
                    breadcrumbs {
                      category_name
                      category_url_key
                    }
                  }
                  short_description {
                    html
                  }
                  custom_options {
                    option_id
                    type
                    title
                    is_required
                    ... on CustomOptionTypeSelect {
                      values {
                        title
                        value_id
                        price_type
                        sku
                        price {
                          currency
                          value
                        }
                      }
                    }
                    ... on CustomOptionTypeText {
                      price_type
                      max_characters
                      sku
                      price {
                        currency
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const VERIFY_PAYMENT_CAPTURED = gql`
  query verifyPaymentCaptured(
    $paymentMethod: PaymentMethods!
    $paymentId: String
  ) {
    verifyPaymentCaptured(paymentMethod: $paymentMethod, paymentId: $paymentId)
  }
`;
