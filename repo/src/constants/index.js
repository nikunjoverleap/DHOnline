import * as theme from './theme';
export const SCREEN_NAME_SPLASH = 'SPLASH_SCREEN';
export const SCREEN_NAME_SEARCH = 'Search';

export const SCREEN_NAME_HOME = 'Home Screen';

export const SCREEN_NAME_CATEGORY = 'Category Screen';

export const SCREEN_NAME_CALLUS = 'CallUs';

export const SCREEN_NAME_MY_ACCOUNT = 'My Account Screen';
export const SCREEN_NAME_LANDING_PAGE = 'LandingPage';
export const SCREEN_NAME_PAYMENT_PROCESSING = 'Payment Processing Screen';

export const COMPONENT_NAME_BOTTOM_NAVIGATION = 'Bottom Navigation Footer';
export const COMPONENT_NAME_LOGIN = 'Login';
export const COMPONENT_NAME_REGISTRATION = 'Registration';
export const CROSS_SELL_WIDGET = 'CROSS_SELL_WIDGET';

export const PWA_GUEST_TOKEN_KEY = 'pwa.guest_quote_id';
export const PWA_AUTH_TOKEN_KEY = 'pwa.auth_token';

export const DH_ONLINE_USER_TOKEN = 'DH_ONLINE_USER_TOKEN';
export const DH_ONLINE_PWA_GUEST_TOKEN = 'DH_ONLINE_PWA_GUEST_TOKEN';
export const DH_ONLINE_GUEST_EMAIL = 'DH_ONLINE_GUEST_EMAIL';
export const CLICK_AND_COLLECT_RECEIVER_INFO =
  'CLICK_AND_COLLECT_RECEIVER_INFO';

//SCREENS
export const SCREEN_NAME_MY_CART = 'My Cart';
export const SCREEN_NAME_PLP = 'PLP';
export const SCREEN_NAME_PDP = 'PDP';
export const SCREEN_NAME_LOGIN_AND_REGISTRATION = 'Login And Registration';
export const SCREEN_NAME_WISHLIST = 'Wishlist';
export const SCREEN_NAME_ADDRESS_INPUT = 'Address Input Screen';
export const SCREEN_NAME_CHECKOUT = 'Checkout Screen';
export const SCREEN_NAME_ORDER_CONFIRMATION = 'Order Confirmation';
export const SCREEN_NAME_CLICK_AND_COLLECT = 'Click And Collect';
export const SCREEN_NAME_PAYMENT = 'Payment';

export const LANDED_VIA_DEEPLINK = 'deeplink';
export const LANDED_VIA_UNIVERSAL_LINK = 'universal_link';
export const LANDED_VIA_PUSH_NOTIFICATION = 'push_notification';

//EVENTS

export const EVENT_NAME_SCREEN_VIEW = 'Screen_View';
export const EVENT_NAME_SCREEN_VIEW_COMPLETE = 'Screen_View_Complete';
export const EVENT_NAME_SCREEN_VIEW_ERROR = 'Screen_View_Error';
export const EVENT_NAME_ADD_TO_CART = 'Add_To_Cart';
export const EVENT_NAME_ADD_TO_CART_ERROR = 'Add_To_Cart_Error';
export const EVENT_NAME_LOGIN = 'Login';
export const EVENT_NAME_SIGNUP = 'Signup';
export const EVENT_NAME_VIEW_CART = 'View_Cart';
export const EVENT_NAME_ADD_SHIPPING_INFO = 'Add_shipping_information';
export const EVENT_NAME_ADD_TO_WISHLIST = 'Add_To_Wishlist';
export const EVENT_NAME_ADD_REMOVE_FROM_WISHLIST = 'Remove_From_Wishlist';
export const EVENT_NAME_PURCHASE = 'Purchase';
export const EVENT_NAME_VIEW_PRODUCT_ITEM = 'Product_View_Item';
export const EVENT_NAME_PDP_SHARE = 'Pdp_Share';
export const EVENT_NAME_PREMOVE_FROM_CART = 'Remove_From_Cart';
export const EVENT_NAME_PAYMENT_FAILED = 'Payment_Failed';
export const EVENT_NAME_PAYMENT_USER_ABORTED = 'Payment_User_Aborted';
export const EVENT_NAME_CHECKOUT_OPTION_SELECTED = 'set_checkout_option';
export const EVENT_NAME_CHECKOUT_PAYMENT_FAILURE = 'Checkout_Payment_Failure';
export const EVENT_NAME_CUSTOM_CLICK = 'custom_click';

export const DEFAULT_BRAND = 'Danubehome';
// FONTS
export const FONT_FAMILY_ENGLISH_REGULAR = 'Roboto-Regular';
export const FONT_FAMILY_ARABIC_REGULAR = 'Tajawal-Regular';
export const FONT_FAMILY_ENGLISH_MEDIUM = 'Roboto-Medium';
export const FONT_FAMILY_ARABIC_MEDIUM = 'Tajawal-Medium';

export const STATUS_BAR_COLOR = '#ffffff';
export const STATUS_BAR_COLOR_BLACK = '#000000';
import BhSvg from '../screens/ChooseCountry/bh.svg';
import KwSvg from '../screens/ChooseCountry/kw.svg';
import OmSvg from '../screens/ChooseCountry/om.svg';
import QaSvg from '../screens/ChooseCountry/qa.svg';
import AeSvg from '../screens/ChooseCountry/ae.svg';
import InSvg from '../screens/ChooseCountry/in.svg';
export const countryList = [
  {
    isoCode: 'ae',
    name: 'UAE',
    code: 'ae/en/',
    icon: AeSvg,
    store: 'ae_en',
    pageId: 'UAE Home Page',
    categoryPageID: 'UAE Category Page',
  },
  {
    isoCode: 'bh',
    name: 'Bahrain',
    code: 'bh/en/',
    icon: BhSvg,
    store: 'bh_en',
    pageId: 'BH Home Page',
    categoryPageID: 'BH Category Page',
  },
  {
    isoCode: 'kw',
    name: 'Kuwait',
    code: 'kw/en/',
    icon: KwSvg,
    store: 'kw_en',
    pageId: 'KW Home Page',
    categoryPageID: 'KW Category Page',
  },
  {
    isoCode: 'qa',
    name: 'Qatar',
    code: 'qa/en/',
    icon: QaSvg,
    store: 'qa_en',
    pageId: 'QA Home Page',
    categoryPageID: 'QA Category Page',
  },
  // {
  //   isoCode: 'in',
  //   name: 'India',
  //   code: 'in/en/',
  //   icon: InSvg,
  //   store: 'in_en',
  //   pageId: 'IN Home Page',
  //   categoryPageID: 'IN Category Page',
  // },
];
const GENERIC_ERROR_MESSAGE_ARABIC = 'Something went wrong arabic';
const GENERIC_ERROR_MESSAGE_ENGLISH = 'Something went wrong!';
export const GENERIC_ERROR_MESSAGE = (lang, message) => {
  if (__DEV__ && message) {
    return message;
  }
  if (lang === 'ar') {
    return GENERIC_ERROR_MESSAGE_ARABIC;
  }
  return GENERIC_ERROR_MESSAGE_ENGLISH;
};

export { theme };
