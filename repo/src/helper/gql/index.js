import { useQuery, gql } from '@apollo/client';

export const GENERATE_MOBILE_LOGIN_OTP = gql`
  mutation generateLoginOTP($phonenumber: String!) {
    generateLoginOTP(phonenumber: $phonenumber) {
      message
      status
    }
  }
`;

export const VERIFY_MOBILE_LOGIN_OTP = gql`
  mutation verifyLoginOTP($phonenumber: String!, $otp: String!) {
    verifyLoginOTP(phonenumber: $phonenumber, otp: $otp) {
      message
      status
      token
    }
  }
`;

export const GENERATE_REG_OTP = gql`
  mutation generateRegOTP($phonenumber: String!) {
    generateRegOTP(phonenumber: $phonenumber) {
      message
      status
    }
  }
`;

export const VERIFY_REG_OTP = gql`
  mutation verifyRegOTP($phonenumber: String!, $otp: String!) {
    verifyRegOTP(phonenumber: $phonenumber, otp: $otp) {
      message
      status
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation createCustomer($input: CustomerInput!) {
    createCustomer(input: $input) {
      __typename
      customer {
        email
        mobilenumber
        firstname
      }
    }
  }
`;

export const EMAIL_AND_PASSWORD_LOGIN = gql`
  mutation generateCustomerToken($email: String!, $password: String!) {
    generateCustomerToken(email: $email, password: $password) {
      token
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(email: $email) {
      status
    }
  }
`;

export const REQUEST_CALL_BACK = gql`
  mutation (
    $_name_0: String!
    $_mobile_number_0: String!
    $_request_type_0: String!
  ) {
    requestCallBack(
      name: $_name_0
      mobile_number: $_mobile_number_0
      request_type: $_request_type_0
    ) {
      status
      message
    }
  }
`;

// New
export const CREATE_EMPTY_CART = gql`
  mutation {
    createEmptyCart
  }
`;

export const ADD_TO_CART = gql`
  mutation saveCartItem($cartItem: CartItemInput!, $guestCartId: String!) {
    saveCartItem(cartItem: $cartItem, guestCartId: $guestCartId) {
      cartData: getCartForCustomer(guestCartId: $guestCartId) {
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
        applied_gift_cards(guestCartId: $guestCartId) {
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
  }
`;

export const ADD_TO_CART_CUSTOMER = gql`
  mutation ($cartItem: CartItemInput!) {
    saveCartItem(cartItem: $cartItem) {
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
  }
`;

export const REMOVE_CART_ITEM = gql`
  mutation ($guestCartId: String!, $item_id: Int!) {
    removeCartItem(item_id: $item_id, guestCartId: $guestCartId) {
      cartData: getCartForCustomer(guestCartId: $guestCartId) {
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
        applied_gift_cards(guestCartId: $guestCartId) {
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
  }
`;

export const REMOVE_CART_ITEM_CUSTOMER = gql`
  mutation ($item_id: Int!) {
    removeCartItem(item_id: $item_id) {
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
  }
`;
export const CHECKOUT_AS_GUEST = gql`
  mutation ($guestData: SetGuestEmailOnCartInput) {
    setGuestEmailOnCart(input: $guestData) {
      cart {
        email
      }
    }
  }
`;

export const MERGE_CART = gql`
  mutation ($guestCartId: String!) {
    mergeQuote(guestCartId: $guestCartId) {
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

export const APPLY_COUPON = gql`
  mutation ($coupon_code: String!, $guestCartId: String) {
    applyCoupon(coupon_code: $coupon_code, guestCartId: $guestCartId) {
      cartData: getCartForCustomer(guestCartId: $guestCartId) {
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
  }
`;

export const REMOVE_COUPON = gql`
  mutation ($guestCartId: String) {
    removeCoupon(guestCartId: $guestCartId) {
      cartData: getCartForCustomer(guestCartId: $guestCartId) {
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
  }
`;

export const CREATE_CUSTOMER_NEW_ADDRESS = gql`
  mutation ($customer_address_data: CustomerAddressInput!) {
    createCustomerAddress(input: $customer_address_data) {
      firstname
      city
    }
  }
`;

export const UPDATE_CUSTOMER_ADDRESS = gql`
  mutation ($_id_0: Int!, $_input_0: CustomerAddressInput!) {
    updateCustomerAddress(id: $_id_0, input: $_input_0) {
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
`;

export const SAVE_ADDRESS_INFO_TO_CART = gql`
  mutation (
    $addressInformation: SaveAddressInformation!
    $guestCartId: String
  ) {
    saveAddressInformation(
      addressInformation: $addressInformation
      guestCartId: $guestCartId
    ) {
      payment_methods {
        code
        title
        instructions
        pre_selected_payment
        errors
      }
      totals {
        subtotal
        tax_amount
        grand_total
        discount_amount
        shipping_amount
        subtotal_incl_tax
        shipping_incl_tax
        base_currency_code
        shipping_tax_amount
        subtotal_with_discount
        shipping_discount_amount
        items {
          qty
          name
          price
          item_id
          options
          tax_amount
          tax_percent
          price_incl_tax
          discount_amount
          discount_percent
        }
      }
    }
  }
`;

// TO BE DEPRECATED
export const PLACE_ORDER = gql`
  mutation (
    $_paymentInformation_0: PaymentInformation!
    $_order_comments_0: String!
    $_pickup_location_id_0: String
  ) {
    savePaymentInformationAndPlaceOrder(
      paymentInformation: $_paymentInformation_0
      order_comments: $_order_comments_0
      pickup_location_id: $_pickup_location_id_0
    ) {
      order_token
      increment_id
      orderID
    }
  }
`;

export const PLACE_ORDER_ACTUAL = gql`
  mutation placeOrder(
    $paymentInformation: PaymentInformation!
    $orderComments: String!
    $guestCartId: String
    $pickupLocationId: String
  ) {
    savePaymentInformationAndPlaceOrder(
      paymentInformation: $paymentInformation
      guestCartId: $guestCartId
      order_comments: $orderComments
      pickup_location_id: $pickupLocationId
    ) {
      increment_id
      order_token
    }
  }
`;

export const RESTORE_CART = gql`
  mutation ($orderId: String!) {
    restoreQuote(orderId: $orderId)
  }
`;

export const SET_DEFAULT_ADDRESS = gql`
  mutation ($_id_0: Int!, $_input_0: CustomerAddressInput!) {
    updateCustomerAddress(id: $_id_0, input: $_input_0) {
      id
    }
  }
`;

export const APPLY_STORE_CREDIT = gql`
  mutation {
    applyStoreCredit {
      cart {
        applied_store_credit {
          applied_balance {
            value
            currency
          }
          current_balance {
            value
            currency
          }
          enabled
        }
      }
    }
  }
`;

export const REMOVE_STORE_CREDIT = gql`
  mutation {
    removeStoreCredit {
      cart {
        applied_store_credit {
          enabled
          applied_balance {
            value
            currency
          }
        }
      }
    }
  }
`;
