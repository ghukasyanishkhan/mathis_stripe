import express from "express";
    import {
      createCustomer,
      referredPurchase,
    } from "../../controllers/CustomerController.js";
    
    const customerRouter = express.Router();
    
    //Create
    customerRouter.post("/", createCustomer);
    customerRouter.post("/purchase", referredPurchase);
    
    
    export default customerRouter;
  