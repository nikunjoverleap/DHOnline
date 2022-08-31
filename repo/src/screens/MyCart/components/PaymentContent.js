import React from 'react';
import { I18nManager, StyleSheet, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import DanubeText, { TextVariants } from '../../../components/DanubeText';

const PaymentContent = ({ color, steps, footer }) => {
  return (
    <View style={[styles.content, { borderColor: color }]}>
      <View style={[styles.iconsContainer]}>
        <View style={[styles.icons, { backgroundColor: color }]}>
          <View style={styles.text}>
            <DanubeText style={styles.width} center variant={TextVariants.XXXS}>
              {steps?.[0]?.description}
            </DanubeText>
          </View>
          <SvgUri uri={steps?.[0]?.icon} />
        </View>
        <View style={[styles.line, { backgroundColor: color }]} />
        <View style={[styles.icons, { backgroundColor: color }]}>
          <View style={styles.text}>
            <DanubeText style={styles.width} center variant={TextVariants.XXXS}>
              {steps?.[1]?.description}
            </DanubeText>
          </View>
          <SvgUri uri={steps?.[1]?.icon} />
        </View>
        <View style={[styles.line, { backgroundColor: color }]} />
        <View style={[styles.icons, { backgroundColor: color }]}>
          <View style={styles.text}>
            <DanubeText style={styles.width} center variant={TextVariants.XXXS}>
              {steps?.[2]?.description}
            </DanubeText>
          </View>
          <SvgUri uri={steps?.[2]?.icon} />
        </View>
      </View>
      <DanubeText style={styles.footer}>{footer}</DanubeText>
    </View>
  );
};

export default PaymentContent;

const styles = StyleSheet.create({
  content: {
    borderWidth: 1,
    borderRadius: 4,
    paddingTop: 14,
    marginBottom: 17,
  },
  width: {
    width: 70,
  },
  line: {
    width: 82,
    height: 1,
  },
  iconsContainer: {
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icons: {
    width: 49,
    height: 49,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    position: 'absolute',
    top: 52,
  },
  footer: {
    fontSize: 11,
    marginTop: 60,
    marginBottom: 10,
    marginHorizontal: 11,
  },
});
