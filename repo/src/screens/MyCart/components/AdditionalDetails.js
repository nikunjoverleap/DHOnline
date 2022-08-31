import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import DanubeText, { TextVariants } from '../../../components/DanubeText';
import colors from '../../../styles/colors';

const AdditionalDetails = ({ additionalData, onClose }) => {
  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <DanubeText
          variant={TextVariants.XXS}
          style={styles.headerLabel}
          color={colors.black_2}
          mediumText
        >
          {additionalData?.header}
        </DanubeText>
        <TouchableOpacity style={styles.close} onPress={onClose}>
          <DanubeText>X</DanubeText>
        </TouchableOpacity>
      </View>
      {additionalData?.subDescriptions?.map((item) => {
        return (
          <View style={styles.subItems} key={item?.id}>
            <View style={styles.dot} />
            <DanubeText style={styles.subDetail}>
              {item?.description}
            </DanubeText>
          </View>
        );
      })}
    </View>
  );
};

export default AdditionalDetails;

const styles = StyleSheet.create({
  main: {
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    marginTop: 9,
    marginRight: 7,
    marginLeft: 15,
    justifyContent: 'space-between',
    marginBottom: 17,
  },
  close: {
    backgroundColor: colors.light_grey,
    minHeight: 30,
    minWidth: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    alignSelf: 'flex-end',
  },
  subItems: {
    flexDirection: 'row',
    marginHorizontal: 14,
    marginBottom: 18,
  },
  dot: {
    height: 3,
    width: 3,
    borderRadius: 1.5,
    backgroundColor: 'black',
    marginRight: 10,
    marginTop: 7,
    marginLeft: 5,
  },
  subDetail: {
    fontSize: 13,
    marginRight: 7,
  },
});
