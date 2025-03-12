import prisma from "../utils/prismaClient.js";

// Create a new customer
export const createCustomer = async (customerData) => {
  try {
    console.log(
      `[${new Date().toISOString()}] Creating customer with data:`,
      customerData
    );
    const customer = await prisma.customer.create({ data: customerData });
    console.log(`[${new Date().toISOString()}] Customer created:`, customer);
    return customer;
  } catch (err) {
    console.error(
      `[${new Date().toISOString()}] Error creating customer:`,
      err
    );
    throw new Error("Error creating customer");
  }
};

// Get customers count
export async function getCustomerCount() {
  try {
    return await prisma.customer.count();
  } catch (error) {
    console.error("Error fetching customer count:", error);
    throw new Error("Database error: Unable to get customer count.");
  }
}

// Get customer by ID
export const getCustomerById = async (id) => {
  try {
    console.log(`[${new Date().toISOString()}] Fetching customer by ID: ${id}`);
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { referredBy: true, referrals: true },
    });
    console.log(`[${new Date().toISOString()}] Customer fetched:`, customer);
    return customer;
  } catch (err) {
    console.error(
      `[${new Date().toISOString()}] Error fetching customer by ID:`,
      err
    );
    return null;
  }
};

// Get customer by email
export const getCustomerByEmail = async (email) => {
  try {
    console.log(
      `[${new Date().toISOString()}] Fetching customer by email: ${email}`
    );
    const customer = await prisma.customer.findUnique({
      where: { email },
    });
    console.log(`[${new Date().toISOString()}] Customer fetched:`, customer);
    return customer;
  } catch (err) {
    console.error(
      `[${new Date().toISOString()}] Error fetching customer by email:`,
      err
    );
    return null;
  }
};

// Get customer by Shopify ID
export const getCustomerByShopifyId = async (shopifyId) => {
  try {
    console.log(
      `[${new Date().toISOString()}] Fetching customer by Shopify ID: ${shopifyId}`
    );
    const customer = await prisma.customer.findUnique({
      where: { shopifyId },
    });
    console.log(`[${new Date().toISOString()}] Customer fetched:`, customer);
    return customer;
  } catch (err) {
    console.error(
      `[${new Date().toISOString()}] Error fetching customer by Shopify ID:`,
      err
    );
    return null;
  }
};

// Get customer by referral code
export const getCustomerByReferralCode = async (referralCode) => {
  try {
    console.log(
      `[${new Date().toISOString()}] Fetching customer by referral code: ${referralCode}`
    );
    const customer = await prisma.customer.findUnique({
      where: { referralCode },
    });
    console.log(`[${new Date().toISOString()}] Customer fetched:`, customer);
    return customer;
  } catch (err) {
    console.error(
      `[${new Date().toISOString()}] Error fetching customer by referral code:`,
      err
    );
    return null;
  }
};

// Increment referral count and balance
export const incrementReferralCountAndBalance = async (id) => {
  try {
    console.log(
      `[${new Date().toISOString()}] Incrementing referral count and balance for customer ID: ${id}`
    );
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        referralCount: { increment: 1 },
        referralBalance: { increment: 5.0 }, // Reward $5 per referral
      },
    });
    console.log(
      `[${new Date().toISOString()}] Customer updated:`,
      updatedCustomer
    );
    return updatedCustomer;
  } catch (err) {
    console.error(
      `[${new Date().toISOString()}] Error incrementing referral count and balance:`,
      err
    );
    throw new Error("Error incrementing referral count and balance");
  }
};

// Get referrals by customer ID
export const getReferralsByCustomerId = async (id) => {
  try {
    console.log(
      `[${new Date().toISOString()}] Fetching referrals for customer ID: ${id}`
    );
    const referrals = await prisma.customer.findMany({
      where: { referredById: id },
    });
    console.log(`[${new Date().toISOString()}] Referrals fetched:`, referrals);
    return referrals;
  } catch (err) {
    console.error(
      `[${new Date().toISOString()}] Error fetching referrals by customer ID:`,
      err
    );
    return [];
  }
};
