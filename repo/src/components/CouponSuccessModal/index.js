import LottieView from 'lottie-react-native';
import PropTypes from 'prop-types';
import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import colors from '../../styles/colors';
import DanubeText, { TextVariants } from '../DanubeText';

const CouponSuccessModal = ({ visible, discountAmount, currency }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.main}>
        <View style={styles.inner}>
          <DanubeText center variant={TextVariants.S} color={colors.black_3}>
            Mabrook {/**TODO Transation */}
          </DanubeText>
          <View style={styles.lottie}>
            <LottieView
              source={require('./couponSuccess.json')}
              autoPlay
              loop={true}
            />
          </View>
          <DanubeText
            mediumText
            color={colors.black_3}
            varinant={TextVariants.XXS}
            center
          >
            Happy saving {/**TODO Transation */}
          </DanubeText>
          <View style={styles.description}>
            <DanubeText
              center
              variant={TextVariants.XXXS}
              color={colors.grey_4}
            >
              Coupon code has been applied successfully {/**TODO Transation */}
            </DanubeText>
          </View>
          <View style={styles.youSaved}>
            <DanubeText variant={TextVariants.XXXS} color={colors.black_3}>
              You saved {/**TODO Transation */}
            </DanubeText>
            <DanubeText
              variant={TextVariants.B}
              color={colors.green_2}
              mediumText
            >
              {' '}
              {discountAmount < -1 ? discountAmount * -1 : discountAmount}{' '}
              {currency}
            </DanubeText>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CouponSuccessModal;

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: colors.transparent_black,
  },
  inner: {
    backgroundColor: colors.white,
    borderRadius: 4,
    paddingTop: 13,
    marginHorizontal: 104,
  },
  mabrook: {},
  lottie: {
    height: 127,
    width: 191,
    alignSelf: 'center',
  },
  description: {
    paddingTop: 11,
    marginHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  youSaved: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 15,
    paddingTop: 7,
  },
});

CouponSuccessModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

CouponSuccessModal.defaultProps = {
  visible: false,
  discountAmount: '',
  currency: '',
};
