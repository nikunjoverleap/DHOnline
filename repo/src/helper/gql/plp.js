import { gql } from '@apollo/client';
export const GET_PLP_LIST = gql`
  query GET_PLP_LIST(
    $categoryId: String
    $store: Store!
    $showFacets: Boolean
    $pageSize: Int
    $pageOffset: Int
    $filters: [JSON]
    $sort: Sort
    $query: String
    $numColumns: Int
    $productId: String
    $type: String
    $recommendationId: String
    $userId: String
  ) {
    list(
      categoryId: $categoryId
      store: $store
      showFacets: $showFacets
      pageSize: $pageSize
      pageOffset: $pageOffset
      filters: $filters
      query: $query
      sort: $sort
      numColumns: $numColumns
      productId: $productId
      type: $type
      recommendationId: $recommendationId
      userId: $userId
    ) {
      totalPages
      totalProducts
      meta
      facets {
        facet
        facetLabel
        type
        slider {
          min
          max
          selectedMin
          selectedMax
        }
        ranges {
          lte
          gte
          title
          selected
        }
        values {
          title
          count
          selected
        }
      }
      blocks {
        rowType
        rowId
        hasMoreOptions
        bannerLink
        columns {
          type
          product {
            id
            sku
            type_id
            images {
              value
            }
            defaultPrice {
              currency
              specialPrice
            }
            selectedPrice {
              currency
              specialPrice
            }
            fields {
              name
              color
              categories
              sale_badge
              market_badge
              feature_badge
              discount_badge
              categoryLevel1
              categoryLevel2
              categoryLevel3
              brand
            }
            relatedProducts {
              _id
              image
            }
            relatedProductVariantType
            relatedProductCount
          }
        }
      }
    }
  }
`;

export const GET_AUTSUGGEST = gql`
  query GET_AUTSUGGEST($query: String, $country: String!, $language: String!) {
    autosuggest(query: $query, country: $country, language: $language) {
      text
      category
      level
    }
  }
`;
