import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Block from '../../../components/Block';
import DanubeText, { TextVariants } from '../../../components/DanubeText';
import { espTransform } from '../../../components/PriceFormatFunction';
import Text from '../../../components/Text';
import UpdateProductQty from '../../../components/UpdateProductQty';
import { FONT_FAMILY_ENGLISH_REGULAR } from '../../../constants';
import colors from '../../../styles/colors';

const { width } = Dimensions.get('window');

export const GroupProductItem = ({
  item,
  groupProduct,
  productArray = () => {},
}) => {
  const [counter, setCounter] = useState(item?.qty === 0 ? 0 : item?.qty || 1);
  const [sumOfSelectedPrice, setSumOfSelectedPrice] = useState(
    item?.selectedPrice?.specialPrice * counter
  );
  const [isChecked, setIsChecked] = useState(true);

  const [sumOfDefaultPrice, setSumOfDefaultPrice] = useState(
    item?.defaultPrice?.specialPrice * counter
  );

  let uri = item?.media_gallery?.[0]?.value;
  let newReplaceURI = uri.replace('/pub', '');

  useEffect(() => {
    setSumOfSelectedPrice(item?.selectedPrice?.specialPrice * counter);
    setSumOfDefaultPrice(item?.defaultPrice?.specialPrice * counter);
  }, [counter]);

  const setGroupProductQty = useCallback(
    (qty) => {
      setCounter(qty);
      let filterGroupProductArr = groupProduct.map((el) =>
        el._id === item._id ? { ...el, qty: qty } : el
      );
      productArray(filterGroupProductArr);
    },
    [groupProduct]
  );

  useEffect(() => {
    if (counter > 0) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [counter]);

  //add out of stock from backend, we can access it from item variable here
  //const outOfStock = item.inventoryStock.inStock
  const outOfStock = false;

  return (
    <Block flex={false} style={styles.container}>
      <TouchableOpacity
        disabled={outOfStock === true}
        activeOpacity={0.6}
        onPress={() => {
          setIsChecked(!isChecked);
          setGroupProductQty(isChecked ? 0 : 1);
        }}
      >
        <Block
          flex={false}
          style={{ position: 'relative', alignItems: 'center' }}
        >
          <Image
            style={styles.img}
            resizeMode="contain"
            source={{
              uri: `https:${newReplaceURI}`,
            }}
          />
          {/* {index === 1 ? (
        <Block style={styles.outOfStockTextView}>
          <Text style={styles.outOfStockText}>{'out of stock'}</Text>
        </Block>
        ) : ( */}
          {outOfStock ? (
            <View style={styles.outOfStock}>
              <DanubeText variant={TextVariants.XXXS11}>
                Out of stock
              </DanubeText>
            </View>
          ) : null}
          <Block
            flex={false}
            width={20}
            height={20}
            style={{ position: 'absolute', top: 10, left: 10 }}
          >
            {isChecked && outOfStock === false ? (
              <Image
                style={styles.image}
                resizeMode={'contain'}
                source={require('../../../../assets/images/checkIcon.png')}
              />
            ) : null}
          </Block>
          {/* )} */}
        </Block>
      </TouchableOpacity>

      <Block style={styles.bottomContainer}>
        <TouchableOpacity
          disabled={outOfStock === true}
          activeOpacity={0.6}
          onPress={() => {
            setIsChecked(!isChecked);
            setGroupProductQty(isChecked ? 0 : 1);
          }}
        >
          <Block flex={false}>
            <Text numberOfLines={2} style={styles.nameLabel}>
              {item?.name}
            </Text>
          </Block>
        </TouchableOpacity>
        <Block flex={false} style={styles.leftRow}>
          <Block flex={false}>
            <View style={styles.row}>
              <DanubeText variant={TextVariants.XS} color={colors.red_2}>
                {item?.selectedPrice?.currency}{' '}
              </DanubeText>
              <DanubeText
                variant={TextVariants.XS}
                mediumText
                color={colors.red_2}
              >
                {isChecked
                  ? `${espTransform(sumOfSelectedPrice)}`
                  : `${espTransform(item?.selectedPrice?.specialPrice)}`}
              </DanubeText>
            </View>
          </Block>
          <Block>
            <DanubeText style={styles.strike} light color={colors.grey_4}>
              {item?.defaultPrice?.currency}{' '}
              {isChecked
                ? `${espTransform(sumOfDefaultPrice)}`
                : `${espTransform(item?.defaultPrice?.specialPrice)}`}
            </DanubeText>
          </Block>
        </Block>
        {/* {index === 1 ? (
        <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
          <Block style={styles.btn}>
            <Block center middle>
              <Text style={styles.btnLabel}>Notify Me</Text>
            </Block>
          </Block>
        </TouchableOpacity>
        ) : ( */}
        <Block flex={false} width={'60%'}>
          <UpdateProductQty
            outOfStock={outOfStock}
            extraMainViewStyle={{ height: 35, marginTop: 5 }}
            counterExtraTextstyle={{ fontSize: 14 }}
            counter={counter}
            canReduceToZero
            onPlusPress={() => {
              setCounter(counter + 1);
              setGroupProductQty(counter + 1);
            }}
            onMinusPress={() => {
              if (counter > 0) {
                setCounter(counter - 1);
                setGroupProductQty(counter - 1);
              }
            }}
          />
        </Block>
        {/* )} */}
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderStyle: 'solid',
  },
  outOfStock: {
    position: 'absolute',
    top: 15,
    left: 10,
    backgroundColor: colors.grey_15,
    borderColor: colors.grey_15,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 4,
  },
  img: {
    width: width / 2.6,
    height: 170,
  },
  bottomContainer: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 8,
    paddingTop: 5,
    width: width / 2.4,
  },
  nameLabel: {
    color: colors.black,
    fontSize: 13,
    paddingBottom: 3,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    textAlign: 'left',
  },
  leftRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  specialPriceLabel: {
    paddingBottom: 3,
    color: '#D12E27',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 5,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    textAlign: 'left',
  },
  regularPriceLabel: {
    paddingBottom: 3,
    color: '#989898',
    fontSize: 14,
    textDecorationLine: 'line-through',
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    textAlign: 'left',
  },

  btn: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    borderColor: '#333333',
    borderWidth: 0.7,
    borderStyle: 'solid',
    borderRadius: 4,
    marginTop: 5,
  },
  btnLabel: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },

  outOfStockTextView: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#C9C9C9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  outOfStockText: {
    color: '#000000',
    fontSize: 11,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    textAlign: 'left',
  },
  strike: {
    fontSize: 13,
    textDecorationLine: 'line-through',
    marginLeft: 5,
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
