// utils/tokenUtils.js
import jwt from "jsonwebtoken";

const secretKey = "your_jwt_secret";

export const decodeToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
};
