import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import DanubeText, { TextVariants } from '../../../components/DanubeText';
import Toggle from '../../../components/Toggle';
import colors from '../../../styles/colors';

const DanubeWallet = ({
  extraStyle,
  onPress = () => {},
  walletData = {},
  walletLoading = false,
}) => {
  const currentState = walletData?.applied_balance?.value === 0;
  const availableBalance =
    Number(walletData?.current_balance?.value) -
    Number(walletData?.applied_balance?.value);

  return (
    <View style={{ paddingVertical: 6.5, backgroundColor: colors.grey_10 }}>
      <View style={[styles.main, extraStyle]}>
        <DanubeText
          variant={TextVariants.S}
          mediumText
          style={styles.walletLabel}
        >
          Danube Wallet
        </DanubeText>
        <View style={styles.inner}>
          <View style={styles.flex_1}>
            {walletLoading ? (
              <ActivityIndicator />
            ) : (
              <Toggle
                onPress={() => {
                  onPress();
                }}
                currentState={currentState}
              />
            )}
          </View>
          <View style={styles.flex_6}>
            <DanubeText variant={TextVariants.XXS} style={styles.amount}>
              Available Balance is:{' '}
              {walletData?.current_balance?.currency || ''}{' '}
              {availableBalance || ''}
            </DanubeText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DanubeWallet;

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  main: {
    paddingTop: 25,
    paddingBottom: 23,
    backgroundColor: colors.white,
  },
  walletLabel: {
    marginBottom: 11,
  },
  amount: {
    paddingLeft: 8,
  },
  flex_6: {
    flex: 6,
  },
  flex_1: {
    flex: 1,
  },
});
