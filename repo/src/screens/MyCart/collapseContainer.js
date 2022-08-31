import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { SvgUri } from 'react-native-svg';
import DownArrow from '../../../assets/svg/down_arrow.svg';
import Block from '../../components/Block';
import DanubeText, { TextVariants } from '../../components/DanubeText';
import { Loader } from '../../components/Loder';
import colors from '../../styles/colors';
const SECTIONS = [
  {
    id: 0,
  },
];

const CollapseContainer = ({
  title,
  placeholder,
  buttonName,
  isImageVisible,
  leftIcon,
  successIcon,
  onButtonPress = () => {},
  onRemoveButtonPress = () => {},
  isApplyCouponSuccess,
  couponLoading,
  couponApplied = '',
  currency = '',
  discountAmount = '',
}) => {
  const [activeSections, setActiveSections] = useState([]);

  const _renderContent = () => {
    return (
      <>
        {isApplyCouponSuccess || couponApplied ? (
          <View style={styles.main}>
            <View style={styles.row}>
              <View style={styles.uri}>
                <SvgUri uri={successIcon} />
              </View>
              <View>
                <View style={styles.row}>
                  <DanubeText
                    mediumText
                    color={colors.black_4}
                    variant={TextVariants.XXS}
                  >
                    {textInputValue}
                  </DanubeText>
                  <DanubeText variant={TextVariants.XXS13}>applied</DanubeText>
                </View>
                <DanubeText
                  variant={TextVariants.XXXS11}
                  color={colors.grey_13}
                >
                  {discountAmount}
                  {currency}
                </DanubeText>
              </View>
            </View>
            <TouchableOpacity
              disabled={couponLoading}
              onPress={() => {
                onRemoveButtonPress();
              }}
              style={styles.touchable}
            >
              {couponLoading ? (
                <Loader
                  size={Platform.OS === 'ios' ? 6 : 15}
                  color={colors.red_2}
                />
              ) : (
                <DanubeText color={colors.red_2} variant={TextVariants.XXS}>
                  REMOVE
                </DanubeText>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Block flex={false} row center style={styles.collapseBodyContainer}>
              {isImageVisible && (
                <View style={styles.icon}>
                  <SvgUri uri={leftIcon} />
                </View>
              )}
              <TextInput
                value={textInputValue}
                onChangeText={(res) => {
                  setTextInputValue(res);
                }}
                placeholder={placeholder}
                placeholderTextColor={colors.grey_8}
                style={styles.textInputStyle}
              />
              <TouchableOpacity
                disabled={couponLoading}
                style={[
                  styles.applyButtonView,
                  {
                    backgroundColor: disbaleApply
                      ? colors.grey_9
                      : colors.black,
                  },
                ]}
                onPress={() => {
                  onButtonPress(textInputValue);
                }}
              >
                {couponLoading ? (
                  <Loader
                    size={Platform.OS === 'ios' ? 6 : 15}
                    color={colors.white}
                  />
                ) : (
                  <Text style={styles.applyText}>{buttonName}</Text>
                )}
              </TouchableOpacity>
            </Block>
          </>
        )}
      </>
    );
  };

  const _renderHeader = (props) => {
    const expanded = activeSections?.some((res) => res === props.id);
    return (
      <Block style={styles.collapseHeaderContainer}>
        <Block style={styles.ImageScrollerMainViewStyle}>
          <DanubeText variant={TextVariants.XS}>{title}</DanubeText>
        </Block>
        <Block
          flex={false}
          style={[
            styles.collapseHeaderArrow,
            expanded ? styles.collapseHeaderArrowRotate : {},
          ]}
        >
          <DownArrow />
        </Block>
      </Block>
    );
  };

  const [textInputValue, setTextInputValue] = useState(null);
  const [disbaleApply, setDisableApply] = useState(false);

  useEffect(() => {
    const getCouponCode = async () => {
      const couponCode = await AsyncStorage.getItem('COUPONCODE');
      setTextInputValue(couponCode);
    };
    getCouponCode();
  }, []);

  const _updateSections = (activeSections) => {
    setActiveSections(activeSections);
  };

  useEffect(() => {
    if (textInputValue?.trim()) {
      setDisableApply(false);
    } else {
      setDisableApply(true);
    }
  }, [textInputValue]);
  return (
    <Accordion
      underlayColor={colors.white}
      touchableProps={{ aciveOpacity: 0.8 }}
      sections={SECTIONS}
      //  activeSections={activeSections}
      activeSections={[0]}
      renderHeader={_renderHeader}
      renderContent={_renderContent}
      onChange={_updateSections}
      containerStyle={styles.accordion}
    />
  );
};
export default CollapseContainer;

CollapseContainer.propTypes = {
  couponLoading: PropTypes.bool,
};

CollapseContainer.defaultProps = {
  couponLoading: false,
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: colors.green,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.light_green,
    borderRadius: 4,
    paddingTop: 11,
    paddingBottom: 9,
    justifyContent: 'space-between',
    marginTop: 15,
  },
  row: {
    flexDirection: 'row',
  },
  uri: {
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  collapseHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  collapseHeaderArrow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 25,
    height: 25,
    borderStyle: 'solid',
    borderColor: '#F6F6F8',
  },
  collapseHeaderArrowRotate: {
    transform: [{ rotate: '180deg' }],
  },
  collapseBodyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: colors.grey_7,
    marginTop: 16,
    paddingLeft: 12,
    minHeight: 46,
    borderRadius: 4,
  },
  ImageScrollerMainViewStyle: {
    justifyContent: 'center',
  },
  ImageScrollerTitleTextStyle: {
    fontSize: 15,
    fontFamily: 'Roboto-Bold',
    textAlign: 'left',
    color: colors.black,
  },
  textInputStyle: {
    flex: 1,
    paddingHorizontal: 10,
  },
  applyButtonView: {
    width: '30%',
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d8d8d8',
    borderRadius: 4,
  },
  applyText: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: colors.white,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  accordion: {
    marginHorizontal: 14,
    paddingBottom: 22,
  },
  touchable: {
    justifyContent: 'center',
    width: '30%',
    alignItems: 'center',
  },
});
