import { gql } from '@apollo/client';
export const GET_ORDER_CONFIRMATION_DETAILS = gql`
  query getOrderStatusByToken($token: String!) {
    getOrderStatusByToken(token: $token) {
      status
      is_success
      order {
        base_order_info {
          coupon_code
          customer_email
          discount_amount
          grand_total
          increment_id
          order_currency_code
          sub_total
          tax_amount
          total_qty_ordered
          customer_email
          shipping_charge
          billing_address {
            apartment_number
            city
            company
            country_id
            customer_id
            district
            firstname
            flat_number
            house_number
            id
            is_b2b
            lastname
            latitude
            longitude
            map_fields
            middlename
            organizationaddress
            organizationbik
            organizationbin
            organizationiic
            organizationname
            post_office_code
            postcode
            postomat_code
            prefix
            region
            store_pickup_code
            street
            telephone
          }
        }
        payment_info {
          method
          additional_information {
            bank
            method_title
            # credit_type
            month
            customer_info {
              first_name
              last_name
              middle_name
            }
          }
        }
        shipping_info {
          shipping_method
          shipping_description
          shipping_amount
          tracking_numbers
          store_working_hours {
            to
            from
            day
          }
          shipping_address {
            city
            company
            country_id
            firstname
            lastname
            middlename
            telephone
            apartment_number
            postcode
            street
            region
            map_fields
            flat_number
          }
        }
        order_items {
          product_id
          sku
          name
          qty_ordered
          row_total
          additional_options {
            label
            value
          }
          url_path
          is_product_exists
          thumbnail
          price
          delivery_date
          delivery_status
          product {
            qty
            stock_status
            url_key
            is_returnable
            delivery_method
            product_variant {
              label
              url
              value
            }
            thumbnail {
              url
              path
              label
            }
          }
          gift_card_order_item_data {
            message
            sender_name
            sender_email
            recipient_name
            recipient_email
          }
        }
        order_products {
          id
          sku
          categories {
            name
          }
        }
      }
    }
  }
`;
