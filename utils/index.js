import otpGenerator from "otp-generator";

const otpGeneratorFnc = (digit) => {
  try {
    const otp = otpGenerator.generate(digit, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    return otp;
  } catch (error) {}
};

export { otpGeneratorFnc };
