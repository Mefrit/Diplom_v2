const http = require('http');

const server = http.createServer();

server.on('request', (req, res) => {
    res.end('Hello Hellen');
})

server.listen(3000, () => {
    console.log('server work');
});