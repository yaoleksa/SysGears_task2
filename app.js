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

const filter = (objArr, cond) => {
    let result = objArr;
    for(let i in cond) {
        if(i != 'sortBy') {
            for(let j in cond[i]) {
                // j == 0, 1... , cond[i][j] = {"disabled": true}...
                for(let h in cond[i][j]) {
                    // h == name, email ...
                    if(i == 'exclude') {
                        result = result.filter(e => e[h] != cond[i][j][h]);
                    } else if(i == 'include') {
                        result = result.filter(e => e[h] == cond[i][j][h]);
                    }
                }
            }
        }
    }
    return result;
};

http.createServer((req, res) => {
    if(req.method == 'POST') {
        req.on('data', data => {
            const parsedResponse = decodeURIComponent(Buffer.from(data).toString('utf-8').split('=')[1])
            .replace(/\+/g, '').replace(/\”/g, '"');
            const jsonResponse = JSON.parse(parsedResponse);
            const userLst = jsonResponse.data;
            const conds = jsonResponse.condition;
            let sorted = userLst;
            if(conds.sortBy) {
                conds.sortBy.forEach(e => {
                    sorted = comparator(sorted, e);
                });
            }
            const filtered = filter(sorted, conds);
            res.write(JSON.stringify(filtered), err => {
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