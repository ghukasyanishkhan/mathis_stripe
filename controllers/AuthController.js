import jwt from "jsonwebtoken";

//Login with email password
export const login = async (req, res) => {
  const payload = { id: req?.customer?.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  res.json({
    id: req?.customer?.id,
    firstName: req?.customer?.firstName,
    lastName: req?.customer?.lastName,
    email: req?.customer?.email,
    token: `Bearer ${token}`,
  });
};