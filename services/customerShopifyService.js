import executeStorefrontGraphQL from "../config/storefrontGraphQLClient.js";
import executeAdminGraphQL from "../config/adminGraphQLClient.js";
import {
  metafieldsSetQuery,
  customerAccessTokenCreateQuery,
  getCustomerQuery,
} from "../data/graphQLqueries.js";

// Get Shopify customer by ID
export const getShopifyCustomerById = async (id) => {
  const query = `
    query {
      customer(id: "${id}") {
        id
        email
        firstName
        lastName
      }
    }
  `;

  try {
    console.log(`[${new Date().toISOString()}] Fetching customer by ID: ${id}`);
    const response = await executeAdminGraphQL(query);
    console.log("Customer details:", response);
    return response;
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error fetching customer by ID:`, err);
  }
};

// Generate customer access token
export const generateAccessToken = async (email, password) => {
  const variables = {
    input: {
      email,
      password,
    },
  };

  try {
    console.log(`[${new Date().toISOString()}] Generating access token for: ${email}`);
    const response = await executeStorefrontGraphQL(
      customerAccessTokenCreateQuery,
      variables
    );

    if (response.errors) {
      console.error(`[${new Date().toISOString()}] GraphQL errors:`, response.errors);
    } else {
      const { customerAccessToken, customerUserErrors } =
        response.data.customerAccessTokenCreate;

      if (customerUserErrors.length > 0) {
        console.error(`[${new Date().toISOString()}] Customer user errors:`, customerUserErrors);
      } else {
        console.log(`[${new Date().toISOString()}] Access Token generated:`, customerAccessToken.accessToken);
        return customerAccessToken.accessToken;
      }
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error generating access token:`, error);
  }
};

// Get customer by access token
export const getCustomerByAccessToken = async (accessToken) => {
  const variables = {
    customerAccessToken: accessToken,
  };

  try {
    console.log(`[${new Date().toISOString()}] Fetching customer with access token.`);
    const response = await executeStorefrontGraphQL(
      getCustomerQuery,
      variables
    );

    if (response.errors) {
      console.error(`[${new Date().toISOString()}] GraphQL errors:`, response.errors);
      return null;
    }

    const customer = response.data.customer;
    console.log(`[${new Date().toISOString()}] Customer fetched by access token:`, customer);
    return customer;
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error fetching customer by access token:`, err);
    return null;
  }
};

// Fetch existing metafield
const getCustomerMetafield = async (shopifyId, namespace, key) => {
  const query = `
    query {
      customer(id: "${shopifyId}") {
        metafield(namespace: "${namespace}", key: "${key}") {
          id
          value
        }
      }
    }
  `;

  try {
    console.log(`[${new Date().toISOString()}] Fetching metafield: ${key} for customer ID: ${shopifyId}`);
    const response = await executeAdminGraphQL(query);
    return response?.data?.customer?.metafield || null;
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error fetching metafield (${key}):`, err);
    return null;
  }
};

// Create or update Referral code
export const createOrUpdateReferralCode = async (shopifyId, referralCode) => {
  const variables = {
    metafields: [
      {
        key: "referral_code",
        namespace: "referrals",
        ownerId: shopifyId,
        type: "single_line_text_field",
        value: referralCode,
      },
    ],
  };

  try {
    console.log(`[${new Date().toISOString()}] Creating or updating referral code for customer ID: ${shopifyId}`);
    const response = await executeAdminGraphQL(metafieldsSetQuery, variables);
    if (response?.userErrors) {
      console.error(`[${new Date().toISOString()}] GraphQL errors:`, response?.userErrors);
      return null;
    }
    console.log(`[${new Date().toISOString()}] Created metafield:`, response?.data?.metafieldsSet?.metafields[0]);
    return response?.data?.metafieldsSet?.metafields[0];
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error updating referral code metafield:`, err);
    return null;
  }
};

// Create or update "Referred By" referral ID
export const createOrUpdateReferrerdById = async (shopifyId, referredById) => {
  const variables = {
    metafields: [
      {
        key: "referred_by",
        namespace: "referrals",
        ownerId: shopifyId,
        type: "single_line_text_field",
        value: referredById,
      },
    ],
  };

  try {
    console.log(`[${new Date().toISOString()}] Creating or updating referred by ID for customer ID: ${shopifyId}`);
    const response = await executeAdminGraphQL(metafieldsSetQuery, variables);
    if (response?.userErrors) {
      console.error(`[${new Date().toISOString()}] GraphQL errors:`, response?.userErrors);
      return null;
    }
    console.log(`[${new Date().toISOString()}] Created metafield:`, response?.data?.metafieldsSet?.metafields[0]);
    return response?.data?.metafieldsSet?.metafields[0];
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error updating referred by ID metafield:`, err);
    return null;
  }
};

// Create or update Payout status
export const createOrUpdatePayoutStatus = async (shopifyId, status) => {
  const variables = {
    metafields: [
      {
        key: "payout_status",
        namespace: "referrals",
        ownerId: shopifyId,
        type: "single_line_text_field",
        value: status,
      },
    ],
  };

  try {
    console.log(`[${new Date().toISOString()}] Creating or updating payout status for customer ID: ${shopifyId}`);
    const response = await executeAdminGraphQL(metafieldsSetQuery, variables);
    if (response?.userErrors) {
      console.error(`[${new Date().toISOString()}] GraphQL errors:`, response?.userErrors);
      return null;
    }
    console.log(`[${new Date().toISOString()}] Created metafield:`, response?.data?.metafieldsSet?.metafields[0]);
    return response?.data?.metafieldsSet?.metafields[0];
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error updating payout status metafield:`, err);
    return null;
  }
};

// Create or update Referral balance
export const createOrUpdateReferralBalance = async (shopifyId, balance) => {
  const variables = {
    metafields: [
      {
        key: "referral_balance",
        namespace: "referrals",
        ownerId: shopifyId,
        type: "number_decimal",
        value: balance,
      },
    ],
  };

  try {
    console.log(`[${new Date().toISOString()}] Creating or updating referral balance for customer ID: ${shopifyId}`);
    const response = await executeAdminGraphQL(metafieldsSetQuery, variables);
    if (response?.userErrors) {
      console.error(`[${new Date().toISOString()}] GraphQL errors:`, response?.userErrors);
      return null;
    }
    console.log(`[${new Date().toISOString()}] Created metafield:`, response?.data?.metafieldsSet?.metafields[0]);
    return response?.data?.metafieldsSet?.metafields[0];
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error updating referral balance metafield:`, err);
    return null;
  }
};

// Increment referral count
export const createOrUpdateReferralCount = async (shopifyId) => {
  // Get existing count
  const resp = await getCustomerMetafield(shopifyId, "referrals", "referral_count");
  let count = isNaN(parseInt(resp?.value, 10)) ? 0 : parseInt(resp?.value, 10);
  let newCount = resp?.value ? count + 1 : 1;

  const variables = {
    metafields: [
      {
        key: "referral_count",
        namespace: "referrals",
        ownerId: shopifyId,
        type: "number_integer",
        value: `${newCount}`,
      },
    ],
  };

  try {
    console.log(`[${new Date().toISOString()}] Incrementing referral count for customer ID: ${shopifyId}`);
    const response = await executeAdminGraphQL(metafieldsSetQuery, variables);
    if (response?.userErrors) {
      console.error(`[${new Date().toISOString()}] GraphQL errors:`, response?.userErrors);
      return null;
    }
    console.log(`[${new Date().toISOString()}] Referral count updated:`, response?.data?.metafieldsSet?.metafields[0]);
    return response?.data?.metafieldsSet?.metafields[0];
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error updating referral count metafield:`, err);
    return null;
  }
};
