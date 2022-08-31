import {
  DEFAULT_BRAND,
  EVENT_NAME_ADD_REMOVE_FROM_WISHLIST,
  EVENT_NAME_ADD_SHIPPING_INFO,
  EVENT_NAME_ADD_TO_CART,
  EVENT_NAME_ADD_TO_CART_ERROR,
  EVENT_NAME_ADD_TO_WISHLIST,
  EVENT_NAME_PREMOVE_FROM_CART,
  EVENT_NAME_VIEW_CART,
} from '../constants';
import { Analytics_Events, logError } from './Global';

const getCartFormattedDataFromCrossplay = ({
  productData = {},
  rowData = {},

  productIndex,
  rowIndex,
  plpMetaData = {},
  quantity = 1,
}) => {
  const { categoryLevel1, categoryLevel2, categoryLevel3, name, brand } =
    productData?.fields;
  return {
    item_brand: brand || DEFAULT_BRAND,
    item_category: categoryLevel1,
    item_category2: categoryLevel2,
    item_category3: categoryLevel3,
    item_id: productData?.id,
    // index: rowIndex * productIndex,
    item_list_id: (plpMetaData?.categoryId || rowData?.rowName).replace(
      /\//g,
      '_'
    ),
    item_list_name: (plpMetaData?.en_title || rowData?.rowName).replace(
      /\//g,
      '_'
    ),
    item_name: name,
    quantity,
    // item_location_id: `slot${rowIndex}_${productIndex}`,
    price: parseFloat(productData?.selectedPrice?.specialPrice),
  };
};

const getCartFormattedDataFromCatalog = ({ productData = {} }) => {
  const { categoryLevel1, categoryLevel2, categoryLevel3, name } =
    productData || {};

  const otherFields = {};
  productData?.otherFields?.map((other) => {
    otherFields[other.field_id] = other.value;
  });

  return {
    item_brand: otherFields.brand || DEFAULT_BRAND,
    item_category: categoryLevel1 || '',
    item_category2: categoryLevel2 || '',
    item_category3: categoryLevel3 || '',
    item_id: productData?._id,

    item_name: name,
    //  item_location_id: `slot${rowIndex}_${index}`,
    price: parseFloat(productData?.selectedPrice?.specialPrice ?? 0.0),
  };
};
export const addToCartLogEvent = ({
  dataDefinition = 'crossplay',
  productData,
  rowData = {},
  productIndex = 0,
  rowIndex = 0,
  plpMetaData = {},
  quantity,
}) => {
  try {
    let customData = {};

    let itemData = {};
    if (dataDefinition === 'crossplay') {
      itemData = getCartFormattedDataFromCrossplay({
        productData,
        rowData,
        productIndex,
        rowIndex,
        plpMetaData,
        quantity,
      });
    }

    customData = {
      currency: productData?.selectedPrice.currency,
      items: [itemData],
      value: parseFloat(productData?.selectedPrice?.specialPrice),
    };

    Analytics_Events({
      eventName: EVENT_NAME_ADD_TO_CART,
      params: customData,
    });
  } catch (e) {
    logError(e);
  }
};

export const addToCartLogErrorEvent = (
  dataDefinition = 'crossplay',
  productData,
  error
) => {
  try {
    Analytics_Events({
      eventName: EVENT_NAME_ADD_TO_CART_ERROR,
      params: customData,
    });
  } catch (e) {
    logError(e);
  }
};
export const cartViewLogEvent = ({ cartItems, currency }) => {
  try {
    let customData = {};
    let productItemArr = [];

    cartItems?.cartData?.items?.map((el) => {
      let categoriesLevel2 = '';
      let categoriesLevel3 = '';
      let categoriesLevel4 = '';

      el?.product?.categories?.map((dataObj, index) => {
        if (index === 0) {
          categoriesLevel2 = dataObj?.name;
        } else if (index === 1) {
          categoriesLevel3 = dataObj?.name;
        } else if (index === 2) {
          categoriesLevel4 = dataObj?.name;
        }
      });

      productItemArr.push({
        item_brand: DEFAULT_BRAND, // TODO IDENTIFY BRAND
        item_category: categoriesLevel2,
        item_category2: categoriesLevel3,
        item_category3: categoriesLevel4,
        item_id: el?.product?.sku,
        item_list_id: '', //rowData?.rowName
        item_list_name: '', //rowData?.rowName
        item_name: el?.product?.name,
        // item_location_id: `slot${0}_${0}`, //row_index  , productIndex
        price: parseFloat(el?.price),
      });
    });

    customData = {
      currency: cartItems?.cartData?.base_currency_code,
      items: productItemArr,
      value: cartItems?.cartData?.grand_total,
    };
    Analytics_Events({
      eventName: EVENT_NAME_VIEW_CART,
      params: customData,
    });
  } catch (e) {
    logError(e);
  }
};

export const addShippingInfoEvent = ({ cartItems }) => {
  try {
    let customData = {};
    let productItemArr = [];

    cartItems?.cartData?.items?.map((el) => {
      let categoriesLevel2 = '';
      let categoriesLevel3 = '';
      let categoriesLevel4 = '';

      el?.product?.categories?.map((dataObj, index) => {
        if (index === 0) {
          categoriesLevel2 = dataObj?.name;
        } else if (index === 1) {
          categoriesLevel3 = dataObj?.name;
        } else if (index === 2) {
          categoriesLevel4 = dataObj?.name;
        }
      });

      productItemArr.push({
        item_brand: DEFAULT_BRAND, // TODO IDENTIFY BRAND
        item_category: categoriesLevel2,
        item_category2: categoriesLevel3,
        item_category3: categoriesLevel4,
        item_id: el?.product?.sku,
        item_list_id: '', //rowData?.rowName
        item_list_name: '', //rowData?.rowName
        item_name: el?.product?.name,
        // item_location_id: `slot${0}_${0}`, //row_index  , productIndex
        price: parseFloat(el?.price),
      });
    });

    customData = {
      currency: cartItems?.cartData?.base_currency_code,
      items: productItemArr,
      value: cartItems?.cartData?.grand_total,
      coupon: '',
      shipping_tier: 'home_delivery',
    };
    Analytics_Events({
      eventName: EVENT_NAME_ADD_SHIPPING_INFO,
      params: customData,
    });
  } catch (e) {
    logError(e);
  }
};

export const logRemoveFromCart = ({ items, currency }) => {
  try {
    let customData = {};
    let productItemArr = [];

    items?.map((el) => {
      let categoriesLevel2 = '';
      let categoriesLevel3 = '';
      let categoriesLevel4 = '';

      el?.product?.categories?.map((dataObj, index) => {
        if (index === 0) {
          categoriesLevel2 = dataObj?.name;
        } else if (index === 1) {
          categoriesLevel3 = dataObj?.name;
        } else if (index === 2) {
          categoriesLevel4 = dataObj?.name;
        }
      });

      productItemArr.push({
        item_brand: DEFAULT_BRAND, // TODO IDENTIFY BRAND
        item_category: categoriesLevel2,
        item_category2: categoriesLevel3,
        item_category3: categoriesLevel4,
        item_id: el?.product?.sku,
        item_list_id: '', //rowData?.rowName
        item_list_name: '', //rowData?.rowName
        item_name: el?.product?.name,
        // item_location_id: `slot${0}_${0}`, //row_index  , productIndex
        price: parseFloat(el?.price),
      });
    });

    customData = {
      // currency: cartItems?.cartData?.base_currency_code,
      items: productItemArr,
      // value: cartItems?.cartData?.grand_total,
    };
    Analytics_Events({
      eventName: EVENT_NAME_PREMOVE_FROM_CART,
      params: customData,
    });
  } catch (e) {
    logError(e);
  }
};

export const logAddToWishlist = ({
  dataDefinition = 'crossplay',
  productData,
  rowData = {},
  productIndex = 0,
  rowIndex = 0,
  plpMetaData = {},
  quantity,
}) => {
  try {
    let customData = {};

    let itemData = {};
    if (dataDefinition === 'crossplay') {
      itemData = getCartFormattedDataFromCrossplay({
        productData,
        rowData,
        productIndex,
        rowIndex,
        plpMetaData,
      });
    } else if (dataDefinition === 'catalog') {
      itemData = getCartFormattedDataFromCatalog({
        productData,
        rowData,
        productIndex,
        rowIndex,
        plpMetaData,
      });
    }
    delete itemData.quantity;
    customData = {
      currency: productData?.selectedPrice?.currency,
      items: [itemData],
      value: parseFloat(productData?.selectedPrice?.specialPrice),
    };

    Analytics_Events({
      eventName: EVENT_NAME_ADD_TO_WISHLIST,
      params: customData,
    });
  } catch (e) {
    logError(e);
  }
};

export const logRemoveFromWishlist = ({
  dataDefinition = 'crossplay',
  productData,
  rowData = {},
  productIndex = 0,
  rowIndex = 0,
  plpMetaData = {},
  quantity,
}) => {
  try {
    let customData = {};

    let itemData = {};
    if (dataDefinition === 'crossplay') {
      itemData = getCartFormattedDataFromCrossplay({
        productData,
        rowData,
        productIndex,
        rowIndex,
        plpMetaData,
      });
    } else if (dataDefinition === 'catalog') {
      itemData = getCartFormattedDataFromCatalog({
        productData,
        rowData,
        productIndex,
        rowIndex,
        plpMetaData,
      });
    }
    delete itemData.quantity;
    customData = {
      currency: productData?.selectedPrice?.currency,
      items: [itemData],
      value: parseFloat(productData?.selectedPrice?.specialPrice),
    };

    Analytics_Events({
      eventName: EVENT_NAME_ADD_REMOVE_FROM_WISHLIST,
      params: customData,
    });
  } catch (e) {
    logError(e);
  }
};
