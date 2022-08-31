import React, { useEffect, useState } from 'react';
import Block from '../Block';
import Text from '../Text';
import Modal from 'react-native-modal';
import { colors } from '../../constants/theme';
import { StyleSheet, TouchableOpacity } from 'react-native';
import CloseBlackIcon from '../../../assets/svg/CloseBlackIcon.svg';
import UpArrowIcon from '../../../assets/svg/UpArrowIcon.svg';
import DownArrowIcon from '../../../assets/svg/DownArrowIcon.svg';
import { InputField } from '../InputField';
import { ActionButton } from '../ActionButton';
import { ModalDropdownBox } from '../ModalDropdownBox';
import { useMutation } from '@apollo/client';
import { REQUEST_CALL_BACK } from '../../helper/gql';
import { ErrorTextMesage } from '../ErrorTextMessage';
import {
  Analytics_Events,
  logError,
  mobileNumberReg,
} from '../../helper/Global';

export const CustomerCare = ({ isVisible, onModalClose }) => {
  const [isRequestTypepicker, setIsRequestTypepicker] = useState(false);
  const [requestCallBackdata, setRequestCallBackdata] = useState({
    name: '',
    mobile_number: '',
    request_type: '',
  });

  const requestTypeArr = [
    'Placing New Order',
    'Delivery Related Queries',
    'Product Enquiries',
    'Refund / Credit Note',
    'Order Cancellation',
    'Others',
  ];

  const [requestCallBack] = useMutation(REQUEST_CALL_BACK);
  const [isNameErrVisible, setIsNameErrVisible] = useState(false);
  const [isMobileNumberErrVisible, setIsMobileNumberErrVisible] =
    useState(false);
  const [isRequestTypeErrVisible, setIsRequestTypeErrVisible] = useState(false);
  const [isNumberNotValidErrVisible, setIsNumberNotValidErrVisible] =
    useState(false);
  const [isRequestCallBackErrVisible, setIsRequestCallBackErrVisible] =
    useState(false);
  const [isRequestCallBackSuccessVisible, setIsRequestCallBackSuccessVisible] =
    useState(false);

  const removeAllErrorMessage = async () => {
    setIsNameErrVisible(false);
    setIsMobileNumberErrVisible(false);
    setIsRequestTypeErrVisible(false);
  };

  const onSubmitPress = async () => {
    if (
      !requestCallBackdata?.name ||
      !requestCallBackdata?.mobile_number ||
      !requestCallBackdata?.request_type
    ) {
      if (!requestCallBackdata?.name) {
        setIsNameErrVisible(true);
      }
      if (!requestCallBackdata?.mobile_number) {
        setIsMobileNumberErrVisible(true);
      }
      if (!requestCallBackdata?.request_type) {
        setIsRequestTypeErrVisible(true);
      }
    } else if (isNumberNotValidErrVisible) {
    } else {
      await requestCallBack({
        variables: {
          _name_0: requestCallBackdata?.name,
          _mobile_number_0: requestCallBackdata?.mobile_number,
          _request_type_0: requestCallBackdata?.request_type,
        },
      })
        .then(({ data }) => {
          setIsRequestCallBackSuccessVisible(data?.requestCallBack?.message);
        })
        .catch((error) => {
          logError(error);
        });
    }
    Analytics_Events({
      eventName: 'custom_click',
      params: {
        country,
        language,
        cta: 'request_to_callback_submitted',
        phone: requestCallBackdata?.mobile_number,
        request_type: requestCallBackdata?.request_type,
      },
      EventToken: 'rj72e9',
    });
  };

  const onModalClosePress = () => {
    onModalClose();
    setIsRequestCallBackSuccessVisible(false);
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onModalClosePress}
      onBackButtonPress={onModalClosePress}
      animationIn={'slideInUp'}
      animationOutTiming={500}
      backdropTransitionOutTiming={0}
      hasBackdrop={true}
      backdropOpacity={0.3}
    >
      {/* { =================== Main Block =================== } */}
      <Block
        flex={false}
        color={colors.white}
        radius={7}
        padding={[10, 10, 10, 10]}
      >
        {/* { =================== Closs Button =================== } */}
        <Block flex={false} style={styles.alignItemsFlexEnd}>
          <TouchableOpacity onPress={onModalClosePress}>
            <CloseBlackIcon height={17} width={17} />
          </TouchableOpacity>
        </Block>

        {/* { =================== Request a Callback Label =================== } */}
        <Text size={18} weight={'500'}>
          Request a Callback
        </Text>

        {isRequestCallBackSuccessVisible ? (
          <Block
            flex={false}
            row
            // borderColor={'#6ee06e'}
            borderColor={'lightgray'}
            style={styles.borderWidth1}
            radius={5}
            margin={[30, 10, 20, 10]}
          >
            <Block flex={false} width={5} color={'#6ee06e'} radius={10}></Block>
            <Block flex={false} margin={[10, 10, 10, 10]}>
              <Text color={'#6ee06e'}>{isRequestCallBackSuccessVisible}</Text>
            </Block>
          </Block>
        ) : (
          <>
            {/* { =================== Name Input Field =================== } */}
            <InputField
              containerStyle={styles.nameTextInputStyle}
              placeholder={'Name'}
              onChangeText={(text) => {
                removeAllErrorMessage();
                setRequestCallBackdata({ ...requestCallBackdata, name: text });
              }}
              value={requestCallBackdata?.name}
            />

            {/* { =================== Name Error =================== } */}
            {isNameErrVisible && (
              <Block flex={false} width={'100%'} margin={[0, 7, 0, 7]}>
                <ErrorTextMesage
                  containerStyle={styles.errorTextStyle}
                  errorMessage={'This field is required!'}
                  //   color={'green'}
                />
              </Block>
            )}

            {/* { =================== Mobile Number Input Field =================== } */}
            <Block
              flex={false}
              row
              center
              selfcenter
              margin={[10, 7, 0, 7]}
              style={styles.mobileNumberTextInputBlockStyle}
            >
              <Text size={14} weight={'500'}>
                +971
              </Text>
              <InputField
                containerStyle={styles.flex1}
                isBottomBorder={false}
                placeholder={'Mobile Number'}
                maxLength={9}
                onChangeText={(text) => {
                  removeAllErrorMessage();
                  setIsNumberNotValidErrVisible(true);
                  if (mobileNumberReg.test(text)) {
                    setIsNumberNotValidErrVisible(false);
                  }
                  setRequestCallBackdata({
                    ...requestCallBackdata,
                    mobile_number: text,
                  });
                }}
                value={requestCallBackdata?.mobile_number}
              />
            </Block>

            {/* { =================== Mobile Number Error =================== } */}
            {isMobileNumberErrVisible || isNumberNotValidErrVisible ? (
              <Block flex={false} margin={[0, 7, 0, 7]} width={'100%'}>
                <ErrorTextMesage
                  containerStyle={styles.errorTextStyle}
                  errorMessage={
                    isNumberNotValidErrVisible
                      ? "Please enter a valid 9 Digit UAE mobile number. Don't use a prefix like +971 or 00971 or 0"
                      : 'This field is required!'
                  }
                />
              </Block>
            ) : null}

            {/* { =================== Request Type ModalDropDown =================== } */}
            <Block
              flex={false}
              style={{
                borderBottomWidth: 1,
                borderColor: 'rgba(200,200,200,1)',
              }}
              margin={[10, 7, 0, 7]}
            >
              <ModalDropdownBox
                showsVerticalScrollIndicator={false}
                onSelect={(index) => {
                  removeAllErrorMessage();
                  setRequestCallBackdata({
                    ...requestCallBackdata,
                    request_type: requestTypeArr[index],
                  });
                }}
                renderRightComponent={() =>
                  isRequestTypepicker ? (
                    <UpArrowIcon height={14} width={14} />
                  ) : (
                    <DownArrowIcon height={14} width={14} />
                  )
                }
                style={styles.modalDropDownStyle}
                defaultValue={'Please select request type'}
                textStyle={styles.modalTextStyle}
                onDropdownWillShow={() => {
                  setIsRequestTypepicker(true);
                }}
                onDropdownWillHide={() => {
                  setIsRequestTypepicker(false);
                }}
                dropdownStyle={[styles.dropDownStyle, { height: 150 }]}
                dropdownTextStyle={styles.modalDropDownTextStyle}
                options={requestTypeArr}
              />
            </Block>

            {/* { =================== Request Type Error =================== } */}
            {isRequestTypeErrVisible && (
              <Block flex={false} width={'100%'} margin={[0, 7, 0, 7]}>
                <ErrorTextMesage
                  containerStyle={styles.errorTextStyle}
                  errorMessage={'This field is required!'}
                />
              </Block>
            )}

            {/* { =================== Submit ModalDropDown =================== } */}
            <Block flex={false} margin={[20, 0, 10, 0]}>
              <ActionButton
                label={'SUBMIT'}
                labelStyle={styles.submitButtonLabelStyle}
                buttonStyle={styles.submitButtonContainerStyle}
                onPress={() => onSubmitPress()}
              />
            </Block>
          </>
        )}
      </Block>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalDropDownStyle: {
    width: '100%',
    height: 50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    borderRadius: 7,
  },
  modalTextStyle: {
    width: '95%',
    fontSize: 14,
    color: 'black',
    fontWeight: '500',
  },
  modalDropDownTextStyle: {
    fontSize: 14,
    backgroundColor: colors.white,
    fontWeight: 'bold',
  },
  dropDownStyle: {
    width: '80%',
    backgroundColor: colors.white,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 16,
    borderRadius: 7,
    elevation: 5,
  },
  alignItemsFlexEnd: { alignItems: 'flex-end' },
  borderWidth1: { borderWidth: 1 },
  nameTextInputStyle: { width: '100%', marginTop: 20 },
  errorTextStyle: { width: '100%', marginTop: 5 },
  mobileNumberTextInputBlockStyle: {
    borderBottomWidth: 1,
    borderColor: 'rgba(200,200,200,1)',
  },
  flex1: { flex: 1 },
  submitButtonLabelStyle: {
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
  },
  submitButtonContainerStyle: { backgroundColor: '#000000', width: '100%' },
});
