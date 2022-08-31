import React from 'react';
import { Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../styles/colors';

export const flagIcon = null;
// <Image
//   // eslint-disable-next-line react-native/no-inline-styles
//   style={{ width: 35, height: 20 }}
//   source={require('../../assets/Images/flag.png')}
// />

export const languageIcon = <Icon name="language" size={30} />;

export const trackIcon = (
  <MaterialCommunityIcons
    name="truck-check-outline"
    size={30}
    color={colors.icon_color}
  />
);

export const cartIcon = (
  <MaterialCommunityIcons name="cart-arrow-down" size={30} />
);
export const arrowLeft = <Icon name="angle-left" size={30} />;

export const earthIcon = (
  <AntDesign name="earth" size={25} color={colors.icon_color} />
);

export const phoneIcon = (
  <Feather name="phone" size={25} color={colors.icon_color} />
);
export const logoutIcon = (
  <Feather name="log-out" size={25} color={colors.icon_color} />
);

export const arrowIcon = (
  <MaterialIcons name="keyboard-arrow-right" size={25} color={colors.black} />
);

export const userIcon = (
  <EvilIcons name="user" size={35} color={colors.icon_color} />
);

export const heartIcon = (
  <AntDesign name="hearto" size={25} color={colors.icon_color} />
);

export const actionData = [
  {
    id: '1',
    label: 'Orders',
    icon: (
      <MaterialCommunityIcons
        name="clipboard-list-outline"
        size={25}
        color={colors.white}
      />
    ),
  },
  {
    id: '2',
    label: 'Return',
    icon: <AntDesign name="CodeSandbox" size={25} color={colors.white} />,
  },
  {
    id: '3',
    label: 'Wallet',
    icon: <Ionicons name="ios-wallet-outline" size={25} color={colors.white} />,
  },
  {
    id: '4',
    label: 'Subscribe Newsletter',
    icon: <Entypo name="bell" size={25} color={colors.white} />,
  },
];
