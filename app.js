const http = require('http');
const fs = require('fs');
const port = process.env.PORT || 3000;

const comparator = (objArr, key) => {
    const compareFn = (a, b) => {
        if(a[key] > b[key]) {
            return 1;
        } else if(a[key] < b[key]) {
            return -1;
        }
    }
    return objArr.sort(compareFn);
};

http.createServer((req, res) => {
    if(req.method == 'POST') {
        req.on('data', data => {
            const parsedResponse = decodeURIComponent(Buffer.from(data).toString('utf-8').split('=')[1])
            .replace(/\+/g, '');
            const jsonResponse = JSON.parse(parsedResponse);
            const userLst = jsonResponse.data;
            const conds = jsonResponse.condition;
            let sorted = userLst;
            if(conds.sortBy) {
                conds.sortBy.forEach(e => {
                    sorted = comparator(sorted, e);
                });
            }
            res.write(JSON.stringify(sorted), err => {
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