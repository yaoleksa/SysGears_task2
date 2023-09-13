const http = require('http');
const fs = require('fs');
const port = process.env.PORT || 3000;

http.createServer((req, res) => {
    if(req.method == 'POST') {
        req.on('data', data => {
            ['ascii', 'base64', 'base64url', 'hex', 'latin1', 'ucs2', 'utf8', 'utf16le'].forEach(e => {
                console.log(`${e} ${Buffer.from(data).toString(e)}`);
            });
            console.log(Buffer.from(data).toString());
        });
        res.end();
    }
    fs.readFile('./index.html', (err, data) => {
        if(err) {
            console.error(err.message);
        } else if(data) {
            res.write(data, err => {
                if(err) {
                    console.error(err.message);
                }
                res.end();
            })
        }
    });
}).listen(port, () => {
    console.log(`http://localhost:${port}`);
})