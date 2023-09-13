const http = require('http');
const fs = require('fs');
const port = process.env.PORT || 3000;

http.createServer((req, res) => {
    if(req.method == 'POST') {
        req.on('data', data => {
            const parsedResponse = decodeURI(Buffer.from(data).toString('utf-8').split('=')[1])
            .replace(/%3A/g, ':')
            .replace(/%40/g, '@')
            .replace(/%2C/g, ',')
            .replace(/%20/g, ' ')
            .replace(/\+/g, '');
            const jsonResponse = JSON.parse(parsedResponse);
            res.write(JSON.stringify(jsonResponse.data), err => {
                if(err) {
                    console.error(err.message);
                }
                res.end();
            })
        });
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