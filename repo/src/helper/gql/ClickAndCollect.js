import { gql } from '@apollo/client';
export const GET_STORE_INFORMATION = gql`
  query getStoreInformation($checkout_page: Boolean!, $guestCartId: String!) {
    getStoreInformation(
      checkout_page: $checkout_page
      guestCartId: $guestCartId
    ) {
      address
      city
      code
      country_id
      description
      email
      entity_id
      facebook
      image_path
      instagram
      latitude
      longitude
      meta_description
      meta_title
      name
      phone_number
      postcode
      region
      skype
      store_timings
      whatsapp
      working_hours {
        day
        from
        to
      }
    }
  }
`;

// {
//     getStoreInformation(checkout_page: true, guestCartId: "p1DDl5ZKp9h07Qg5AF1omuWW7b3AA1VS") {
//       address
//       city
//       code
//       country_id
//       description
//       email
//       entity_id
//       facebook
//       image_path
//       instagram
//       latitude
//       longitude
//       meta_description
//       meta_title
//       name
//       phone_number
//       postcode
//       region
//       skype
//       store_timings
//       whatsapp
//       working_hours {
//         day
//         from
//         to
//       }
//     }
//   }
