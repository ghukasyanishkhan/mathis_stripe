import {
  customerCreate,
  customerPurchase,
} from "../services/customerService.js";
import {
  getCustomerByReferralCode,
  getCustomerByEmail,
} from "../services/customerDatabaseService.js";
import { generateReferralCode } from "../utils/helper.js";

// Create Customer
export const createCustomer = async (req, res) => {
  try {
    // Check if the email already exists in the database
    console.log("req.body: ", req.body);
    const existingCustomer = await getCustomerByEmail(req.body.email);
    console.log("existingCustomer: ", existingCustomer);
    if (existingCustomer) {
      return res.status(409).json({ error: "Email already in use" });
    }
    // Retrieve the customer by referral code
    const referredBy =
      req.body?.referral_code &&
      (await getCustomerByReferralCode(req.body?.referral_code));
    console.log("referredBy: ", referredBy);
    // Prepare the customer data
    const data = {
      referredById: referredBy?.shopifyId,
      referralCode: await generateReferralCode(),
      name: req.body.first_name,
      email: req.body.email,
      shopifyId: `gid://shopify/Customer/${req.body.customer_id}`,
    };
    console.log("data: ", data);
    // Create the new customer
    const resp = await customerCreate(data);
    console.log("response: ", resp);
    res.status(201).json({ data: resp, message: "created" });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Handle referred customer purchase
export const referredPurchase = async (req, res, next) => {
  try {
    console.log("Received request:", req.body); // Log the incoming request body

    const shopifyId = req.body.customer?.admin_graphql_api_id;
    if (!shopifyId) {
      console.warn("Missing shopifyId in request body"); // Log a warning if shopifyId is missing
      return res
        .status(400)
        .json({ success: false, message: "Invalid customer data" });
    }

    console.log("Processing purchase for shopifyId:", shopifyId); // Log the shopifyId being processed

    const response = await customerPurchase(shopifyId);
    console.log("Purchase processed successfully:", response); // Log the successful response

    res.json({ success: true, data: response });
  } catch (error) {
    console.error("Error during referredPurchase:", error); // Log the error
    next(error); // Pass the error to the error handler
  }
};
