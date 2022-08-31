import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import Block from '../../../components/Block';
import { Divider } from '../../../components/Divider';
import Text from '../../../components/Text';
import { FONT_FAMILY_ENGLISH_REGULAR } from '../../../constants';
import colors from '../../../styles/colors';

const renderProductOptionsList = (
  item,
  index,
  fields,
  specialPrice,
  optionList
) => {
  const options = fields?.find(
    (fieldValue) => fieldValue?.field_id === item?.condition?.key
  );
  const value = options?.value;

  if (item?.condition?.key === 'is_returnable' && value === 0) {
    return null;
  }

  if (
    item?.condition?.key === 'emi_available' &&
    item?.condition?.threshold < specialPrice
  ) {
    return null;
  }

  return (
    <Block
      flex={false}
      color={colors.white}
      padding={[5, 0, 0, 0]}
      key={index + item.title}
    >
      <Block flex={false} row center>
        <Block flex={false} width={30} height={30}>
          <SvgUri width="100%" height="100%" uri={item?.icon} />
        </Block>

        {item?.condition?.key === 'installation_type' ? (
          <Text style={styles.optionTitleText}>{options?.value || ''}</Text>
        ) : (
          <Text style={styles.optionTitleText}>{item?.title}</Text>
        )}
      </Block>
      {index === optionList?.length - 1 ? null : <Divider />}
    </Block>
  );
};

function ProductOptionsDetails({ components, productData }) {
  const specialPrice =
    productData?.getProductDetailForMobile?.selectedPrice?.specialPrice;

  const { country } = useSelector((state) => state.auth);
  const [optionList, setOptionList] = useState(
    components?.componentData?.usps?.[country]
  );

  const fields = productData?.getProductDetailForMobile?.otherFields;

  useEffect(() => {
    let filterOptionList = components?.componentData?.usps?.[country]?.filter(
      (item) => {
        return item?.condition?.value === true;
      }
    );
    setOptionList(filterOptionList);
  }, []);

  return (
    <>
      {components?.config?.showPDPUSP?.value === true && (
        <Block
          flex={false}
          padding={[15, 15]}
          margin={[6.5, 0, 6.5, 0]}
          color={'white'}
        >
          {optionList?.map((item, index) => {
            return renderProductOptionsList(
              item,
              index,
              fields,
              specialPrice,
              optionList
            );
          })}
        </Block>
      )}
    </>
  );
}
export default ProductOptionsDetails;

const styles = StyleSheet.create({
  optionTitleText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_ENGLISH_REGULAR,
    color: '#424242',
    marginLeft: 10,
  },
});
