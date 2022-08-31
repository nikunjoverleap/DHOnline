import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import HeaderCard from '../../../components/HeaderCard';
import SubCard from '../../../components/SubCard';
import { env } from '../../../src/config/env';
import Seperator from './Seperator';

const MyLinks = ({ navigation, myLinkData }) => {
  const { sections = [], myLinksTitle = '' } = myLinkData;
  const { country, language, userToken } = useSelector((state) => state.auth);

  if (!userToken) {
    return null;
  }

  return (
    <>
      <HeaderCard label={myLinksTitle} />
      <View>
        {sections?.map((item, index) => {
          return (
            <View key={item.title}>
              <SubCard
                key={item.id}
                language={language}
                leftLabel={item.title}
                leftIcon={item.icon}
                onPress={() => {
                  navigation.navigate('MY_ACCOUNT_WEB_VIEW', {
                    url: `${env.BASE_URL}${country}/${language}/my-account/${item.id}`,
                  });
                }}
              />
              {sections?.length - 1 !== index ? <Seperator /> : null}
            </View>
          );
        })}
      </View>
      <Seperator bold={true} />
    </>
  );
};

export default MyLinks;
