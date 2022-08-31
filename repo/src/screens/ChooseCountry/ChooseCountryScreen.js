import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { countryList, EVENT_NAME_SCREEN_VIEW } from '../../constants';
import { Analytics_Events } from '../../helper/Global';
import { setCountry } from '../../slicers/auth/authSlice';

export default ChooseCountryScreen = (props) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const { language, country } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    Analytics_Events({
      eventName: EVENT_NAME_SCREEN_VIEW,
      params: {
        screen_name: 'ChooseCountry',
        country,
        language,
        previous_screen: '',
        landed_from_url: '',
        landed_from_push_notification: '',
        is_deferred_deeplink: '',
      },
      EventToken: 'qbj2pa',
    });
  }, []);

  const handleCountryData = async ({ countryFound }) => {
    try {
      let newAppEnabled = false;
      try {
        let remoteConfig = await AsyncStorage.getItem('remoteConfig');
        remoteConfig = JSON.parse(remoteConfig);
        if (remoteConfig.new_app_enabled === '1') {
          newAppEnabled = true;
        }
      } catch (e) {
        logError(e);
      }
      if (newAppEnabled) {
        await AsyncStorage.setItem('countryCode', countryFound?.isoCode);
        dispatch(setCountry(countryFound?.isoCode));
        props.navigation.reset({
          index: 0,
          routes: [{ name: 'App' }],
        });
      } else {
        setTimeout(() => {
          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: 'OldHomeScreen',
                params: {
                  countryCode: countryFound.code,
                  footer: props.route.params.footer,
                  store: country.store,
                },
              },
            ],
          });
        }, 150);
      }
    } catch (e) {}
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <StatusBar
          animated={true}
          backgroundColor="#fff"
          barStyle={'dark-content'}
        />
        <View>
          <Text
            style={{
              fontSize: 25,
              fontWeight: '400',
              paddingBottom: 25,
              color: '#000',
            }}
          >
            Select your country
          </Text>
        </View>
        {countryList.map((country) => {
          return (
            <TouchableWithoutFeedback
              key={country?.name}
              onPress={async () => {
                setSelectedCountry(country.isoCode);
                dispatch(setCountry(country.isoCode));

                handleCountryData({ countryFound: country });
                Analytics_Events({
                  eventName: 'Choose_Country',
                  params: {
                    screen_name: 'ChooseCountry',
                    country,
                    language,
                  },
                  EventToken: '9i13vp',
                });
              }}
            >
              <View style={[styles.main]}>
                <View style={{ paddingLeft: 10, paddingRight: 30 }}>
                  <country.icon width={35} height={35} />
                </View>
                <View>
                  <Text style={{ color: '#0009', fontSize: 18 }}>
                    {country.name}
                  </Text>
                </View>
                {selectedCountry === country.isoCode ? (
                  <View style={styles.iso}>
                    <ActivityIndicator size="large" color="#B00009" />
                  </View>
                ) : null}
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    // eslint-disable-next-line no-magic-numbers
    width: Dimensions.get('window').width - 110,
    height: 55,
    borderRadius: 6,
    marginBottom: 15,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#f3f1ed',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#0004',
    position: 'relative',
  },
  iso: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width - 110,
    height: 55,
    borderRadius: 6,
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
});
