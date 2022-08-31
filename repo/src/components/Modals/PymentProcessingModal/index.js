import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { SCREEN_NAME_CHECKOUT } from '../../../constants';
import colors from '../../../styles/colors';
import DanubeText, { TextVariants } from '../../DanubeText';
import { PAYMENT_PROCESSING_MODAL } from './constants';

const PaymentProcessingModal = ({ visible }) => {
  const { screenSettings } = useSelector((state) => state.screens);

  const paymentProcessingData =
    screenSettings?.[SCREEN_NAME_CHECKOUT]?.components;

  const labels =
    paymentProcessingData?.[PAYMENT_PROCESSING_MODAL]?.componentData;

  return (
    <Modal animationType="slide" visible={visible}>
      <View style={styles.main}>
        {/* <LottieView
        source={require('./payment_processing.json')}
        autoPlay
        loop={true}
      /> */}
        <DanubeText variant={TextVariants.M} mediumText>
          {labels?.header || ''}
        </DanubeText>
        <DanubeText style={styles.desc} center variant={TextVariants.XXS}>
          {labels?.description || ''}
        </DanubeText>
      </View>
    </Modal>
  );
};

export default PaymentProcessingModal;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.grey_10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: {
    marginHorizontal: 77,
    marginTop: 17,
  },
  lottie: {
    height: 200,
    width: 200,
    alignSelf: 'center',
  },
});
