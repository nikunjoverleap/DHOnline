import React from 'react';
import { useSelector } from 'react-redux';
import {
  Linking,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  SCREEN_NAME_CATEGORY,
  SCREEN_NAME_HOME,
  SCREEN_NAME_MY_ACCOUNT,
  SCREEN_NAME_MY_CART,
  SCREEN_NAME_CALLUS,
  SCREEN_NAME_WISHLIST,
  FONT_FAMILY_ENGLISH_REGULAR,
  FONT_FAMILY_ARABIC_REGULAR,
} from '../../constants';

import HomeScreen from '../../screens/Home/HomeScreen';
import CategoriesScreen from '../../screens/Categories/CategoriesScreen';
import MyCartScreen from '../../screens/MyCart/index';
import WishListScreen from '../../screens/WishList/WishlistScreen';

//Header

//svg
import HomeSvg from '../../../assets/svg/Home.svg';
import Home_Selected from '../../../assets/svg/Home_Selected.svg';

import Categories from '../../../assets/svg/Categories.svg';
import Categories_Selected from '../../../assets/svg/Categories_Selected.svg';

import Call from '../../../assets/svg/Call.svg';
import Call_Selected from '../../../assets/svg/Call_Selected.svg';

import Profile from '../../../assets/svg/Profile.svg';
import Profile_Selected from '../../../assets/svg/Profile_Selected.svg';

import Cart from '../../../assets/svg/Cart.svg';
import Cart_Selected from '../../../assets/svg/Cart_Selected.svg';
import WishlistIcon from '../../../assets/svg/Wishlist.svg';
import WishlistSelectedIcon from '../../../assets/svg/WishlistSelected.svg';

import Block from '../Block';
import { colors } from '../../constants/theme';
import { Badge } from 'react-native-paper';
import MyAccountScreen from '../../screens/MyAccount/index.js';
import { Analytics_Events } from '../../helper/Global';

const Tab = createBottomTabNavigator();
const bottomScreens = {
  [SCREEN_NAME_HOME]: HomeScreen,
  [SCREEN_NAME_CATEGORY]: CategoriesScreen,
  [SCREEN_NAME_MY_ACCOUNT]: MyAccountScreen,
  [SCREEN_NAME_MY_CART]: MyCartScreen,
  [SCREEN_NAME_WISHLIST]: WishListScreen,
};
const openDialScreen = () => {
  let number = '';
  if (Platform.OS === 'ios') {
    number = 'telprompt:${8003131}';
  } else {
    number = 'tel:${8003131}';
  }

  Linking.openURL(number);
};
function CustomTab({ state, navigation, screenArr }) {
  const { cartItems } = useSelector((state) => state.cart);
  const { language, country } = useSelector((state) => state.auth);
  const sumOfCartItem = cartItems?.cartData?.items.reduce(
    (total, currentValue) => (total = total + currentValue?.qty),
    0
  );
  const { wishlistProductList } = useSelector((state) => state.wishlist);
  return (
    <SafeAreaView style={{ backgroundColor: colors.white }}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: colors.white,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 15,
          paddingBottom: 10,
          height: 70,
          borderTopWidth: 0.2,
          borderStyle: 'solid',
          borderColor: '#00000029',
        }}
      >
        {state.routes.map((route, index) => {
          //  const { options } = descriptors[route.key];
          const label = route.name;
          // options.tabBarLabel !== undefined
          //   ? options.tabBarLabel
          //   : options.title !== undefined
          //   ? options.title
          //   : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            if (screenArr[index]?.component === SCREEN_NAME_CALLUS) {
              openDialScreen();
            } else {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
              });

              if (!isFocused && !event.defaultPrevented) {
                const currentState = navigation.getState();
                navigation.navigate(route.name, {
                  params: {
                    previous_screen:
                      currentState?.routeNames?.[currentState?.index],
                  },
                });
              }
            }
            if (screenArr[index]?.component === SCREEN_NAME_CATEGORY) {
              Analytics_Events({
                eventName: 'custom_click',
                EventToken: 'rj72e9',
                params: {
                  country,
                  language,
                  cta: 'tab',
                  content: 'Furniture',
                },
              });
            }
          };
          const bottomIconWidth = 20;
          const bottomIconheight = 20;
          return (
            <TouchableOpacity
              key={route?.name}
              accessibilityRole="button"
              onPress={onPress}
              style={{ flex: 1, alignItems: 'center' }}
            >
              <Block margin={[0, 0, 0, 0]} style={{}}>
                {screenArr[index]?.component === SCREEN_NAME_HOME ? (
                  isFocused ? (
                    <Home_Selected width={37} height={24} />
                  ) : (
                    <HomeSvg width={37} height={24} />
                  )
                ) : screenArr[index]?.component === SCREEN_NAME_CATEGORY ? (
                  isFocused ? (
                    <Categories_Selected width={21} height={21} />
                  ) : (
                    <Categories width={21} height={21} />
                  )
                ) : screenArr[index]?.component === SCREEN_NAME_CALLUS ? (
                  isFocused ? (
                    <Call_Selected
                      width={bottomIconWidth}
                      height={bottomIconheight}
                    />
                  ) : (
                    <Call width={bottomIconWidth} height={bottomIconheight} />
                  )
                ) : screenArr[index]?.component === SCREEN_NAME_MY_ACCOUNT ? (
                  isFocused ? (
                    <Profile_Selected width={26} height={26} />
                  ) : (
                    <Profile width={26} height={26} />
                  )
                ) : screenArr[index]?.component === SCREEN_NAME_MY_CART ? (
                  isFocused ? (
                    <>
                      {cartItems?.cartData?.items?.length ? (
                        <Badge
                          size={16}
                          style={{
                            fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
                            backgroundColor: '#D12E27',
                            position: 'absolute',
                            left: 18,
                            bottom: 18,
                          }}
                        >
                          {sumOfCartItem}
                        </Badge>
                      ) : null}
                      <Cart_Selected width={24} height={24} />
                    </>
                  ) : (
                    <>
                      {cartItems?.cartData?.items?.length ? (
                        <Badge
                          size={16}
                          style={{
                            fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
                            backgroundColor: '#D12E27',
                            position: 'absolute',
                            left: 18,
                            bottom: 18,
                          }}
                        >
                          {sumOfCartItem}
                        </Badge>
                      ) : null}
                      <Cart width={24} height={24} />
                    </>
                  )
                ) : screenArr[index]?.component === SCREEN_NAME_WISHLIST ? (
                  isFocused ? (
                    <>
                      <WishlistSelectedIcon width={24} height={21} />
                      {wishlistProductList?.length ? (
                        <Badge
                          size={16}
                          style={{
                            fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
                            backgroundColor: '#D12E27',
                            position: 'absolute',
                            left: 18,
                            bottom: 18,
                          }}
                        >
                          {wishlistProductList?.length}
                        </Badge>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <WishlistIcon width={24} height={21} />
                      {wishlistProductList?.length ? (
                        <Badge
                          size={16}
                          style={{
                            fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
                            backgroundColor: '#D12E27',
                            position: 'absolute',
                            left: 18,
                            bottom: 18,
                          }}
                        >
                          {wishlistProductList?.length}
                        </Badge>
                      ) : null}
                    </>
                  )
                ) : null}
              </Block>
              <Text
                style={{
                  color: isFocused ? '#DD1B28' : '#949494',
                  marginBottom: 0,
                  lineHeight: 13,
                  fontSize: 13,
                  marginTop: 8,
                  fontFamily:
                    language === 'ar'
                      ? FONT_FAMILY_ARABIC_REGULAR
                      : FONT_FAMILY_ENGLISH_REGULAR,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
const BottomTabs = () => {
  const { screenSettings } = useSelector((state) => state.screens);

  const homeScreen = screenSettings[SCREEN_NAME_HOME];

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <CustomTab
          {...props}
          screenArr={homeScreen?.bottomNavigations?.componentData?.tabs}
        />
      )}
    >
      {homeScreen?.bottomNavigations?.componentData?.tabs?.map((tab) => {
        return (
          <Tab.Screen
            key={tab?.label}
            name={tab?.label}
            component={bottomScreens[tab.component] || HomeScreen}
          />
        );
      })}
    </Tab.Navigator>
  );
};
export default BottomTabs;
