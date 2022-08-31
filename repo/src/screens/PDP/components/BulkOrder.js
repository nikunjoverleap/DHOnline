import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import DanubeText, { TextVariants } from '../../../components/DanubeText';
import colors from '../../../styles/colors';

export const BulkOrder = ({ components, sku }) => {
  const { country = '', language = '' } = useSelector((state) => state.auth);
  const dataAndLabels = components?.componentData;
  const links = dataAndLabels?.links?.[country];

  const mapObject = {
    '{country}': country,
    '{language}': language,
    '{sku}': sku,
  };

  const redirectingLink = links?.onPress?.replace(
    /{country}|{language}|{sku}/gi,
    (matched) => mapObject?.[matched]
  );

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.imageContainer}>
          {/* <FastImage
          style={styles.image}
          source={{
            uri: links?.bannerImageLink,
          }}
        /> */}
          <SvgUri uri={links?.bannerImageLink} />
        </View>
        <View style={styles.flex_5}>
          <DanubeText color={colors.white} variant={TextVariants.XXS}>
            {dataAndLabels?.description || ''}
          </DanubeText>
        </View>
        <View style={styles.flex_3}>
          <TouchableOpacity
            style={styles.clickBtn}
            onPress={async () => {
              await InAppBrowser.open(redirectingLink);
            }}
          >
            <DanubeText style={styles.textView}>
              {dataAndLabels?.buttonLabel || ''}
            </DanubeText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textView: {
    fontSize: 13,
    color: colors.black,
  },
  clickBtn: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 0.5,
    borderRadius: 4,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 17,
    paddingVertical: 6,
  },
  flex_3: {
    flex: 3,
    marginRight: 14,
  },
  main: {
    backgroundColor: colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  imageContainer: {
    flex: 1,
    marginLeft: 22,
  },
  image: {
    width: 32,
    height: 34,
    backgroundColor: 'red',
  },
  flex_5: {
    flex: 5,
  },
  container: {
    paddingVertical: 6.5,
    backgroundColor: colors.grey_10,
  },
});
