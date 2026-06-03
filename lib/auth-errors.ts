/** User-facing messages for auth / OTP API errors */
export function getOtpErrorMessage(
  error: unknown,
  fallback = "Invalid OTP. Please try again."
): string {
  const err = error as {
    message?: string;
    response?: { data?: { message?: string } };
  };

  const raw =
    err?.response?.data?.message?.trim() ||
    err?.message?.trim() ||
    "";

  if (/invalid otp/i.test(raw)) {
    return "Invalid OTP. Please try again.";
  }
  if (/otp expired/i.test(raw)) {
    return "OTP has expired. Please request a new code.";
  }
  if (/otp not found/i.test(raw)) {
    return "OTP expired or not found. Please request a new code.";
  }
  if (
    raw &&
    !raw.includes("API Error") &&
    !raw.includes("Failed to fetch") &&
    !raw.includes("Internal server error")
  ) {
    return raw;
  }

  return fallback;
}
