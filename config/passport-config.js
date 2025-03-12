import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { getShopifyCustomerById } from "../services/customerShopifyService.js";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    const customer = await getShopifyCustomerById(jwt_payload.id);
    if (customer) {
      return done(null, customer);
    }
    return done(null, false);
  })
);

export default passport;
