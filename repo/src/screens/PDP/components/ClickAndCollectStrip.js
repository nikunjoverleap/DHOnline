import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import DanubeText, { TextVariants } from '../../../components/DanubeText';
import colors from '../../../styles/colors';

export const ClickAndCollectStrip = ({ components }) => {
  const { country = '', language = '' } = useSelector((state) => state.auth);
  const dataAndLabels = components?.componentData;
  const links = dataAndLabels?.links?.[country];

  const mapObject = {
    '{country}': country,
    '{language}': language,
  };

  const redirectingLink = links?.onPress?.replace(
    /{country}|{language}/gi,
    (matched) => mapObject?.[matched]
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.main}
        activeOpacity={0.8}
        onPress={async () => {
          await InAppBrowser.open(redirectingLink);
        }}
      >
        <View style={styles.imageContainer}>
          <SvgUri uri={links?.bannerImageLink} />
        </View>
        <View style={styles.flex_5}>
          <DanubeText color={colors.white} variant={TextVariants.XXS}>
            {dataAndLabels?.description || ''}
          </DanubeText>
        </View>
        <View style={styles.footer}>
          <DanubeText color={colors.grey_14} style={styles.footerText}>
            {dataAndLabels?.footer || ''}
          </DanubeText>
        </View>
      </TouchableOpacity>
    </View>
    // <View style={{ paddingVertical: 8 }}>
    //   <TouchableOpacity
    //     activeOpacity={0.6}
    //     style={styles.imageView}
    //     onPress={async () => {
    //       await InAppBrowser.open(redirectingLink);
    //     }}
    //   >
    //     <Image
    //       style={styles.imageStyle}
    //       source={{
    //         uri: links?.bannerImageLink,
    //       }}
    //       resizeMode="contain"
    //     />
    //   </TouchableOpacity>
    // </View>
  );
};

const styles = StyleSheet.create({
  imageView: {
    width: '100%',
    height: 80,
  },
  imageStyle: {
    height: '100%',
    width: '100%',
  },

  container: {
    backgroundColor: colors.grey_10,
    paddingVertical: 6.5,
  },

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
    paddingVertical: 12,
  },
  imageContainer: {
    marginLeft: 27,
    marginRight: 14,
    justifyContent: 'center',
  },
  image: {
    width: 32,
    height: 34,
    backgroundColor: 'red',
  },
  flex_5: {
    flex: 5,
    justifyContent: 'center',
  },
  footer: {
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
  footerText: {
    fontSize: 9,
  },
});
