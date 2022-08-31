import { StyleSheet } from 'react-native';
import colors from './colors';
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  main: {
    backgroundColor: colors.white_2,
  },
  header: {
    backgroundColor: '#333333',
    paddingTop: 10,
    paddingLeft: 15,
  },
  flexDirection: {
    flexDirection: 'row',
  },
  scrollView: {
    backgroundColor: colors.white,
  },
  safearea: {
    flex: 1,
    backgroundColor: colors.white_2,
  },
});
export default styles;
