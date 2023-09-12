const http = require('http');
const port = process.env.PORT || 3000;

http.createServer((req, res) => {
    res.end('start');
}).listen(port, () => {
    console.log(`http://localhost:${port}`);
})