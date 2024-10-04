import express from "express"

const app = express();
const hostname = 'localhost';
const port = 8017;

app.get('/', function(req, res) {
    res.send('<h1>hello world</h1>')
})

app.listen(port, hostname, () => {
    console.log("Hello tao la tuan dang chay server")
})