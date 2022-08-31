import PropTypes from 'prop-types';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const HEIGHT = 15;

const KeyBoardAwareView = ({ children }) => {
  const insets = useSafeAreaInsets();
  const extraScrollHeight = insets.bottom - HEIGHT;
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={Platform.OS === 'ios' ? -extraScrollHeight : 0}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

export default KeyBoardAwareView;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

KeyBoardAwareView.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

KeyBoardAwareView.defaultProps = {
  children: null,
};
