import { Client, Functions } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || 'dummy-project-id'); // Replace with your Appwrite project ID

export const functions = new Functions(client);
