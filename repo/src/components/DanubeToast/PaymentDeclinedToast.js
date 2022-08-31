import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import DanubeText, { TextVariants } from '../DanubeText';
import Close from '../../../assets/svg/close_red.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const HEIGHT = 50;

const PaymentDeclinedToast = ({ props }) => {
  const insets = useSafeAreaInsets();

  const {
    header = '',
    description = '',
    mainIcon = null,
    onClose = () => {},
  } = props;
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#FFF2F2',
        borderWidth: 1,
        borderColor: '#F19E9A',
        borderRadius: 4,
        marginHorizontal: 15,
        paddingVertical: 11,
        marginTop: insets.top + HEIGHT,
      }}
    >
      <View
        style={{
          alignSelf: 'center',
          marginLeft: 15,
          marginRight: 16,
        }}
      >
        {mainIcon}
      </View>
      <View style={{ flex: 1 }}>
        <DanubeText
          color="#D12E27"
          variant={TextVariants.XS}
          mediumText
          style={{ marginBottom: 6 }}
        >
          {header}
        </DanubeText>
        <DanubeText color="#D12E27" style={{ fontSize: 12 }}>
          {description}
        </DanubeText>
      </View>

      <TouchableOpacity
        style={{ marginRight: 8 }}
        onPress={onClose}
        activeOpacity={0.6}
      >
        <Close />
      </TouchableOpacity>
    </View>
  );
};

export default PaymentDeclinedToast;

const styles = StyleSheet.create({});
