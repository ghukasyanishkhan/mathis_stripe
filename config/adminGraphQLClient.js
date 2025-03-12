import axios from 'axios';

const shop = 'stripe-integration-test.myshopify.com';
const token = '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';
// Create an Axios instance for Shopify GraphQL API
const shopifyGraphQLClient = axios.create({
    baseURL: `https://${shop}/admin/api/2024-10/graphql.json`,
    headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
    }
});

// Function to execute GraphQL queries/mutations
const executeAdminGraphQL = async (query, variables = {}) => {
    try {
        const response = await shopifyGraphQLClient.post('', { query, variables });
        return response.data; // Return the GraphQL response
    } catch (error) {
        console.error('GraphQL API Error:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export default executeAdminGraphQL;
