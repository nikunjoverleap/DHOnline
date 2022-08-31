import {StyleSheet} from 'react-native';
import colors from './colors';
const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  button: {
    backgroundColor: colors.red,
    padding: 25,
    borderRadius: 10,
  },
});
export default styles;
