import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { I18nManager, StyleSheet, TouchableOpacity, View } from 'react-native';
import RNRestart from 'react-native-restart';
import { SvgUri } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import Arrow from '../../../../assets/svg//arrow.svg';
import ArrowForward from '../../../../assets/svg/arrow-forward.svg';
import DanubeText, { TextVariants } from '../../../components/DanubeText';
import HeaderCard from '../../../components/HeaderCard';
import SubCard from '../../../components/SubCard';
import { countryList } from '../../../constants';
import { setLanguage } from '../../../slicers/auth/authSlice';
import colors from '../../../styles/colors';
import Seperator from './Seperator';
import DefaultPreference from 'react-native-default-preference';
const WAIT = 1000;

const Settings = ({ settingsData, navigation }) => {
  const { sections = [], settingsTitle = '' } = settingsData;
  const { country, language } = useSelector((state) => state.auth);
  const flag =
    countryList.find((item) => item.isoCode === country) || countryList[0];
  const dispatch = useDispatch();

  const handleCountryLanguage = () => {
    navigation.navigate('ChooseCountry');
  };

  const handleSwitchLanguage = () => {
    if (language === 'ar') {
      dispatch(setLanguage('en'));
      AsyncStorage.setItem('LANGUAGE', 'en');
      DefaultPreference.set('LANGUAGE', 'en');
      I18nManager.forceRTL(false);
    } else {
      dispatch(setLanguage('ar'));
      AsyncStorage.setItem('LANGUAGE', 'ar');
      DefaultPreference.set('LANGUAGE', 'ar');
      I18nManager.swapLeftAndRightInRTL(true);
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
    setTimeout(() => {
      RNRestart.Restart();
    }, WAIT);
  };

  return (
    <>
      <HeaderCard label={settingsTitle} />
      {sections.map((item, index) => {
        if (item?.type === 'language') {
          return (
            <View key={index}>
              <View
                activeOpacity={0.8}
                style={styles.container}
                key={'language'}
              >
                <View style={styles.left}>
                  <View style={styles.uri}>
                    <SvgUri uri={item.icon} />
                  </View>
                  <View style={styles.leftText}>
                    <DanubeText color={colors.black} variant={TextVariants.XS}>
                      {item.title}
                    </DanubeText>
                  </View>
                  <Arrow width={20} height={20} />
                </View>
                <TouchableOpacity
                  style={styles.langContainer}
                  onPress={handleSwitchLanguage}
                >
                  <View
                    style={[
                      language === 'ar' ? styles.selected : styles.justify,
                    ]}
                  >
                    <DanubeText style={{ fontSize: 13, marginHorizontal: 9 }}>
                      العربية
                    </DanubeText>
                  </View>
                  <View
                    style={[
                      language === 'en' ? styles.selected : styles.justify,
                    ]}
                  >
                    <DanubeText style={{ fontSize: 13, marginHorizontal: 9 }}>
                      English
                    </DanubeText>
                  </View>
                </TouchableOpacity>
              </View>
              {sections.length - 1 !== index ? <Seperator /> : null}
            </View>
          );
        } else if (item?.type === 'country') {
          return (
            <TouchableOpacity
              key={index}
              onPress={handleCountryLanguage}
              activeOpacity={0.8}
            >
              <View
                activeOpacity={0.8}
                style={styles.container}
                key={'country'}
              >
                <View style={styles.left}>
                  <View style={styles.uri}>
                    <SvgUri uri={item.icon} />
                  </View>
                  <View style={styles.leftText}>
                    <DanubeText color={colors.black} variant={TextVariants.XS}>
                      {item.title}
                    </DanubeText>
                  </View>
                  <Arrow width={20} height={20} />
                </View>
                <View style={styles.right}>
                  <View
                    style={[
                      styles.padding,
                      // eslint-disable-next-line no-magic-numbers
                      { transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] },
                    ]}
                  >
                    <ArrowForward height={25} width={25} />
                  </View>
                  <View>
                    <flag.icon width={35} height={35} />
                  </View>
                </View>
              </View>
              {sections.length - 1 !== index ? <Seperator /> : null}
            </TouchableOpacity>
          );
        } else {
          <View key={index}>
            <SubCard
              language={language}
              leftLabel={item.title}
              leftIcon={item.icon}
              onPress={() => {
                navigation.navigate('MY_ACCOUNT_WEB', {
                  url: `${env.BASE_URL}${country}/${language}/my-account/${item.id}`,
                });
              }}
            />
            {sections.length - 1 !== index ? <Seperator /> : null}
          </View>;
        }
      })}
      <Seperator bold={true} />
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: 25,
    paddingVertical: 25,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row-reverse',
  },
  langContainer: {
    flexDirection: 'row-reverse',
    backgroundColor: colors.grey,
    borderRadius: 6,
    padding: 6,
    marginLeft: 17,
  },
  leftText: {
    paddingLeft: 11.55,
  },
  padding: {
    paddingRight: 17,
    justifyContent: 'center',
    paddingLeft: 8,
  },
  rightText: {
    paddingRight: 10,
  },
  uri: {
    paddingLeft: 15,
  },
  selected: {
    backgroundColor: colors.white,
    padding: 4,
  },

  justify: {
    justifyContent: 'center',
  },
});
