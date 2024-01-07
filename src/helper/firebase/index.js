import axios from "axios";
let base_url = import.meta.env.VITE_base_url;
let otp_API = import.meta.env.EDUMARC_OTP_API;
let template_Id = import.meta.env.BSNL_TEMPLATE_ID;

// import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_apiKey,
//   authDomain: import.meta.env.VITE_authDomain,
//   projectId: import.meta.env.VITE_projectId,
//   storageBucket: import.meta.env.VITE_storageBucket,
//   messagingSenderId: import.meta.env.VITE_messagingSenderId,
//   appId: import.meta.env.VITE_appId,
//   measurementId: import.meta.env.VITE_measurementId,
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// const generateRecaptcha = () => {
//   window.recaptchaVerifier = new RecaptchaVerifier(auth, "capchabox", {
//     size: "invisible",
//     callback: () => {},
//   });
// };

// export const sendOTP = async (number) => {
//   try {
//     generateRecaptcha();
//     let result = await signInWithPhoneNumber(
//       auth,
//       `+${number}`,
//       window.recaptchaVerifier
//     );
//     window.confirmationResult = result;
//     return true;
//   } catch (err) {
//     if (err.message === "reCAPTCHA has already been rendered in this element") {
//       return "already sended";
//     }
//     return false;
//   }
// };

// export const verifyOTP = async (code) => {
//   try {
//     let confirmationResult = window.confirmationResult;
//     await confirmationResult.confirm(code);
//     return {
//       status: true,
//     };
//   } catch (err) {
//     if (err.code === "auth/code-expired") {
//       console.log(err);
//       return {
//         status: false,
//         message:
//           "The OTP has expired. Please refresh the page and generate a new OTP",
//       };
//     } else if (err.code === "auth/invalid-verification-code") {
//       return {
//         status: false,
//         message: "The verification code entered is not valid.",
//       };
//     } else {
//       return {
//         status: false,
//         message: "Something went wrong",
//       };
//     }
//   }
// };

//=====================================================================================

export const sendOTP = async (number) => {
  const url = "https://smsapi.edumarcsms.com/api/v1/sendsms";
  const headers = {
    apikey: "cleb7v3l30006crtn6x2zbb0l",
    "Content-Type": "application/json",
  };
  const value = `${Math.floor(100000 + Math.random() * 1000000)}`;
  const data = {
    number: [number],
    message: `OTP TO LOGIN YOUR BROMAG INDIA ACCOUNT IS ${value} .DON'T SHARE THIS OTP WITH ANYONE FOR SECURITY REASONS.`,
    senderId: "BROMAG",
    templateId: "1407170435158041375",
  };

  try {
    const response = await axios.post(url, data, { headers });
    if (response.data.success) {
      return {
        status: true,
        transactionId: response?.data?.data?.transactionId,
      };
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

export const verifyOTP = async (transactionId) => {
  try {
    const response = await axios.get(`${base_url}/verify-sms/${transactionId}`);
    if (response?.data?.status) {
      return {
        status: true,
      };
    } else {
      return {
        status: false,
        message:
          "The OTP has expired. Please refresh the page and generate a new OTP",
      };
    } 
  } catch (err) {
    return {
      status: false,
      message:
        "The verification code entered is not valid. Please refresh the page and generate a new OTP",
    };
  }
};
