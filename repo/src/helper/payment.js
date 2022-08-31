import digest from 'subtle-digest';
import axios from 'axios';

import hex from 'u8a/to-hex';
import u8a from 'u8a/from-string';
import { logError } from './Global';
import { NativeModules } from 'react-native';
import { restoreCart } from '../screens/MyCart/actions';
const payfortConfig = {
  merchant_identifier: 'MOtDyGit',
  access_code: 'FdjdNx0tOhC9D4PjUiDg',
  sha_type: 'SHA-256',
  sha_request_phrase: '03n7YA5scpyzTru7kSvUo/!*',
  sha_response_phrase: '42T6hMxJ1TWAQZKRFrqpav{-',
};

export async function createHash(string) {
  const digestVal = await new Promise((resolve) => {
    digest('sha-256', u8a(string), function (err, buf) {
      resolve({ hash: hex(new Uint8Array(buf)) });
    });
  });
  return digestVal;
}

function compare(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

export async function generateSignature(passphrase, object) {
  let signatureText = '';
  const keys = Object.keys(object);
  keys.sort(compare);

  keys.forEach((key) => {
    signatureText = `${signatureText}${key}=${object[key]}`;
  });

  const signature = await createHash(passphrase + signatureText + passphrase);

  return signature.hash;
}

export async function getToken({
  number,
  expiry,
  cvc,
  language,
  payfortTokenizationReturnUrl = '',
}) {
  try {
    const [month, year] = expiry.split('/');

    const expiryDate = `${year}${month}`;

    // const returnUrl = `https://us-central1-development-351110.cloudfunctions.net/payfort/tokenization`;
    const returnUrl = payfortTokenizationReturnUrl;
    // const returnUrl = `http://localhost:5001/development-351110/us-central1/payfort/tokenization`;

    const utcTimestamp = new Date().getTime();
    const data = {
      access_code: payfortConfig.access_code,
      card_number: number.replace(/\s/g, ''),
      card_security_code: cvc,
      expiry_date: expiryDate,
      language, // TO DO
      merchant_identifier: payfortConfig.merchant_identifier,
      merchant_reference: utcTimestamp.toString(),
      remember_me: 'YES',
      return_url: returnUrl,
      service_command: 'TOKENIZATION',
    };

    const tokenSignatureData = {
      access_code: payfortConfig.access_code,
      language,
      merchant_identifier: payfortConfig.merchant_identifier,
      merchant_reference: utcTimestamp.toString(),
      return_url: returnUrl,
      service_command: 'TOKENIZATION',
      // device_fingerprint
    };

    data.signature = await generateSignature(
      payfortConfig.sha_request_phrase,
      tokenSignatureData
    );
    const serialize = function (obj) {
      var str = [];
      // if (obj.hasOwnProperty(p)) {
      for (var p in obj) str.push(p + '=' + obj[p]);
      // }
      return str.join('&');
    };

    return { obj: data, formData: serialize(data) };
  } catch (e) {
    logError(e);
    return { error: e };
  }
}

export async function isPaymentCompatible() {
  return '';
}

export async function makePayfortPurchase({
  orderNumber,
  tokenName,
  language = 'en',
  amount,
  currency,
  email,
  customerName,
  payfortPurchaseUrl,
  payfortPurchaseReturnUrl,
}) {
  try {
    const returnUrl = `${payfortPurchaseReturnUrl}`;
    //  const returnUrl = `https://us-central1-development-351110.cloudfunctions.net/payfort/purchase`;
    const formattedAmount = String(amount * 100);
    const data = {
      access_code: payfortConfig.access_code,

      token_name: tokenName,
      language, // TO DO
      merchant_identifier: payfortConfig.merchant_identifier,
      merchant_reference: orderNumber,
      amount: formattedAmount,
      currency,
      return_url: returnUrl,
      command: 'PURCHASE',
      customer_email: email,
      customer_name: customerName,
      // device_fingerprint
    };

    const tokenSignatureData = {
      access_code: payfortConfig.access_code,
      token_name: tokenName,

      language,
      merchant_identifier: payfortConfig.merchant_identifier,
      merchant_reference: orderNumber,
      amount: formattedAmount,
      currency,
      command: 'PURCHASE',
      customer_email: email,
      customer_name: customerName,
      return_url: returnUrl,
    };

    data.signature = await generateSignature(
      payfortConfig.sha_request_phrase,
      tokenSignatureData
    );

    const result = await axios.post(payfortPurchaseUrl, data);

    return result?.data;
  } catch (e) {
    logError(e);
    return { error: e };
  }
}

export const makeApplePayRequest = async (
  data,
  { errorCallback, successCallback }
) => {
  const {
    incrementId = '',
    merchant_identifier,
    merchant_identifier_apple,
    access_code,
    sha_type,
    sha_request_phrase,
    sha_response_phrase,
    amount,
    currencyType,
    language,
    email,
    order_description,
    items,
    countryCode,
  } = data;
  let request = {
    command: 'PURCHASE',
    merchant_identifier, // : 'MOtDyGit', //'merchant.com.aldanube.dehome',
    merchant_identifier_apple, //: 'merchant.com.aldanube.dehome', //'merchant.com.aldanube.dehome',
    access_code, //: 'PNR6AHXFNgDfU6N1hisA',
    sha_type: 'SHA-256',
    sha_request_phrase, // : '42zWbOPqItoc/hf5/4nCyY#}',
    sha_response_phrase, //: '86q2PtPCKKCx0fBBqp87wQ(!',
    merchant_reference: String(incrementId), //'XYZ9239-yu898',
    amount, //: '20000',
    currencyType, // : 'AED',
    countryCode: countryCode,
    language, //: 'en',
    email, // : 'test@payfort.com',
    // testing: true,
    order_description, //: 'iPhone 6-S',
    arrItem: [
      ...items.map((item) => {
        return {
          price: String(item?.row_total * 100),
          productName: String(item?.product?.name),
        };
      }),

      {
        price: amount,
        productName: ` for ${items.length} Item(s)`,
      },
    ],
  };
  try {
    NativeModules.PayFort.PayWithApplePay(
      JSON.stringify(request),
      (response) => {
        successCallback(response);
        console.log('PayWithApplePay success====== ', response);
      },
      async (error) => {
        errorCallback(incrementId);
        console.log('PayWithApplePay error====== ', error);
      }
    );
  } catch (e) {
    logError(e);
    errorCallback(incrementId);
  }
};
