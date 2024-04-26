import qrcode from 'qrcode'
import * as OTPAuth from "otpauth";

const secretSize = 32
const digits = 6
const algorithm = 'SHA1'
const period = 30 // change to 15s, 30s, 60s only work with Google Authenticator, but Microsoft Authenticator only work with 30s

const generateUniqueSecret = () => {
  const secret = new OTPAuth.Secret({
    size: secretSize
  })
  
  return OTPAuth.Secret.fromBase32("hainv").base32
  // return secret.base32 // non, base32, buffer is ok
}

const generateOTPToken = (username, serviceName, secret) => {
  console.log('username', username);
  console.log('serviceName', serviceName);
  console.log('secret', secret);

  const totp = new OTPAuth.TOTP({
    algorithm,
    digits,
    period,
    secret,
    issuer: serviceName,
    label: username,
  })

  const uri = OTPAuth.URI.stringify(totp)
  console.log('uri', uri);
  console.log('uri-convert', OTPAuth.URI.parse(uri));

  return uri
}

const verifyOTPToken = (token, secret) => {
  let totp = new OTPAuth.TOTP({
    algorithm,
    digits,
    period,
    secret
  });
  
  let delta = totp.validate({ token });
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
