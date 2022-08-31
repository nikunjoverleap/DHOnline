import { Dimensions, Platform } from 'react-native';
import { FONT_FAMILY_ENGLISH_REGULAR, FONT_FAMILY_ARABIC_REGULAR } from '.';

const colors = {
  accent: '#007CC2',
  primary: '#9ACD32',
  red: '#FF0000',
  gray: '#77869E',
  gray2: '#7A7D84',
  gray3: '#aeb7c7',
  gray4: '#f4f6f7',
  gray5: '#ebebeb',
  headingLight: '#F6F7F8',
  secondary: '#00CC79',
  black: '#222222',

  primarydark: '#a5845e',
  tertiary: '#FFE358',
  cancel: '#F9A400',
  white: '#FFFFFF',
  lightGrey: '#77869E',
  warmblack: '#220000',
  coolblack: '#021323',
  pureblack: '#231f20',
  disableGray: '#CECDCD',
  veryLightGray: '#CECECE',
  linkWater: '#BEC8D9',
  whiteSmoke: '#f0f0f0',
  whiteSmoke2: '#f2f2f2',
  whiteSmoke3: '#f5f5f5',
  whiteSmoke4: '#f9f9f9',
  skyBlue: '#80bee1',
  royalBlue: '#2962FF',
  brown: '#c4ac90',
  transparent: 'transparent',
  blue: '#017BC0',
  lightBlue: '#3b5898',

  appThemeColor: {
    red: '#DD1B28',
  },
};
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
var tabHeight = deviceHeight * 0.08;

var screenHeight = deviceHeight - deviceHeight * 0.13;
const sizes = {
  // global sizes
  base: 16,
  font: 14,
  radius: 6,
  padding: 25,
  heading: 15,
  inputHeight: 30,
  // font sizes
  h1: 26,
  h2: 20,
  h3: 18,
  title: 17,
  header: 16,
  body: 14,
  caption: 12,
  small: 10,
};

var isIos = Platform.OS === 'ios' ? true : false;

var font = {
  roboto_light: 'OpenSans-Light',
  roboto_regular: 'OpenSans-Regular',
  roboto_bold: 'OpenSans-Bold',
  roboto_medium: FONT_FAMILY_ENGLISH_REGULAR,
  intro_medium: FONT_FAMILY_ENGLISH_REGULAR,
  intro_bold: 'Lato-Bold',
  intro_regular: FONT_FAMILY_ENGLISH_REGULAR,
  sf_display_regular: 'SFProDisplay-Regular',
  sf_display_medium: 'SFProDisplay-Medium',
  sf_display_bold: 'SFProDisplay-Bold',
  sf_text_regular: 'SFProText-Regular',
  sf_text_medium: 'SFProText-Medium',
  sf_text_bold: 'SFProText-Bold',
  muna: 'Muna',
  times_new_roman: 'Times New Roman',
  times_new_roman_bold: 'SFProText-Bold',
};

var mediumIcon = deviceWidth * 0.05;

var smallIcon = deviceWidth * 0.04;

var largeIcon = deviceWidth * 0.1;
const fonts = {
  h1: {
    fontSize: sizes.h1,
  },
  h2: {
    fontSize: sizes.h2,
  },
  h3: {
    fontSize: sizes.h3,
  },
  header: {
    fontSize: sizes.header,
  },
  heading: {
    fontSize: sizes.heading,
  },
  title: {
    fontSize: sizes.title,
  },
  body: {
    fontSize: sizes.body,
  },
  caption: {
    fontSize: sizes.caption,
  },
  small: {
    fontSize: sizes.small,
  },
};

const arabicInputStyle = (isArabic) => {
  let style = {
    textAlign: isArabic ? 'right' : 'left',
    transform: [{ scaleX: isArabic ? -1 : 1 }],
  };

  return style;
};

export {
  colors,
  sizes,
  fonts,
  font,
  deviceWidth,
  deviceHeight,
  isIos,
  screenHeight,
  tabHeight,
  mediumIcon,
  smallIcon,
  largeIcon,
  arabicInputStyle,
};
