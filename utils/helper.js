import {
  getCustomerByReferralCode,
  getCustomerCount,
} from "../services/customerDatabaseService.js";

export async function generateReferralCode() {
  const TOTAL_CODES = 90000; // Max possible codes (REF10000 - REF99999)

  try {
    const customersCount = await getCustomerCount(); // Get total registered customers
    console.log(`[INFO] Current customer count: ${customersCount}`);

    // Set max attempts dynamically based on how full the database is
    const fillRate = customersCount / TOTAL_CODES;
    const MAX_ATTEMPTS = fillRate > 0.75 ? 100 : 20;
    console.log(
      `[INFO] Fill Rate: ${(fillRate * 100).toFixed(
        2
      )}%, Max Attempts: ${MAX_ATTEMPTS}`
    );

    let attempts = 0;

    while (attempts < MAX_ATTEMPTS) {
      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      let ref = `REF${randomDigits}`;
      console.log(
        `[DEBUG] Attempt ${attempts + 1}: Trying referral code ${ref}`
      );

      const existingCustomer = await getCustomerByReferralCode(ref);

      if (!existingCustomer) {
        console.log(`[SUCCESS] Unique referral code generated: ${ref}`);
        return ref; // Unique referral code found
      }

      attempts++;
    }

    console.error(
      "[ERROR] Failed to generate a unique referral code after max attempts."
    );
    throw new Error(
      "Failed to generate a unique referral code after multiple attempts."
    );
  } catch (error) {
    console.error("[ERROR] Error generating referral code:", error);
    throw new Error(
      "Unexpected error occurred while generating referral code."
    );
  }
}
