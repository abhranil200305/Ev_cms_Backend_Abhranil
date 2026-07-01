export interface SendOtpRequest {
  email: string;
}

export interface VerifySignupOtpRequest {
  email: string;
  otp: string;
  firstName: string;
  lastName: string;
  accountType: "User" | "Driver" | "Vehicle Owner";
}

export interface VerifyLoginOtpRequest {
  email: string;
  otp: string;
}

export interface JwtPayload {
  id: string;
  userUid: string;
  email: string;
  accountType: string;
}