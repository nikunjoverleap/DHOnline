import isEmpty from 'lodash.isempty';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import Block from '../../components/Block';
import DanubeText from '../../components/DanubeText';
import Text from '../../components/Text';
import { FONT_FAMILY_ENGLISH_REGULAR } from '../../constants';
import colors from '../../styles/colors';

export const DeliveryContainer = ({
  typeDataArr,
  onSelectDeliveryType = () => {},
  selectedDeliveryType,
  labelsAndIcons = {},
}) => {
  const {
    successIcon = null,
    homeDelivaryIcon = null,
    noShippingDescription = '',
    clickAndCollectIcon = null,
  } = labelsAndIcons;

  const clickAndCollectExist = typeDataArr?.some(
    (item) => item?.carrier_code === 'mageworxpickup'
  );
  const homeDelveryExist = typeDataArr?.some(
    (item) => item?.carrier_code === 'mageworxpickup'
  );

  return (
    <View style={styles.container}>
      {!isEmpty(typeDataArr) ? (
        typeDataArr?.map((el) => {
          const mainIcon =
            el?.carrier_code === 'tablerate'
              ? homeDelivaryIcon
              : el?.carrier_code === 'mageworxpickup'
              ? clickAndCollectIcon
              : null;
          const selected =
            selectedDeliveryType?.carrier_title === el?.carrier_title;
          if (clickAndCollectExist && homeDelveryExist) {
            return (
              <View
                key={el.method_title}
                style={[
                  styles.main,
                  {
                    backgroundColor: selected ? colors.green : colors.white,
                    borderColor: selected ? colors.green_2 : colors.grey_3,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => onSelectDeliveryType(el)}
                  style={styles.deliveryTypeContainer}
                >
                  <View>
                    {selected ? (
                      <View style={styles.successIcon}>
                        <SvgUri uri={successIcon} />
                      </View>
                    ) : null}
                    <SvgUri uri={mainIcon} />
                  </View>

                  <View style={[styles.titleView]}>
                    <DanubeText style={styles.carierTitle} center mediumText>
                      {el?.carrier_title}
                    </DanubeText>
                    <DanubeText style={styles.methodTitle} center>
                      {el?.method_title}
                    </DanubeText>
                  </View>
                </TouchableOpacity>
              </View>
            );
          } else {
            return null;
          }
        })
      ) : (
        <Block flex={false} width={'100%'} center margin={[23, 0, 0, 0]}>
          <Text style={styles.shippingChargeText}>{noShippingDescription}</Text>
        </Block>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 13,
  },
  main: {
    marginTop: 23,
    marginHorizontal: 3,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#50C0A8',
    paddingVertical: 11.5,
    flex: 1,
  },
  deliveryTypeContainer: {
    alignItems: 'center',
  },
  circleView: {
    borderWidth: 1,
    borderRadius: 9,
    aspectRatio: 1,
    height: 17,
    borderColor: colors.black,
    alignItems: 'center',
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  titleView: {
    justifyContent: 'center',

    paddingLeft: 12.56,
  },
  carierTitle: {
    fontSize: 14,
    paddingBottom: 9,
    paddingTop: 8,
  },
  methodTitle: {
    fontSize: 12,
    paddingHorizontal: 12,
  },
  shippingChargeText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
  },
  successIcon: {
    position: 'absolute',
    zIndex: 1,
    bottom: -4,
    left: 0,
  },
});
