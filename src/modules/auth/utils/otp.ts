export function generateOtp(): string {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
}

export function otpExpiry(): Date {
    return new Date(
        Date.now() + 5 * 60 * 1000
    );
}