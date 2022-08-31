/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react-native/sort-styles */
/* eslint-disable indent */

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import ScalableText from 'react-native-text';

import { theme } from '../constants';
import { font } from '../constants/theme';

export default class Text extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isArabicLang: false,
    };
  }

  async componentDidMount() {
    this.setState({ isArabicLang: false });
  }

  render() {
    const { isArabicLang } = this.state;
    const {
      h1,
      h2,
      h3,
      heading,
      title,
      body,
      caption,
      header,
      small,
      size,
      transform,
      align,
      // styling
      sfdisplay,
      sftext,
      opensans,
      regular,
      bold,
      semibold,
      medium,
      weight,
      light,
      center,
      right,
      spacing, // letter-spacing
      height, // line-height
      // number of lines
      // colors
      family,
      color,
      accent,
      primary,
      secondary,
      tertiary,
      black,
      white,
      gray,
      gray2,

      warmblack,
      coolblack,
      lightGrey,
      headingLight,
      pureblack,
      style,
      children,
      isArabic,
      ...props
    } = this.props;

    const textStyles = [
      styles.text,
      h1 && styles.h1,
      h2 && styles.h2,
      h3 && styles.h3,
      title && styles.title,
      header && styles.header,
      body && styles.body,
      heading && styles.heading,
      caption && styles.caption,
      small && styles.small,
      size && { fontSize: size },
      transform && { textTransform: transform },
      align && { textAlign: align },

      height && { lineHeight: height },
      spacing && { letterSpacing: spacing },
      weight && { fontWeight: weight },
      semibold && styles.semibold,
      regular && isArabicLang
        ? {
            fontFamily: sfdisplay || sftext ? font.muna : font.times_new_roman,
            fontWeight: 'normal',
          }
        : {
            fontFamily: sfdisplay
              ? font.sf_display_regular
              : sftext
              ? font.sf_text_regular
              : font.roboto_regular,
          },
      bold && isArabicLang
        ? {
            fontFamily: sfdisplay || sftext ? font.muna : font.times_new_roman,
            fontWeight: 'bold',
          }
        : {
            fontFamily: sfdisplay
              ? font.sf_display_bold
              : sftext
              ? font.sf_text_bold
              : font.roboto_bold,
          },
      medium && isArabicLang
        ? {
            fontFamily: sfdisplay || sftext ? font.muna : font.times_new_roman,
            fontWeight: '700',
          }
        : {
            fontFamily: sfdisplay
              ? font.sf_display_medium
              : sftext
              ? font.sf_text_medium
              : font.roboto_medium,
          },
      family && { fontFamily: family },
      light && styles.light,
      center && styles.center,
      right && styles.right,
      color && styles[color],
      color && !styles[color] && { color },
      // color shortcuts
      accent && styles.accent,
      primary && styles.primary,
      secondary && styles.secondary,
      tertiary && styles.tertiary,
      black && styles.black,
      white && styles.white,
      gray && styles.gray,
      lightGrey && styles.lightGrey,
      gray2 && styles.gray2,
      warmblack && styles.warmblack,
      headingLight && styles.headingLight,
      coolblack && styles.coolblack,
      pureblack && styles.pureblack,
      style, // rewrite predefined styles
      isArabic && styles.arabic,
    ];

    return (
      <ScalableText style={textStyles} {...props}>
        {children}
      </ScalableText>
    );
  }
}

const styles = StyleSheet.create({
  // default style
  text: {
    fontSize: theme.sizes.font,
    color: theme.colors.black,
  },
  // variations
  regular: {
    fontFamily: theme.font.roboto_regular,
  },

  bold: {
    fontFamily: theme.font.roboto_bold,
  },
  thin: {
    fontFamily: theme.font.roboto_thin,
  },
  medium: {
    fontFamily: theme.font.roboto_medium,
  },
  light: {
    fontFamily: theme.font.roboto_light,
  },
  // position
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
  // colors
  accent: { color: theme.colors.accent },
  primary: { color: theme.colors.primary },
  secondary: { color: theme.colors.secondary },
  tertiary: { color: theme.colors.tertiary },
  black: { color: theme.colors.black },
  white: { color: theme.colors.white },
  gray: { color: theme.colors.gray },
  gray2: { color: theme.colors.gray2 },
  headingLight: { color: theme.colors.headingLight },
  warmblack: { color: theme.colors.warmblack },
  coolblack: { color: theme.colors.coolblack },
  pureblack: { color: theme.colors.pureblack },
  lightGrey: { color: theme.colors.lightGrey },

  // fonts
  h1: theme.fonts.h1,
  h2: theme.fonts.h2,
  header: theme.fonts.header,
  h3: theme.fonts.h3,
  heading: theme.fonts.heading,
  title: theme.fonts.title,
  body: theme.fonts.body,
  caption: theme.fonts.caption,
  small: theme.fonts.small,
  arabic: { transform: [{ scaleX: -1 }], textAlign: 'right' },
});
