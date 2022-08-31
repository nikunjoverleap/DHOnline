import { DEFAULT_BRAND, EVENT_NAME_VIEW_PRODUCT_ITEM } from '../constants';
import { Analytics_Events, logError } from './Global';

export const productImpressionEvents = ({
  items,
  impressed = [],
  rowData,
  plpMetaData = {},
}) => {
  try {
    // setProductIdArr((ids) => {
    let customeArr = [];
    let customData = {
      item_list_id: plpMetaData?.categoryId || rowData?.rowName,
      item_list_name: plpMetaData?.en_title || rowData?.rowName,
      items: [],
    };
    const added = [];
    items?.map((el, index) => {
      const { product } = el;
      const { categoryLevel1, categoryLevel2, categoryLevel3, name, brand } =
        product?.fields || {};

      if (!impressed.includes(product?.id)) {
        customData.items.push({
          item_brand: brand || DEFAULT_BRAND,
          item_category: categoryLevel1 || '',
          item_category2: categoryLevel2 || '',
          item_category3: categoryLevel3 || '',
          item_id: product?.id,
          item_list_id: plpMetaData?.categoryId || rowData?.rowName,
          item_list_name: plpMetaData?.en_title || rowData?.rowName,
          item_name: name,
          //  item_location_id: `slot${rowIndex}_${index}`,
          price: parseFloat(product?.selectedPrice?.specialPrice ?? 0.0),
        });
        added.push(product?.id);
      }
    });
    if (customData.items.length) {
      Analytics_Events({
        eventName: 'Product_Impressions',
        params: customData,
        EventToken: 'k3ah8d',
      });
    }
    return added;
  } catch (e) {
    logError(e);
    return [];
  }
};

export const logProductViewItem = ({ items }) => {
  try {
    let customData = {
      items: [],
    };
    const added = [];
    items?.map((product, index) => {
      const { categoryLevel1, categoryLevel2, categoryLevel3, name, brand } =
        product || {};

      let sumOfSelectedPrice = product?.selectedPrice;
      if (product?.groupedProducts?.length) {
        const tot = product?.groupedProducts.reduce(
          (total, currentValue) =>
            (total =
              total +
              currentValue?.selectedPrice?.specialPrice * currentValue?.qty),
          0
        );
        sumOfSelectedPrice = {
          currency: product?.groupedProducts?.[0]?.selectedPrice?.currency,
          specialPrice: tot,
        };
      }

      const otherFields = {};
      product?.otherFields?.map((other) => {
        otherFields[other.field_id] = other.value;
      });
      customData.currency = sumOfSelectedPrice?.currency;
      customData.value = parseFloat(sumOfSelectedPrice?.specialPrice ?? 0.0);
      customData.items.push({
        item_brand: otherFields.brand || DEFAULT_BRAND,
        item_category: categoryLevel1 || '',
        item_category2: categoryLevel2 || '',
        item_category3: categoryLevel3 || '',
        item_id: product?._id,

        item_name: name,
        //  item_location_id: `slot${rowIndex}_${index}`,
        price: parseFloat(sumOfSelectedPrice?.specialPrice ?? 0.0),
      });
      added.push(product?.id);
    });
    if (customData.items.length) {
      Analytics_Events({
        eventName: EVENT_NAME_VIEW_PRODUCT_ITEM,
        params: customData,
      });
    }
    return added;
  } catch (e) {
    logError(e);
    return [];
  }
};

export const logProductClicks = ({
  items,
  impressed = [],
  rowData,
  plpMetaData = {},
}) => {
  try {
    // setProductIdArr((ids) => {
    let customeArr = [];
    let customData = {
      item_list_id: plpMetaData?.categoryId || rowData?.rowName,
      item_list_name: plpMetaData?.en_title || rowData?.rowName,
      items: [],
    };
    const added = [];
    items?.map((el, index) => {
      const product = el;
      const { categoryLevel1, categoryLevel2, categoryLevel3, name, brand } =
        product?.fields || {};

      customData.items.push({
        item_brand: brand || DEFAULT_BRAND,
        item_category: categoryLevel1 || '',
        item_category2: categoryLevel2 || '',
        item_category3: categoryLevel3 || '',
        item_id: product?.id,
        item_list_id: plpMetaData?.categoryId || rowData?.rowName,
        item_list_name: plpMetaData?.en_title || rowData?.rowName,
        item_name: name,
        //  item_location_id: `slot${rowIndex}_${index}`,
        price: parseFloat(product?.selectedPrice?.specialPrice ?? 0.0),
      });
      added.push(product?.id);
    });
    if (customData.items.length) {
      Analytics_Events({
        eventName: 'Product_Clicks',
        params: customData,
        EventToken: 'k3ah8d',
      });
    }
    return added;
  } catch (e) {
    logError(e);
    return [];
  }
};
