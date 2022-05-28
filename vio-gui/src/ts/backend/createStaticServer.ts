import * as http from 'http';
import * as url from 'url';
import * as fs from 'fs';
import * as path from 'path';

export default function createStaticServer() {
    return http.createServer(function (req, res) {
        // parse URL
        const baseURL = 'http://' + req.headers.host + '/';
        const parsedUrl = new URL(req.url!, baseURL);
        // extract URL path
        let pathname = `${process.env.VIOGUI_HTTP_PATH ?? "."}/${parsedUrl.pathname}`;
        // based on the URL path, extract the file extension. e.g. .js, .doc, ...
        let ext = path.parse(pathname).ext;
        // extract path parts
        const parts = parsedUrl.pathname.substring(1).split('/') ?? [];
        // maps file extension to MIME type
        const map = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.wasm': 'application/wasm',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.ico': 'image/x-icon'
        };

        const exist = fs.existsSync(pathname);
        if (!exist) {
            // if the file is not found, return 404
            res.statusCode = 404;
            res.end(`File ${pathname} not found!`);
            return;
        }

        // if is a directory search for index file matching the extension
        if (fs.statSync(pathname).isDirectory()) {
            ext = '.html';
            pathname += '/index' + ext;
        }

        // read file from file system
        fs.readFile(pathname, function(err, data) {
            if (err) {
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
            } else {
                // if the file is found, set Content-type and send data
                res.setHeader('Content-type', (map as any)[ext] ?? 'text/plain' );

                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
                res.setHeader('Access-Control-Allow-Credentials', 'true');

                res.end(data);
            }
        });
    });
}
