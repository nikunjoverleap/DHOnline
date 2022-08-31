import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import {
  EVENT_NAME_SCREEN_VIEW,
  EVENT_NAME_SCREEN_VIEW_COMPLETE,
  GENERIC_ERROR_MESSAGE,
  SCREEN_NAME_PDP,
} from '../../constants';
import { Analytics_Events, logError, showToast } from '../../helper/Global';
import { logProductViewItem } from '../../helper/products';
import { setUserCartItems } from '../../slicers/checkout/checkoutSlice';
import {
  resetQuestQuoteInCaseThereAErrorInTheCart,
  saveCartItem,
  saveCartItemCustomer,
} from '../MyCart/actions';
import { getProductDetailForMobile } from './actions';
import A1Component from './components/A1Component';
import ARModel from './components/ARModel';
import { BulkOrder } from './components/BulkOrder';
import BuyNowPayLater from './components/BuyNowPayLater';
import { CheckOutBar } from './components/CheckOutBar';
import { ClickAndCollectStrip } from './components/ClickAndCollectStrip';
import { GlobalOffersBanner } from './components/GlobalOffersBanner';
import { GroupProductsCheckOutBar } from './components/GroupProductsCheckOutBar';
import GroupProductsList from './components/GroupProductsList';
import PDPHeader from './components/PDPHeader';
import { ProductAttributes } from './components/ProductAttributes';
import ProductColorsList from './components/ProductColorsList';
import ProductImageList from './components/ProductImageList';
import ProductMattressSizeList from './components/ProductMattressSizeList';
import ProductOptionsDetails from './components/ProductOptionsDetails';
import ProductPriceAndUpdateQty from './components/ProductPriceAndUpdateQty';
import { Recommendations } from './components/Recommendations';
import {
  A1_COMPONENT,
  GLOBAL_OFFER_BANNER,
  GROUPED_PRODUCTS,
  HTML_COMPONENT,
  PDP_3D_COMPONENT,
  PDP_BULK_ORDERS_STRIP,
  PDP_BUY_NOW_PAY_LATER,
  PDP_CLICK_AND_COLLECT_STRIP,
  PDP_HEADER,
  PDP_MORE_OPTIONS,
  PDP_PRICE_AND_QUANTITY,
  PDP_PRODUCT_FEATURES_DESCRIPTION,
  PDP_USP,
  PRODUCT_IMAGES,
  RECOMMENDATION_WIDGET_CUSTOMER_ALSO_BOUGHTED,
  RECOMMENDATION_WIDGET_OFTEN_BROUGHT_TOGETHER,
  RECOMMENDATION_WIDGET_SIMILAR_PRODUCTS,
  RECOMMENDATION_WIDGET_YOU_MAY_ALSO_LIKE,
} from './constants';
import EmptyPdp from './EmptyPdp';

const PDP = ({ navigation, route }) => {
  const {
    productId,
    productDetail,
    urlKey,
    landed_from_url,
    via,
    landed_from_push_notification,
    is_deferred_deeplink = false,
    previous_screen,
  } = route.params || {};
  const [isLoading, setIsLoading] = useState(productDetail?.id ? false : true);
  const { screenSettings } = useSelector((state) => state.screens);
  const { country, language, userToken, pwaGuestToken } = useSelector(
    (state) => state.auth
  );
  const { cartItems } = useSelector((state) => state.cart ?? []);
  const pdpScreenSettings = screenSettings?.[SCREEN_NAME_PDP];
  const productDetailFromParam = {};
  if (productDetail?.id) {
    productDetailFromParam.getProductDetailForMobile = {
      _id: productDetail?.id.toString(),
      media_gallery: productDetail?.images,
      defaultPrice: productDetail?.defaultPrice,
      selectedPrice: productDetail?.selectedPrice,
      type_id: productDetail?.type_id,
    };
  }
  const [productData, setProductData] = useState(productDetailFromParam);
  const [otherProductFields, setOtherProductFields] = useState({});
  const [productCount, setProductCount] = useState(1); //quantity?.[0]?.qty || 1
  const [onLayout, setOnLayout] = useState(0);
  const [groupProductsListData, setGroupProductsListData] = useState();
  const scrollViewRef = useRef(1);

  // onselect product color set state
  const [selectedColorItem, setSelectedcolorItem] = useState();

  // onselect product Mattresss size set state
  const [selectedMattressSize, setSelectedMattressSize] = useState();

  // onselect product Pattern set state
  const [cartData, setCartData] = useState([]);
  const [isAddToCartLoaderVisible, setIsAddToCartLoaderVisible] =
    useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    Analytics_Events({
      eventName: EVENT_NAME_SCREEN_VIEW,
      params: {
        screen_name: SCREEN_NAME_PDP,
        country,
        language,
        previous_screen,
        sku: productId,
        is_deferred_deeplink,
        landed_from_url,
        via,
        landed_from_push_notification,
      },
    });
  }, []);

  useEffect(() => {
    const cartItemData = cartItems?.cartData?.items?.filter((data) => {
      return data?.sku === productId;
    });
    setCartData(cartItemData);
  }, [cartItems]);

  useEffect(() => {
    getProductDetail(productId);
    const quantity = cartItems?.cartData?.items.filter((data) => {
      return data?.sku === productDetail?.sku;
    });
    setProductCount(quantity?.[0]?.qty || 1);
  }, []);

  const getProductDetail = async (ProductSku) => {
    let FindArrayOfComponenet = pdpScreenSettings?.componentsCollection?.items;
    let filterFieldValue = FindArrayOfComponenet?.map((data) => {
      return data?.config?.field;
    }).filter((data) => data !== undefined);

    const productDetailData = {
      urlKey: urlKey,
      id: ProductSku,
      language,
      country,
      fields: filterFieldValue.concat(
        'sale_badge',
        'feature_badge',
        'market_badge',
        'discount_badge',
        'url_key',
        'hello_ar_product_code',
        'allow_click_and_collect',
        'installation_type',
        'is_returnable',
        'brand'
      ),
    };
    const { getProductDetailForMobileRes } = await getProductDetailForMobile(
      productDetailData
    );

    setProductData(getProductDetailForMobileRes);
    setIsLoading(false);

    const otherFields = {};
    getProductDetailForMobileRes?.getProductDetailForMobile?.otherFields?.map(
      (other) => {
        otherFields[other.field_id] = other.value;
      }
    );
    setOtherProductFields(otherFields);

    setGroupProductsListData(
      getProductDetailForMobileRes?.getProductDetailForMobile?.groupedProducts
    );
    const selectedColors =
      getProductDetailForMobileRes?.getProductDetailForMobile?.relatedProducts?.filter(
        (data) => {
          return (
            data?._id ===
            getProductDetailForMobileRes?.getProductDetailForMobile?._id
          );
        }
      );
    setSelectedcolorItem(selectedColors?.[0]);

    const selectedMatteress =
      getProductDetailForMobileRes?.getProductDetailForMobile?.relatedProducts?.filter(
        (data) => {
          return (
            data?._id ===
            getProductDetailForMobileRes?.getProductDetailForMobile?._id
          );
        }
      );
    setSelectedMattressSize(selectedMatteress?.[0]);
    Analytics_Events({
      eventName: EVENT_NAME_SCREEN_VIEW_COMPLETE,
      params: {
        screen_name: SCREEN_NAME_PDP,
        country,
        language,
        previous_screen,
        sku: productId,

        is_deferred_deeplink,
        landed_from_url,
        via,
        landed_from_push_notification,
      },
    });
    logProductViewItem({
      items: [getProductDetailForMobileRes?.getProductDetailForMobile],
    });
  };

  const RenderHeaderComponents = ({
    componentName,
    navigation,
    components,
    productData,
  }) => {
    const selectedComponent = components?.[componentName] || {};
    switch (componentName) {
      case PDP_HEADER:
        return (
          <PDPHeader
            navigation={navigation}
            components={selectedComponent}
            product={productData?.getProductDetailForMobile}
            productName={productData?.getProductDetailForMobile?.name}
            urlKey={
              productData?.getProductDetailForMobile?.otherFields?.filter(
                (data) => {
                  return data?.field_id === 'url_key' && data?.value;
                }
              )[0]?.value
            }
          />
        );
      default:
        return null;
    }
  };

  const RenderPDPScreenComponents = ({
    componentName,
    navigation,
    components,
    productData,
    selectedColorItem,
    selectedMattressSize,
    otherProductFields,
  }) => {
    const selectedComponent = components?.[componentName] || {};

    switch (componentName) {
      case PRODUCT_IMAGES:
        return (
          <ProductImageList
            style={{ flex: 1 }}
            navigation={navigation}
            components={selectedComponent}
            productData={productData}
            otherProductFields={otherProductFields}
            handle360Button={() => {
              scrollViewRef.current
                .getScrollResponder()
                .scrollTo({ x: 0, y: onLayout, animated: true });
            }}
          />
        );
      case GROUPED_PRODUCTS:
        return (
          <GroupProductsList
            components={selectedComponent}
            navigation={navigation}
            productData={groupProductsListData}
            productArray={(data) => {
              setGroupProductsListData(data);
            }}
          />
        );
      case PDP_MORE_OPTIONS: {
        const baseId =
          productData?.getProductDetailForMobile?.relatedProducts?.[0]
            ?.related_base_id;
        const { config: { colorAttributes, sizeAttributes } = {} } =
          selectedComponent;
        const colorAttributesList = colorAttributes || ['color'];
        const sizeAttributesList = sizeAttributes || [
          'mattress_size',
          'carpet_size',
          'pattern_size',
        ];
        return (
          <>
            {colorAttributesList.includes(baseId) ? (
              <ProductColorsList
                productData={productData}
                navigation={navigation}
                selectedColorItem={selectedColorItem}
                setSelectedcolorItem={(item) => {
                  onChangeProductColor(item);
                }}
              />
            ) : sizeAttributesList.includes(baseId) ? (
              <ProductMattressSizeList
                productData={productData}
                navigation={navigation}
                selectedMattressSize={selectedMattressSize}
                setSelectedMattressSize={(item) => {
                  onChangeProductMatteress(item);
                }}
              />
            ) : null}
          </>
        );
      }
      case PDP_PRICE_AND_QUANTITY:
        if (
          productData?.getProductDetailForMobile?.type_id !== 'grouped' &&
          !productData?.getProductDetailForMobile?.groupedProducts?.length
        ) {
          return (
            <ProductPriceAndUpdateQty
              productData={productData}
              components={selectedComponent}
              productCount={productCount}
              setProductCount={(count) => setProductCount(count)}
            />
          );
        }
        return null;
      case PDP_PRODUCT_FEATURES_DESCRIPTION:
        return (
          <ProductAttributes
            productData={
              productData?.getProductDetailForMobile?.fieldset?.pdpGroups
            }
          />
        );
      case PDP_USP:
        return (
          <ProductOptionsDetails
            components={selectedComponent}
            productData={productData}
          />
        );
      case GLOBAL_OFFER_BANNER:
        return (
          <GlobalOffersBanner
            components={selectedComponent}
            productData={productData}
          />
        );
      case PDP_CLICK_AND_COLLECT_STRIP: {
        if (otherProductFields?.allow_click_and_collect) {
          return null;
        }
        return (
          <ClickAndCollectStrip
            components={selectedComponent}
            productData={productData}
          />
        );
      }
      case PDP_BULK_ORDERS_STRIP:
        return (
          <BulkOrder
            components={selectedComponent}
            productData={productData}
            sku={productId}
          />
        );
      case HTML_COMPONENT:
        return <></>;
      case PDP_3D_COMPONENT:
        return (
          <ARModel
            otherProductFields={otherProductFields}
            components={selectedComponent}
            productData={productData}
            setOnLayout={(data) => setOnLayout(data)}
          />
        );
      case RECOMMENDATION_WIDGET_OFTEN_BROUGHT_TOGETHER:
        return (
          <Recommendations
            otherProductFields={otherProductFields}
            component={selectedComponent}
            productData={productData?.getProductDetailForMobile}
          />
        );
      case RECOMMENDATION_WIDGET_YOU_MAY_ALSO_LIKE:
        return (
          // <PaymentWidget productData={productData?.getProductDetailForMobile} />
          <Recommendations
            component={selectedComponent}
            productData={productData?.getProductDetailForMobile}
          />
        );
      case RECOMMENDATION_WIDGET_SIMILAR_PRODUCTS:
        return (
          <Recommendations
            component={selectedComponent}
            productData={productData?.getProductDetailForMobile}
          />
        );

      case RECOMMENDATION_WIDGET_CUSTOMER_ALSO_BOUGHTED:
        return (
          <Recommendations
            component={selectedComponent}
            productData={productData?.getProductDetailForMobile}
            disableRelatedProductVariant={true}
          />
        );

      case A1_COMPONENT:
        return (
          <A1Component
            otherProductFields={otherProductFields}
            components={selectedComponent}
            productData={productData}
          />
        );

      case PDP_BUY_NOW_PAY_LATER:
        return (
          <BuyNowPayLater
            components={selectedComponent}
            productData={productData}
            productCount={productCount}
            groupProductsListData={groupProductsListData}
          />
        );
      default:
        return null;
    }
  };

  const onChangeProductColor = (data) => {
    setSelectedcolorItem(data);
    getProductDetail(data?._id);
  };

  const onChangeProductMatteress = (data) => {
    setSelectedMattressSize(data);
    getProductDetail(data?._id);
  };
  const onSuccessAddToCart = (data) => {
    if (data?.saveCartItem) {
      dispatch(setUserCartItems(data?.saveCartItem));
    }
    showToast({
      message: 'Successfully added to the cart',
      type: 'success',
      position: 'bottom',
    });
    ReactNativeHapticFeedback.trigger('notificationSuccess');
  };
  const onErrorAddToCart = (error) => {
    logError(error);
    ReactNativeHapticFeedback.trigger('notificationError');
    showToast({
      message: GENERIC_ERROR_MESSAGE(language, error?.message), // TO DO TRANSLATION AND ERROR MESSAGE
      type: 'error',
      position: 'bottom',
    });
    resetQuestQuoteInCaseThereAErrorInTheCart(dispatch);
  };

  const handleAddToCart = async (item, counter) => {
    try {
      if (userToken) {
        setIsAddToCartLoaderVisible(true);
        try {
          const productDetails =
            cartData?.[0]?.sku === productId
              ? {
                  item_id: cartData?.[0]?.item_id,
                  sku: cartData?.[0]?.sku,
                  product_type: item?.type_id || 'simple',
                  qty: counter,
                  quantity: counter,
                }
              : {
                  sku: item?._id,
                  product_type: item?.type_id || 'simple',
                  qty: counter,
                  quantity: counter,
                };
          const { data, error } = await saveCartItemCustomer(productDetails);
          if (error) {
            onErrorAddToCart(error);
          } else {
            onSuccessAddToCart(data);
          }
        } catch (e) {
          logError(e);
          resetQuestQuoteInCaseThereAErrorInTheCart(dispatch);
          showToast({
            message: GENERIC_ERROR_MESSAGE(language, e?.message),
            type: 'error',
            position: 'bottom',
          });

          ReactNativeHapticFeedback.trigger('notificationError');
        }
        setIsAddToCartLoaderVisible(false);
      } else {
        setIsAddToCartLoaderVisible(true);
        try {
          const productDetails =
            cartData?.[0]?.sku === productId
              ? {
                  item_id: cartData?.[0]?.item_id || 'simple',
                  sku: cartData?.[0]?.sku,
                  product_type: item?.type_id,
                  qty: counter,
                  quantity: counter,
                }
              : {
                  sku: item?._id,
                  product_type: item?.type_id || 'simple',
                  qty: counter,
                  quantity: counter,
                };

          let guestToken = pwaGuestToken;
          if (!guestToken) {
            guestToken = await resetQuestQuoteInCaseThereAErrorInTheCart(
              dispatch
            );
          }

          const guestCartId = `${guestToken}`;

          const { data, error } = await saveCartItem(
            productDetails,
            guestCartId
          );
          if (error) {
            onErrorAddToCart(error);
          } else {
            onSuccessAddToCart(data);
          }
        } catch (e) {
          logError(e);
          showToast({
            message: GENERIC_ERROR_MESSAGE(language, e?.message),
            type: 'error',
          });
          {
            /** TODO Translation Contentful */
          }
        }
        setIsAddToCartLoaderVisible(false);
      }
    } catch (e) {
      showToast({
        message: GENERIC_ERROR_MESSAGE(language, e?.message),
        type: 'error',
      });
      ReactNativeHapticFeedback.trigger('notificationError');
    }
  };

  const PDPComponents = useMemo(() => {
    return (
      <FlatList
        ref={scrollViewRef}
        renderToHardwareTextureAndroid
        shouldRasterizeIOS
        data={pdpScreenSettings?.componentsOrder}
        renderItem={({ item }) => {
          const componentName = item;
          return (
            <RenderPDPScreenComponents
              key={componentName}
              componentName={componentName}
              navigation={navigation}
              components={pdpScreenSettings?.components}
              productData={productData}
              selectedColorItem={selectedColorItem}
              setSelectedcolorItem={setSelectedcolorItem}
              selectedMattressSize={selectedMattressSize}
              setSelectedMattressSize={setSelectedMattressSize}
              otherProductFields={otherProductFields}
            />
          );
        }}
      />
    );
  }, [
    productData,
    groupProductsListData,
    selectedColorItem,
    selectedMattressSize,
  ]);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ backgroundColor: 'white' }} />
      {pdpScreenSettings?.componentsOrder?.map((componentName, index) => {
        return (
          <RenderHeaderComponents
            key={componentName + index}
            componentName={componentName}
            navigation={navigation}
            components={pdpScreenSettings?.components}
            productData={productData}
          />
        );
      })}

      {productData?.getProductDetailForMobile?._id ? (
        // <ScrollView
        //   ref={scrollViewRef}
        //   renderToHardwareTextureAndroid
        //   shouldRasterizeIOS
        // >
        //   {pdpScreenSettings?.componentsOrder?.map((componentName) => {
        //     return (
        //       <RenderPDPScreenComponents
        //         key={componentName}
        //         componentName={componentName}
        //         navigation={navigation}
        //         components={pdpScreenSettings?.components}
        //         productData={productData}
        //         selectedColorItem={selectedColorItem}
        //         setSelectedcolorItem={setSelectedcolorItem}
        //         selectedMattressSize={selectedMattressSize}
        //         setSelectedMattressSize={setSelectedMattressSize}
        //         otherProductFields={otherProductFields}
        //       />
        //     );
        //   })}
        // </ScrollView>
        PDPComponents
      ) : !isLoading ? (
        <EmptyPdp />
      ) : (
        <ActivityIndicator size="small" color="#B00009" />
      )}
      {productData?.getProductDetailForMobile?._id ? (
        <>
          {productData?.getProductDetailForMobile?.type_id !== 'grouped' &&
          !productData?.getProductDetailForMobile?.groupedProducts?.length ? (
            <CheckOutBar
              handleAddToCartButton={(
                counter,
                isIncreaseProductQty,
                isUpdateCart
              ) => {
                handleAddToCart(
                  productData?.getProductDetailForMobile,
                  counter,
                  isIncreaseProductQty,
                  isUpdateCart
                );
              }}
              isAddToCartLoaderVisible={isAddToCartLoaderVisible}
              productDetail={productData?.getProductDetailForMobile}
              navigation={navigation}
              productCount={productCount}
              setProductCount={(count) => setProductCount(count)}
            />
          ) : (
            <GroupProductsCheckOutBar
              componentName={'GROUPED_PRODUCTS'}
              navigation={navigation}
              // productData={productData?.getProductDetailForMobile?.groupedProducts}
              productData={groupProductsListData}
              handleAddToCartButton={(
                item,
                counter,
                isIncreaseProductQty,
                isUpdateCart
              ) => {
                handleAddToCart(
                  item,
                  counter,
                  isIncreaseProductQty,
                  isUpdateCart
                );
              }}
            />
          )}
        </>
      ) : null}

      <SafeAreaView style={{ backgroundColor: 'white' }} />
    </View>
  );
};
export default PDP;
