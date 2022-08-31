/**
 * @format
 */
import { I18nManager } from 'react-native';
import * as RNLocalize from 'react-native-localize';
// import NewRelic from 'newrelic-react-native-agent';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { logInfo } from './src/helper/Global';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

// let appToken;

// if (Platform.OS === 'ios') {
//   appToken = 'AAd10908bc8d09ef5a04f1c1a477c1a32c5eb84b58';
// } else {
//   appToken = 'AA2669cf6f3c219ce75085b906e58b23d50d132d60-NRMA';
// }
// if (!__DEV__) {
//   // NewRelic.startAgent(appToken);
//   // NewRelic.setJSAppVersion('1.0');
// }
// // const lang = await AsyncStorage.getItem('LANGAUGE');
// const locales = RNLocalize.getLocales();
// let globalLanguage = 'en';

// if (['en', 'ar'].includes(locales?.[0]?.languageCode)) {
//   if (locales?.[0]?.languageCode === 'ar') {
//     globalLanguage = 'ar';
//   }
// }
// logInfo('globalLanguage', globalLanguage, !I18nManager.isRTL);
// if (globalLanguage === 'ar' && !I18nManager.isRTL) {
//   I18nManager.allowRTL(true);
//   I18nManager.forceRTL(true);
//   I18nManager.swapLeftAndRightInRTL(true);

//   if (!I18nManager.isRTL) {

//     // RNRestart.Restart();
//   }
// }
AppRegistry.registerComponent(appName, () => App);
