const http = require('http');
const options = { hostname: '127.0.0.1', port: 5173, path: '/', method: 'GET' };

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk.toString());
  res.on('end', () => {
    console.log(data.slice(0,4000));
    process.exit(0);
  });
});
req.on('error', err => { console.error('err', String(err)); process.exit(2) });
req.end();
