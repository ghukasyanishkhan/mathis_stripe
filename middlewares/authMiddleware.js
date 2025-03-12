import {
  generateAccessToken,
  getCustomerByAccessToken,
  getShopifyCustomerById,
} from "../services/customerShopifyService.js";

const authMiddleware = async (req, res, next) => {
  console.log("[AUTH MIDDLEWARE] Request received", req.body);

  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    console.log("[AUTH MIDDLEWARE] Missing email or password");
    const customerId = req.body.customerId;
    if (customerId) {
      console.log(`[AUTH MIDDLEWARE] Customer ID provided: ${customerId}`);
      try {
        const customer = await getShopifyCustomerById(customerId);
        console.log("[AUTH MIDDLEWARE] Customer retrieved successfully", customer);
        
        // Attach user to request object
        req.customer = customer;
        return next();
      } catch (error) {
        console.error("[AUTH MIDDLEWARE] Error fetching customer by ID", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
    return res.status(400).json({ message: "Authentication failed." });
  }

  try {
    console.log("[AUTH MIDDLEWARE] Generating access token...");
    const accessToken = await generateAccessToken(email, password);
    console.log("[AUTH MIDDLEWARE] Access token generated", accessToken);
    
    console.log("[AUTH MIDDLEWARE] Fetching customer by access token...");
    const customer = await getCustomerByAccessToken(accessToken);
    if (!customer) {
      console.log("[AUTH MIDDLEWARE] Invalid credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("[AUTH MIDDLEWARE] Customer authenticated successfully", customer);
    
    // Attach user to request object
    req.customer = customer;
    next();
  } catch (error) {
    console.error("[AUTH MIDDLEWARE] Error during authentication", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default authMiddleware;