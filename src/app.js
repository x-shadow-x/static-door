const http = require('http');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Handlebars = require('handlebars');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const conf = require('./config/default-conf');

const tplPath = path.join(__dirname, './template/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());

class Server {
    async handleFile(reqPath, req, res) {
        res.statusCode = 200;
        const rs = fs.createReadStream(reqPath);
        rs.pipe(res);
    }
    async handleDir(reqPath, req, res) {
        const files = await readdir(reqPath);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        const data = {
            title: `${reqPath}目录文件列表`,
            fileList: files.map(item => {
                const dir = path.relative(conf.root, reqPath);
                return {
                    href: path.join(dir, item),
                    fileName: item
                };
            })
        };
        res.end(template(data));
    }
    start() {
        const server = http.createServer(async (req, res) => {
            const reqPath = path.join(conf.root, req.url);
            try {
                const states =  await stat(reqPath);
        
                states.isFile() ? this.handleFile(reqPath, req, res) : this.handleDir(reqPath, req, res);
            } catch (error) {
                console.error(error);
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end({
                    msg: `${reqPath} is not a directory or file`,
                    error: error.toString()
                });
            }
            
            // res.end('hello world');
        });
        
        server.listen(conf.port, conf.hostName, () => {
            const url = `http://${conf.hostName}:${conf.port}`;
            console.info(`server is running at ${chalk.green(url)}`);
        });
    }
}

new Server().start();

module.exports = {
    Server
};
