import {
  createOrUpdateReferralCode,
  createOrUpdateReferrerdById,
  createOrUpdateReferralCount,
  createOrUpdateReferralBalance,
} from "./customerShopifyService.js";
import {
  createCustomer,
  incrementReferralCountAndBalance,
  getCustomerByShopifyId,
} from "./customerDatabaseService.js";

export const customerCreate = async (data) => {
  try {
    console.log("Starting customer creation process with data:", data);

    // Create the customer in the database
    const customer = await createCustomer(data);
    console.log("Customer created successfully:", customer);

    // Update the referredById and referralCode fields for the customer
    console.log("Updating referredById:", customer?.referredById);
    const resp1 = await createOrUpdateReferrerdById(
      customer?.shopifyId,
      customer?.referredById
    );
    console.log("Updated referredById:", resp1);

    console.log("Updating referralCode:", customer?.referralCode);
    const resp2 = await createOrUpdateReferralCode(
      customer?.shopifyId,
      customer?.referralCode
    );
    console.log("Updated referralCode:", resp2);

    // Return the created customer
    return customer;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw new Error("An error occurred while creating the customer.");
  }
};

export const customerPurchase = async (shopifyId) => {
  try {
    console.log("Starting customer purchase process for shopifyId:", shopifyId);

    const referred = await getCustomerByShopifyId(shopifyId);
    if (!referred) {
      console.warn("Referred customer not found for shopifyId:", shopifyId);
      throw new Error("Referred customer not found.");
    }
    console.log("Referred customer data:", referred);

    const referredBy = await getCustomerByShopifyId(referred.referredById);
    if (!referredBy) {
      console.warn("Referrer not found for referred customer:", referred.referredById);
      throw new Error("Referrer not found.");
    }
    console.log("Referrer data:", referredBy);

    // Increment the referral count and balance for the referrer database
    console.log("Incrementing referral count and balance for:", referredBy.id);
    const resp = await incrementReferralCountAndBalance(referredBy.id);
    console.log("Updated referral data:", resp);

    // Update the referral count and balance for the referrer customer metafields
    console.log("Updating referral count metafield for shopifyId:", resp.shopifyId);
    await createOrUpdateReferralCount(resp.shopifyId);
    
    console.log("Updating referral balance metafield for shopifyId:", resp.shopifyId);
    await createOrUpdateReferralBalance(resp.shopifyId, resp.referralBalance.toString());

    console.log("Customer purchase process completed successfully.");
    return resp;
  } catch (error) {
    console.error("Error processing customer purchase:", error);
    throw new Error("An error occurred while processing the customer purchase.");
  }
};
