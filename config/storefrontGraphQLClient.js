import axios from 'axios';

const shop = 'stripe-integration-test.myshopify.com';
const token = 'ffb4343e207bbf3fd0baa76801cc2485';
// Create an Axios instance for Shopify Storefront GraphQL API
const shopifyStorefrontClient = axios.create({
    baseURL: `https://${shop}/api/2024-10/graphql.json`,
    headers: {
        'X-Shopify-Storefront-Access-Token': token, // Storefront API Token
        'Content-Type': 'application/json'
    }
});

// Function to execute Storefront GraphQL queries
const executeStorefrontGraphQL = async (query, variables = {}) => {
    try {
        const response = await shopifyStorefrontClient.post('', { query, variables });
        return response.data; // Return the GraphQL response
    } catch (error) {
        console.error('Storefront GraphQL API Error:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export default executeStorefrontGraphQL;
