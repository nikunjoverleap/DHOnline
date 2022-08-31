import { gql } from '@apollo/client';

export const GET_PRODUCT_DETAIL_FOR_MOBILE = gql`
  query (
    $urlKey: String
    $id: String
    $language: String
    $country: String
    $fields: [String]
  ) {
    getProductDetailForMobile(
      urlKey: $urlKey
      id: $id
      language: $language
      country: $country
      fields: $fields
    ) {
      _id
      name
      # sku
      # hello_ar_product_code
      inventoryStock {
        qty
        country
        inStock
      }
      otherFields {
        key
        field_id
        value
      }
      selectedPrice {
        specialPrice
        currency
      }
      defaultPrice {
        specialPrice
        currency
      }
      media_gallery {
        media_type
        position
        value
      }
      fieldset {
        pdpGroups {
          name
          expand_by_default
          fields {
            code
            name
            value
            display_as_paragraph
            display_as_image
            display_as_link
          }
        }
      }
      groupedProducts {
        _id
        name
        selectedPrice {
          specialPrice
          currency
        }
        defaultPrice {
          specialPrice
          currency
        }
        media_gallery {
          media_type
          position
          value
        }
        qty
        seaterLabel
      }
      relatedProducts {
        related_base_id
        related_base_label
        _id
        base_value {
          key
          value
        }
        defaultPrice {
          specialPrice
          currency
        }
        selectedPrice {
          specialPrice
          currency
        }
        media_gallery {
          media_type
          position
          value
        }
      }
    }
  }
`;
