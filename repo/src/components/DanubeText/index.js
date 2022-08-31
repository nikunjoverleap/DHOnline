import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { StyleSheet, Text as RNText } from 'react-native';
import { useSelector } from 'react-redux';
import {
  FONT_FAMILY_ARABIC_REGULAR,
  FONT_FAMILY_ENGLISH_REGULAR,
} from '../../constants';
import Colors from '../../styles/colors';
import concat from '../../utils/concat';

export const TextVariants = {
  XL: 'xlarge', //34
  L: 'large', //26
  M: 'medium', //20
  Base: 'base', //18
  S: 'small', //16
  XS: 'xsmall', //15
  XXS: 'xxsmall', //14
  XXS13: 'xxs13', //13
  XXXS: 'xxxsmall', //12,
  XXXS11: 'xxxs11', //11
};

export default function DanubeText(props) {
  const { language = 'en' } = useSelector((state) => state.auth);
  const isEnglish = language === 'en';

  const {
    light,
    bold,
    left,
    center,
    right,
    variant,
    color,
    style,
    children,
    semiBold,
    regular,
    mediumText,
    ...restProps
  } = props;
  const styling = useMemo(() => {
    return concat(
      isEnglish ? styles.default : styles.arabicDefault,
      bold && (isEnglish ? styles.bold : styles.arabicBold),
      light && (isEnglish ? styles.light : styles.arabicLight),
      mediumText && (isEnglish ? styles.mediumText : styles.arabicMediumText),
      semiBold && styles.semiBold,
      regular && styles.regular,
      left && styles.left,
      center && styles.center,
      right && styles.right,
      styles[variant],
      { color },
      style
    );
  }, [
    bold,
    semiBold,
    regular,
    left,
    center,
    right,
    color,
    variant,
    style,
    mediumText,
    light,
  ]);
  return (
    <RNText style={styling} allowFontScaling={false} {...restProps}>
      {children}
    </RNText>
  );
}

DanubeText.propTypes = {
  bold: PropTypes.bool,
  mediumText: PropTypes.bool,
  semiBold: PropTypes.bool,
  regular: PropTypes.bool,
  left: PropTypes.bool,
  right: PropTypes.bool,
  style: PropTypes.object,
};

DanubeText.defaultProps = {
  mediumText: false,
  bold: false,
  left: true,
  variant: TextVariants.Base,
  color: Colors.black,
};

const styles = StyleSheet.create({
  default: {
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },
  arabicDefault: {
    fontFamily: FONT_FAMILY_ARABIC_REGULAR,
  },
  xlarge: {
    fontSize: 34,
  },
  large: {
    fontSize: 26,
  },
  medium: {
    fontSize: 20,
  },
  base: {
    fontSize: 18,
  },
  small: {
    fontSize: 16,
  },
  xsmall: {
    fontSize: 15,
  },
  xxsmall: {
    fontSize: 14,
  },
  xxxsmall: {
    fontSize: 12,
  },
  xxxs11: {
    fontSize: 11,
  },
  xxs13: {
    fontSize: 13,
  },
  bold: {
    fontFamily: 'Roboto-Bold',
  },
  arabicBold: {
    fontFamily: 'Tajawal-Bold',
  },
  light: {
    fontFamily: 'Roboto-Light',
  },
  arabicLight: {
    fontFamily: 'Tajawal-Light',
  },
  mediumText: {
    fontFamily: 'Roboto-Medium',
  },
  arabicMediumText: {
    fontFamily: 'Tajawal-Medium',
  },
  semiBold: {
    fontWeight: '600',
  },
  left: {
    textAlign: 'left',
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
});
