import Toast from 'react-native-toast-message';

const useApiErrorsHandler = () => {
  return (error = {}) => {
    Toast.show({
      text1: error.message,
      type: 'error',
    });
  };
};

export default useApiErrorsHandler;
