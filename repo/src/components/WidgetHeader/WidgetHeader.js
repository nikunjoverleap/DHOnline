import * as React from 'react';
import { Text } from 'react-native';
import StyleSheetFactory from './WidgetHeaderStyle';
import Timer from '../Timer';

import { useSelector } from 'react-redux';
import Block from '../Block';

function WidgetHeader({ title, expiryTimestamp }) {
  const { language, country } = useSelector((state) => state.auth);
  let styles = StyleSheetFactory.getSheet(language);

  return (
    <Block style={styles.headerRow}>
      <Block>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </Block>
      {expiryTimestamp ? <Timer expiryTimestamp={expiryTimestamp} /> : null}
    </Block>
  );
}
export default WidgetHeader;
