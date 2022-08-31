import React, { useState } from 'react';
import { Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import StyleSheetFactory from './LogoCallBackSearchHeaderStyle';
import CustomerCare from '../../../assets/svg/CustomerCare.svg';
import Search from '../../../assets/svg/Search.svg';
import { colors } from '../../constants/theme';
import { useSelector } from 'react-redux';
import Block from '../Block';
import { Analytics_Events } from '../../helper/Global';
import { useNavigation } from '@react-navigation/native';
import { CustomerCare as CustomerCareModal } from '../../components/CustomerCare';

function LogoCallBackSearchHeader({
  //  navigation,
  // onPressCustomerCare,
  hideBrandLogo = true,
  // onPressSearchIcon,
  hideCustomerCareLogo = true,
}) {
  let styles = StyleSheetFactory.getSheet();
  const [isCustomerCareModal, setIsCustomerCareModal] = useState(false);
  const { language, country } = useSelector((state) => state.auth);
  const navigation = useNavigation();
  const onPressCustomerCare = () => {
    setIsCustomerCareModal(true),
      Analytics_Events({
        eventName: 'custom_click',
        params: {
          country,
          language,
          cta: 'request_to_callback',
        },
        EventToken: 'rj72e9',
      });
  };
  const onPressSearchIcon = () => {
    navigation.navigate('SearchProduct');
    Analytics_Events({
      eventName: 'custom_click',
      EventToken: 'rj72e9',
      params: {
        country,
        language,
        cta: 'search_icon',
      },
    });
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: colors.white }}>
        <Block flex={false} style={styles.container}>
          {/* { =================== Header logo =================== } */}

          <Block flex={false}>
            {hideBrandLogo && (
              <Image
                style={styles.logo}
                resizeMode="contain"
                source={{
                  uri:
                    language === 'en'
                      ? 'https://danubehome.com/media/logo/stores/1/Online_Logo_01.jpg'
                      : 'https://danubehome.com/media/logo/stores/2/arabic_logo_mob.jpg',
                }}
              />
            )}
          </Block>

          <Block flex={false} style={styles.leftContainer}>
            {/* { =================== Call Back Button =================== } */}
            {hideCustomerCareLogo && (
              <Block flex={false}>
                <TouchableOpacity
                  onPress={onPressCustomerCare}
                  style={styles.btn}
                >
                  <Block flex={false}>
                    <CustomerCare height={23} width={23} />
                  </Block>
                  {/* <Block flex={false}>
                <Text style={styles.btnLabel}>Call Back</Text>
              </Block> */}
                </TouchableOpacity>
              </Block>
            )}

            {/* { Here =================== Search Button =================== } */}
            <Block flex={false}>
              <TouchableOpacity onPress={onPressSearchIcon} style={styles.btn}>
                <Block flex={false}>
                  <Search height={23} width={23} />
                </Block>
                {/* <Block flex={false}>
                <Text style={styles.btnLabel}>Search</Text>
              </Block> */}
              </TouchableOpacity>
            </Block>
          </Block>
        </Block>
      </SafeAreaView>
      <CustomerCareModal
        isVisible={isCustomerCareModal}
        onModalClose={() => setIsCustomerCareModal(false)}
      />
    </>
  );
}
export default LogoCallBackSearchHeader;
