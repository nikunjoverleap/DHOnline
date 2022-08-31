import React, { useState } from 'react';
import { StyleSheet, View, I18nManager } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { SvgUri } from 'react-native-svg';
import Icon from '../../../../assets/svg/down_arrow.svg';
import Arrow from '../../../../assets/svg/pay_arrow.svg';
import DanubeText, { TextVariants } from '../../../components/DanubeText';
import { espTransform } from '../../../components/PriceFormatFunction';
import { rotateIcon } from '../../../helper/Global';
import colors from '../../../styles/colors';
const SECTIONS = [
  {
    id: 0,
  },
];

const PayCard = ({
  icon = null,
  label,
  subLabel,
  devidedAmount,
  currencyCode,
  color,
  steps,
  footer,
}) => {
  const [activeSections, setActiveSections] = useState([]);
  const correctedAmount = `${espTransform(devidedAmount || 0)}`;

  const amoutWithCountryCode = `${currencyCode} ${correctedAmount}`;

  const _renderHeader = (props) => {
    const expanded = activeSections?.some((res) => res === props.id);

    return (
      <>
        <View
          style={[
            styles.header,
            { borderColor: color },
            !expanded ? styles.notExpanded : styles.expanded,
          ]}
        >
          <View style={styles.center}>
            <DanubeText
              color={colors.black_3}
              variant={TextVariants.XXS}
              mediumText
            >
              {label?.replace('${amount}', amoutWithCountryCode)}
            </DanubeText>
            <DanubeText
              color={colors.grey_5}
              variant={TextVariants.XXXS}
              style={styles.subLabel}
            >
              {subLabel}
            </DanubeText>
          </View>
          <View>
            {expanded ? (
              <Icon />
            ) : (
              <View style={rotateIcon}>
                <Arrow />
              </View>
            )}
          </View>
        </View>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
      </>
    );
  };

  const _renderContent = () => {
    return (
      <View style={[styles.content, { borderColor: color }]}>
        <View style={[styles.iconsContainer]}>
          <View style={[styles.icons, { backgroundColor: color }]}>
            <View style={styles.text}>
              <DanubeText
                style={styles.width}
                center
                variant={TextVariants.XXXS}
              >
                {steps?.[0]?.description}
              </DanubeText>
            </View>
            <SvgUri uri={steps?.[0]?.icon} />
          </View>
          <View style={[styles.line, { backgroundColor: color }]} />
          <View style={[styles.icons, { backgroundColor: color }]}>
            <View style={styles.text}>
              <DanubeText
                style={styles.width}
                center
                variant={TextVariants.XXXS}
              >
                {steps?.[1]?.description}
              </DanubeText>
            </View>
            <SvgUri uri={steps?.[1]?.icon} />
          </View>
          <View style={[styles.line, { backgroundColor: color }]} />
          <View style={[styles.icons, { backgroundColor: color }]}>
            <View style={styles.text}>
              <DanubeText
                style={styles.width}
                center
                variant={TextVariants.XXXS}
              >
                {steps?.[2]?.description}
              </DanubeText>
            </View>
            <SvgUri uri={steps?.[2]?.icon} />
          </View>
        </View>
        <DanubeText style={styles.footer}>{footer}</DanubeText>
      </View>
    );
  };

  const _updateSections = (activeSections) => {
    setActiveSections(activeSections);
  };

  return (
    <Accordion
      underlayColor={colors.white}
      touchableProps={{ aciveOpacity: 0.8 }}
      sections={SECTIONS}
      activeSections={activeSections}
      renderHeader={_renderHeader}
      renderContent={_renderContent}
      onChange={_updateSections}
    />
  );
};
export default PayCard;

const styles = StyleSheet.create({
  content: {
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
  },
  width: {
    width: 70,
  },
  line: {
    width: 82,
    height: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  subLabel: {
    marginTop: 3,
  },
  icon: {
    position: 'absolute',
    top: -7,
    left: 10,
  },
  iconsContainer: {
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icons: {
    width: 49,
    height: 49,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    position: 'absolute',
    top: 52,
  },
  footer: {
    fontSize: 11,
    marginTop: 60,
    marginBottom: 10,
    marginHorizontal: 11,
  },
  notExpanded: {
    borderWidth: 1,
    borderRadius: 4,
  },
  expanded: {
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
  },
  center: {
    justifyContent: 'center',
  },
});
