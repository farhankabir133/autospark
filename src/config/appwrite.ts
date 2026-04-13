import { Client, Functions } from 'appwrite';

/**
 * Appwrite Configuration for Payment Gateway
 * Endpoint: Singapore (sgp.cloud.appwrite.io)
 * Project: Auto Spark (69d09ead0018cd1663a7)
 * Function: sslcommerz-api (SSLCommerz Payment Integration)
 */

const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '69d09ead0018cd1663a7';

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const functions = new Functions(client);

// Export configuration for reference
export const APPWRITE_CONFIG = {
    endpoint: APPWRITE_ENDPOINT,
    projectId: APPWRITE_PROJECT_ID,
    functionId: import.meta.env.VITE_APPWRITE_FUNCTION_ID || 'sslcommerz-api'
};
