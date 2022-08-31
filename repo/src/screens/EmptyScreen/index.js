import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

import DanubeText, { TextVariants } from '../../components/DanubeText';
import MainButton from '../../components/MainButton';

export default EmptyScreen = ({
  navigation,
  title,
  description,
  buttonLabel,
  headerComponent,
  imageUri,
  icon,
}) => {
  return (
    <View style={styles_.flex}>
      {headerComponent}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {imageUri && (
          <View
            style={{
              height: 200,
              aspectRatio: 1,
              marginBottom: 30,
            }}
          >
            <Image
              source={imageUri}
              style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
            ></Image>
          </View>
        )}
        {icon ? (
          <View style={styles_.iconContainer}>
            <SvgUri uri={icon} />
          </View>
        ) : null}
        <View style={styles_.padding}>
          <DanubeText center mediumText variant={TextVariants.M}>
            {title}
          </DanubeText>
          <DanubeText
            center
            variant={TextVariants.XXS}
            style={styles_.description}
          >
            {description}
          </DanubeText>
        </View>
        <MainButton
          style={styles_.margin}
          label={buttonLabel}
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </View>
  );
};

const styles_ = StyleSheet.create({
  margin: {
    marginHorizontal: 28,
  },
  iconContainer: {
    marginBottom: 45,
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  description: {
    marginTop: 19,
    marginBottom: 50,
  },
  padding: {
    marginHorizontal: 35,
  },
});
