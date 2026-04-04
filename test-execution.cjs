const { Client, Functions } = require('appwrite');

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('69d09ead0018cd1663a7');

const functions = new Functions(client);

async function run() {
    try {
        const res = await functions.createExecution(
            'sslcommerz-api',
            JSON.stringify({ total_amount: 1000 }),
            false,
            '/init',
            'POST'
        );
        console.log(res.responseBody);
    } catch(e) {
        console.error(e);
    }
}
run();
