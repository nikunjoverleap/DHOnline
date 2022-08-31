import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import DanubeText from '../../../components/DanubeText';
import LoginRegisterScreen from '../../LoginRegister/LoginRegisterScreen';
import { useSelector } from 'react-redux';
import colors from '../../../styles/colors';

export default function LogoutView({ label }) {
  const [isSignInModalVisible, setIsSignInModalVisible] = useState(false);
  const toggleSigninModal = () => {
    setIsSignInModalVisible(!isSignInModalVisible);
  };
  const { userToken } = useSelector((state) => state.auth);
  if (userToken) {
    return null;
  }
  return (
    <View style={{ backgroundColor: colors.white, paddingBottom: 33 }}>
      <TouchableOpacity
        onPress={() => setIsSignInModalVisible(true)}
        activeOpacity={0.8}
        style={{
          height: 52,
          backgroundColor: colors.black,
          marginHorizontal: 14,
          borderRadius: 4,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <DanubeText color={colors.white}>{label}</DanubeText>
      </TouchableOpacity>
      {isSignInModalVisible ? (
        <LoginRegisterScreen
          isVisible={isSignInModalVisible}
          toggleSigninModal={toggleSigninModal}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({});
