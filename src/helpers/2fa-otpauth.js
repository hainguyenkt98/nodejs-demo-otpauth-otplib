import qrcode from 'qrcode'
import * as OTPAuth from "otpauth";

const generateUniqueSecret = () => {
  const secret = new OTPAuth.Secret({
    size: 32
  })
  
  return OTPAuth.Secret.fromBase32("hainv").base32
  // return secret.base32 // non, base32, buffer is ok
}

const generateOTPToken = (username, serviceName, secret) => {
  console.log('username', username);
  console.log('serviceName', serviceName);
  console.log('secret', secret);

  const totp = new OTPAuth.TOTP({
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: secret,
    issuer: serviceName,
    label: username,
  })

  const uri = totp.toString()
  console.log('uri', uri);

  return uri
}

const verifyOTPToken = (token, secret) => {
  let totp = new OTPAuth.TOTP({
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: secret
  });
  
  let delta = totp.validate({ token, window: 1 });
  console.log('delta', delta);

  return delta !== null;
}

const generateQRCode = async (otpAuth) => {
  try {
    const QRCodeImageUrl = await qrcode.toDataURL(otpAuth)
    return QRCodeImageUrl
  } catch (error) {
    console.log('Could not generate QR code', error)
    return
  }
}

export {
  generateUniqueSecret,
  verifyOTPToken,
  generateOTPToken,
  generateQRCode,
}
