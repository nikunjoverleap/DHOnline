import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ElevatedView from 'react-native-elevated-view';
import { useSelector } from 'react-redux';
import CreditCardSvg from '../../../assets/svg/CreditCard.svg';
import DanubeLogo from '../../../assets/svg/danube_logo.svg';
import LocationPinSvg from '../../../assets/svg/LocationPin.svg';
import OrderSvg from '../../../assets/svg/Order.svg';
import PickupSvg from '../../../assets/svg/Pickup.svg';
import ReceiverSvg from '../../../assets/svg/Receiver.svg';
import RightArrowWhiteSvg from '../../../assets/svg/RightArrowWhite.svg';
import {
  DEFAULT_BRAND,
  EVENT_NAME_PURCHASE,
  EVENT_NAME_SCREEN_VIEW,
  EVENT_NAME_SCREEN_VIEW_COMPLETE,
  SCREEN_NAME_ORDER_CONFIRMATION,
} from '../../constants';
import { Analytics_Events } from '../../helper/Global';
import CheckoutHeader from '../../screens/MyCart/components/CheckoutHeader';
import colors from '../../styles/colors';
import { ORDER_CONFIRMATION_DATA } from './constants';
import StyleSheetFactory from './OrderConfirmationStyle';
import OrderItem from './OrderItem';

export default OrderConfirmationScreen = ({ navigation }) => {
  const { language, country } = useSelector((state) => state.auth);

  const { orderDetails, isOrderSucess, orderConfirmationLoading } = useSelector(
    (state) => state.orderConfirmation
  );
  const { screenSettings } = useSelector((state) => state.screens);

  const orederConfirmationScreenSettings =
    screenSettings?.[SCREEN_NAME_ORDER_CONFIRMATION];
  const componentData =
    orederConfirmationScreenSettings?.components[ORDER_CONFIRMATION_DATA]
      ?.componentData;

  let styles = StyleSheetFactory.getSheet(language);

  const {
    order_items,
    payment_info,
    base_order_info,
    shipping_info,
    billing_address,
    order_products,
  } = orderDetails;

  const LOTTIE_WIDTH = 100;

  useEffect(() => {
    Analytics_Events({
      eventName: EVENT_NAME_SCREEN_VIEW,
      params: {
        screen_name: SCREEN_NAME_ORDER_CONFIRMATION,
        country,
        language,
      },
    });
  }, []);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const {
    cod_charge,
    coupon_code,
    customer_email,
    discount_amount,
    grand_total,
    increment_id,
    order_currency_code,
    sub_total,
    tax_amount,
    total_qty_ordered,
    shipping_charge,
  } = base_order_info || {};
  useEffect(() => {
    if (!firstLoaded && base_order_info) {
      const itemsAndQty = {};
      order_items.forEach((item) => {
        itemsAndQty[item.sku] = item;
      });
      const items = order_items?.map((item) => {
        const orderItem = itemsAndQty[item.sku];
        let categoriesLevel2 = '';
        let categoriesLevel3 = '';
        let categoriesLevel4 = '';

        item?.categories?.map((dataObj, index) => {
          if (index === 0) {
            categoriesLevel2 = dataObj?.name;
          } else if (index === 1) {
            categoriesLevel3 = dataObj?.name;
          } else if (index === 2) {
            categoriesLevel4 = dataObj?.name;
          }
        });
        return {
          item_brand: DEFAULT_BRAND, // TODO IDENTIFY BRAND
          item_category: categoriesLevel2,
          item_category2: categoriesLevel3,
          item_category3: categoriesLevel4,
          item_id: orderItem?.sku,
          item_list_id: '', //rowData?.rowName
          item_list_name: '', //rowData?.rowName
          item_name: orderItem?.name,
          // item_location_id: `slot${0}_${0}`, //row_index  , productIndex
          price: parseFloat(orderItem.row_total),
          quantity: orderItem.qty_ordered,
        };
      });
      Analytics_Events({
        eventName: EVENT_NAME_SCREEN_VIEW_COMPLETE,
        params: {
          screen_name: SCREEN_NAME_ORDER_CONFIRMATION,
          country,
          language,
        },
      });
      Analytics_Events({
        eventName: EVENT_NAME_PURCHASE,
        params: {
          coupon: base_order_info?.coupon_code
            ? base_order_info?.coupon_code
            : '',
          currency: componentData.currency,
          value: grand_total,
          items,
          shipping: shipping_charge,
          tax: tax_amount,
          transaction_id: increment_id,
        },
      });
      setFirstLoaded(true);
    }
  }, [base_order_info, orderConfirmationLoading]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <CheckoutHeader
        mainIcon={<DanubeLogo />}
        navigation={navigation}
        backIcon={null}
      />
      <View style={[styles.container, { flex: 1 }]}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
          }}
        >
          {isOrderSucess || true ? ( // TODO REMOVE TRUE ADDED FOR TESTING
            <>
              <View style={styles.successMsgContainer}>
                <View>
                  <LottieView
                    source={require('./orderSuccess.json')}
                    autoPlay
                    loop={false}
                    resizeMode="cover"
                    style={{
                      width: Dimensions.get('window').width - LOTTIE_WIDTH,
                      height: 200,
                    }}
                  />
                </View>
                <View>
                  <Text style={styles.successMsgTitle}>
                    {componentData?.yourOrderHasBeenPlaced}
                  </Text>
                </View>
                <View>
                  <Text style={styles.successMsgDesc}>
                    {componentData?.youWillReceiveAnEmailAt}{' '}
                    {base_order_info?.customer_email}{' '}
                    {componentData?.onceYourOrderIsConfirmed}
                  </Text>
                </View>
              </View>

              {shipping_info?.shipping_method !== 'tablerate_bestway' ? (
                <ElevatedView style={styles.card} elevation={1}>
                  <View style={styles.shippingAddressHeader}>
                    <View>
                      <PickupSvg height={23} width={17} />
                    </View>
                    <View>
                      <Text style={styles.shippingAddressHeaderLabel}>
                        {componentData?.pickupAddress}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.pickupAddressTitle}>
                      {shipping_info?.shipping_address?.flat_number}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.pickupAddressLabel}>
                      {shipping_info?.shipping_address?.map_fields}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.pickupAddressLabel}>
                      {`${shipping_info?.store_working_hours[0]?.day} (${shipping_info?.store_working_hours[0]?.from} - ${shipping_info?.store_working_hours[0]?.to}`}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.mapLink}>
                      {componentData?.locationMap}
                    </Text>
                  </View>
                  <View style={styles.shippingAddressHeader}>
                    <View>
                      <ReceiverSvg height={18} width={17} />
                    </View>
                    <View>
                      <Text style={styles.shippingAddressHeaderLabel}>
                        {componentData?.receiverInformation}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.receiverInfoRow}>
                    <View style={styles.receiverInfoLabelSection}>
                      <Text style={styles.receiverInfoLabel}>
                        {componentData?.name}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={styles.receiverName}
                      >{`${billing_address?.firstname} ${billing_address?.lastname}`}</Text>
                    </View>
                  </View>
                  <View style={styles.receiverInfoRow}>
                    <View style={styles.receiverInfoLabelSection}>
                      <Text style={styles.receiverInfoLabel}>
                        {componentData?.email}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.receiverInfoValue}>
                        {base_order_info?.email}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.receiverInfoRow]}>
                    <View style={styles.receiverInfoLabelSection}>
                      <Text style={styles.receiverInfoLabel}>
                        {componentData?.mobile}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.receiverInfoValue}>
                        {billing_address?.telephone} ({componentData?.verified})
                      </Text>
                    </View>
                  </View>
                </ElevatedView>
              ) : null}

              {shipping_info?.shipping_method === 'tablerate_bestway' ? (
                <ElevatedView style={styles.card} elevation={1}>
                  <View style={styles.shippingAddressHeader}>
                    <View>
                      <LocationPinSvg height={21} width={18} />
                    </View>
                    <View>
                      <Text style={styles.shippingAddressHeaderLabel}>
                        {componentData?.shippingAddress}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.nameLabel}>
                      {shipping_info?.shipping_address?.firstname}{' '}
                      {shipping_info?.shipping_address?.lastname}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.shippingAddressLabel}>
                      {shipping_info?.shipping_address?.map_fields}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.shippingAddressLabel}>
                      {shipping_info?.shipping_address?.flat_number}
                      {', '}
                      {shipping_info?.shipping_address?.street}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.shippingAddressLabel}>
                      {shipping_info?.shipping_address?.telephone}
                    </Text>
                  </View>
                </ElevatedView>
              ) : null}

              <ElevatedView style={styles.card} elevation={1}>
                <View style={[styles.iconTitleRow]}>
                  <View>
                    <CreditCardSvg height={13} width={18} />
                  </View>
                  <View>
                    <Text style={styles.titleLabel}>
                      {componentData?.paymentMethod}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text style={styles.shippingAddressLabel}>
                    {payment_info?.additional_information?.method_title}
                  </Text>
                </View>
              </ElevatedView>

              <ElevatedView style={styles.card} elevation={1}>
                <View style={[styles.iconTitleRow]}>
                  <View>
                    <OrderSvg height={22} width={18} />
                  </View>
                  <View>
                    <Text style={styles.titleLabel}>
                      {componentData?.orderno} - #
                      {base_order_info?.increment_id}
                    </Text>
                  </View>
                </View>
                <View style={styles.orderItemListContainer}>
                  {order_items?.map((item) => {
                    return (
                      <OrderItem
                        navigation={navigation}
                        item={item}
                        componentData={componentData}
                      />
                    );
                  })}
                </View>
                <View style={styles.orderSummeryContainer}>
                  <View>
                    <Text style={styles.orderSummeryTitle}>
                      {componentData?.orderSummery}
                    </Text>
                  </View>
                  <View style={styles.rowEnd}>
                    <View>
                      <Text style={styles.subTotalLabel}>
                        {componentData?.subtotal}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.subTotalValue}>
                        {order_currency_code} {base_order_info?.sub_total}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rowEnd}>
                    <View>
                      <Text style={styles.orderSummeryItemLabel}>
                        {componentData?.shippingAndHandlingFee}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.orderSummeryItemValue}>
                        {order_currency_code} {shipping_info?.shipping_amount}
                      </Text>
                    </View>
                  </View>

                  {base_order_info?.discount_amount ? (
                    <View style={[styles.rowEnd]}>
                      <View style={styles.row}>
                        <View>
                          <Text style={styles.orderSummeryItemLabel}>
                            {componentData?.discount}{' '}
                            {base_order_info?.coupon_code ? (
                              <Text style={{ fontStyle: 'italic' }}>
                                ({base_order_info?.coupon_code})
                              </Text>
                            ) : null}
                          </Text>
                        </View>
                        {/* <View style={{ paddingLeft: 5 }}>
                  <QuestionMarkSvg height={15} width={15} />
                </View> */}
                      </View>

                      <View>
                        <Text style={styles.orderSummeryItemValue}>
                          {componentData?.currency}{' '}
                          {base_order_info?.discount_amount}
                        </Text>
                      </View>
                    </View>
                  ) : null}

                  {base_order_info?.cod_charge ? (
                    <View style={[styles.rowEnd]}>
                      <View>
                        <Text style={styles.orderSummeryItemLabel}>
                          {componentData?.codCharge}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.orderSummeryItemValue}>
                          {componentData?.currency}{' '}
                          {base_order_info?.cod_charge}
                        </Text>
                      </View>
                    </View>
                  ) : null}

                  <View style={[styles.rowEnd, styles.youPayContainer]}>
                    <View>
                      <Text style={styles.youPayLabel}>
                        {componentData?.youPayed}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.youPayLabel}>
                        {componentData?.currency} {base_order_info?.grand_total}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.taxLabel}>
                      ({componentData?.inclusiveOfAllTaxes})
                    </Text>
                  </View>
                </View>
              </ElevatedView>
            </>
          ) : (
            <>{!orderConfirmationLoading ? <Text>Order failed</Text> : null}</>
          )}
        </ScrollView>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{ backgroundColor: 'red' }}
        >
          <ElevatedView
            elevation={1}
            style={[styles.card, { marginBottom: 0 }]}
          >
            <View style={styles.continueBtn}>
              <View>
                <Text style={styles.continueBtnLabel}>
                  {componentData?.continueShopping}
                </Text>
              </View>
              <View>
                <RightArrowWhiteSvg height={20} width={20} />
              </View>
            </View>
          </ElevatedView>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
