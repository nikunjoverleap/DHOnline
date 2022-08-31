import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { I18nManager, ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import DanubeText, { TextVariants } from '../../../components/DanubeText';
import RoundIconWithLabel from '../../../components/RoundIconWithLabel';
import { SCREEN_NAME_MY_ACCOUNT } from '../../../constants';
import { logError } from '../../../helper/Global';
import { env } from '../../../src/config/env';
import colors from '../../../styles/colors';

const LoginView = ({ navigation }) => {
  const {
    userToken,
    userProfile = {},
    country,
    language,
  } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(userProfile);
  const { customer = {} } = profile || {};
  const { screenSettings } = useSelector((state) => state.screens);
  const accountScreenSettings = screenSettings?.[SCREEN_NAME_MY_ACCOUNT];
  const data = accountScreenSettings?.components?.CUSTOMER_INFO?.componentData;

  const getProfile = async () => {
    try {
      const data = await AsyncStorage.getItem('UserProfile');
      const userProfile = JSON.parse(data);
      setProfile(userProfile);
    } catch (error) {
      logError(error);
      // TODO: error handling
    }
  };

  useEffect(() => {
    getProfile();
  }, [userProfile]);

  if (!userToken) {
    return null;
  }

  return (
    <>
      <View style={styles.header}>
        <View style={styles.center}>
          <DanubeText
            bold
            variant={TextVariants.S}
            color={colors.black}
            style={styles.margin}
          >
            {data?.addressingCustomer?.replace(
              '{customerName}',
              customer?.firstname || ''
            )}
          </DanubeText>
          <View style={styles.padding}>
            <DanubeText variant={TextVariants.XS} color={colors.black}>
              {customer?.email || ''}
            </DanubeText>
          </View>
        </View>
        <ScrollView horizontal contentContainerStyle={styles.flexDirection}>
          {data.sections.map((item) => {
            return (
              <RoundIconWithLabel
                label={item.title}
                key={item.id}
                icon={item.icon}
                onPress={() => {
                  // if (item?.id === 'my-orders') {
                  //   navigation.navigate('MyOrders');
                  // }
                  navigation.navigate('MY_ACCOUNT_WEB_VIEW', {
                    url: `${env.BASE_URL}${country}/${language}/my-account/${item.id}`,
                  });
                }}
              />
            );
          })}
        </ScrollView>
      </View>
    </>
  );
};

export default LoginView;

const styles = StyleSheet.create({
  flexDirection: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  header: {
    backgroundColor: '#F6F6F8',
    marginTop: 2,
  },
  center: {
    alignItems: 'center',
  },
  padding: {
    paddingBottom: 22.5,
  },
  margin: {
    marginBottom: 12,
  },
});
