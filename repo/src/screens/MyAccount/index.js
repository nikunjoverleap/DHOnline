import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import { SCREEN_NAME_MY_ACCOUNT } from '../../constants';

import styles from '../../styles/myAccountScreen';
import Header from './components/Header';
import LoginView from './components/LoginView';
import LogoutView from './components/LogoutView';
import MyLinks from './components/MyLinks';
import ReachToUs from './components/ReachToUs';
import Settings from './components/Settings';
import SignOut from './components/SignOut';
import {
  AUTH_BUTTON,
  HEADER,
  MY_LINKS,
  REACH_TO_US,
  SETTINGS,
  SIGN_OUT,
} from './constants';

const RenderAccountScreenComponents = ({
  componentName,
  navigation,
  components,
}) => {
  const selectedComponent = components?.[componentName] || {};
  const { componentData = {} } = selectedComponent;
  switch (componentName) {
    case MY_LINKS:
      return (
        <MyLinks
          navigation={navigation}
          myLinkData={componentData}
          key={componentName}
        />
      );
    case REACH_TO_US:
      return (
        <ReachToUs
          navigation={navigation}
          reachToUsData={componentData}
          key={componentName}
        />
      );
    case SETTINGS:
      return (
        <Settings
          navigation={navigation}
          settingsData={componentData}
          key={componentName}
        />
      );
    case SIGN_OUT:
      return <SignOut signOutData={componentData} key={componentName} />;
    default:
      return null;
  }
};

const MyAccountScreen = ({ navigation }) => {
  const { screenSettings } = useSelector((state) => state.screens);
  const accountScreenSettingsData = screenSettings?.[SCREEN_NAME_MY_ACCOUNT];
  const headerData =
    accountScreenSettingsData?.components?.[HEADER]?.componentData;
  const authButtonData =
    accountScreenSettingsData?.components?.[AUTH_BUTTON]?.componentData;

  return (
    <SafeAreaView style={styles.safearea}>
      <Header navigation={navigation} label={headerData?.label} />
      <ScrollView style={styles.scrollView} bounces={false}>
        <View style={styles.main}>
          <LoginView navigation={navigation} />
          {/* <Top /> */}
        </View>
        {accountScreenSettingsData?.componentsOrder?.map((componentName) => {
          return (
            <RenderAccountScreenComponents
              key={componentName}
              componentName={componentName}
              navigation={navigation}
              components={accountScreenSettingsData?.components}
            />
          );
        })}
      </ScrollView>
      <LogoutView label={authButtonData?.label} />
    </SafeAreaView>
  );
};

export default MyAccountScreen;
