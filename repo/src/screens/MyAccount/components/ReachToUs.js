import React from 'react';
import { View } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { useSelector } from 'react-redux';
import HeaderCard from '../../../components/HeaderCard';
import SubCard from '../../../components/SubCard';
import { env } from '../../../src/config/env';
import Seperator from './Seperator';

const ReachToUs = ({ reachToUsData }) => {
  const { sections = [], reachToUsTitle = '' } = reachToUsData;
  const { country, language } = useSelector((state) => state.auth);
  return (
    <>
      <HeaderCard label={reachToUsTitle} />
      <View>
        {sections.map((item, index) => {
          return (
            <View key={item.id}>
              <SubCard
                language={language}
                leftLabel={item.title}
                leftIcon={item.icon}
                onPress={async () => {
                  await InAppBrowser.open(
                    `${env.BASE_URL}${country}/${language}/${item.id}`
                  );
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

export default ReachToUs;
