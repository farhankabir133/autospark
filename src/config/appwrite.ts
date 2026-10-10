import { Client, Functions } from 'appwrite';
import { env } from '../lib/env';

/** Appwrite configuration — no hardcoded project fallback. */
const APPWRITE_ENDPOINT = env.VITE_APPWRITE_ENDPOINT as string;
const APPWRITE_PROJECT_ID = env.VITE_APPWRITE_PROJECT_ID as string;

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const functions = new Functions(client);

export const APPWRITE_CONFIG = {
    endpoint: APPWRITE_ENDPOINT,
    projectId: APPWRITE_PROJECT_ID,
    functionId: (env.VITE_APPWRITE_FUNCTION_ID as string) || 'sslcommerz-api'
};
