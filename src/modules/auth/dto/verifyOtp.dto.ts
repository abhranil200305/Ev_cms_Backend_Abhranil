export interface VerifySignupOtpDto {
    email: string;
    otp: string;
    firstName: string;
    lastName: string;
    accountType: "User" | "Driver" | "Vehicle Owner";
}

export interface VerifyLoginOtpDto {
    email: string;
    otp: string;
}