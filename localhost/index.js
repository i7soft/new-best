var webConfig=require("./web.config");
console.log(webConfig);

console.log([
    'https://'+webConfig.domain+':'+webConfig.port.https+'/NB.index.html?debug=true',
    'http://'+webConfig.domain+':'+webConfig.port.http+'/NB.index.html?debug=true',
    'https://'+webConfig.domain+':'+webConfig.port.https+'/NB.index.html',
    'http://'+webConfig.domain+':'+webConfig.port.http+'/NB.index.html',
    'wss://'+webConfig.domain+':'+webConfig.port.wss,
    'ws://'+webConfig.domain+':'+webConfig.port.ws,
]);

console.log('url parameter: ',{
    'debug=true':'debug mode',
    'devtools=eruda':'use mobile devtools: eruda',
    'devtools=vconsole':'use mobile devtools: VConsole',
});


// const kill = require('kill-port');
// for(var x in webConfig.port){
//     kill(webConfig.port[x], 'tcp');
// }
const http = require('http');
const https = require('https');
var Koa = require('koa');
var websockify = require('koa-websocket');
var tls = require('tls');
var path=require('path');
var fs=require('fs');
const userAgent = require('koa-useragent');
const logger = require('koa-logger');
var betterBody = require('koa-better-body');
const compress = require('koa-compress');

var hosts={};
hosts[webConfig.domain]={};


var flag_runWithSSL=fs.existsSync(path.join(__dirname,'ssl',webConfig.domain));


var controller=require('./controller');

//get ssl key and crt file from path "./ssl"
function getSslOptions() {
    return {
        secureProtocol: 'SSLv23_method',
        honorCipherOrder: true,
        SNICallback: (servername, callback) => {
            // console.log(`visit: ${ servername }`);
            var result = {};
            var host = hosts[servername];
            if (host) {
               
                if (!(host.ssl && host.ssl.key && host.ssl.cert)) {

                    host.ssl={};

                    var ssl_path=path.join(__dirname,'ssl',servername);

                    var files=fs.readdirSync(ssl_path);

                    files.forEach(item => {

                        if(path.extname(item)=='.key'){
                            host.ssl.key=fs.readFileSync(path.join(ssl_path, item))
                        }
                        else if(path.extname(item)=='.pem'){
                            host.ssl.cert=fs.readFileSync(path.join(ssl_path, item))
                        }
                        
                    });

                }


                let ctx = tls.createSecureContext(host.ssl);
                return callback(null, ctx);
            }
            return callback();
        }
    }
}

async function callSocketMessage(ctx) {
    ctx.websocket.on("message", async(message) => {


        await controller(ctx,{ message: message, isSocket: true });

    });
}

const app = new Koa();
app.use(logger());
app.use(userAgent);
app.use(betterBody());
app.use(compress());
app.use(async ctx => {

    await controller(ctx);

});

app.on('error', (err, ctx) =>
    console.error('server error', err)
);

const ws = websockify(new Koa());
const wss = websockify(new Koa(), null, getSslOptions());

ws.ws.use(async(ctx, next) => {
 
    await callSocketMessage(ctx);
});

wss.ws.use(async(ctx, next) => {
  
    await callSocketMessage(ctx);
});

http.createServer(app.callback()).listen(webConfig.port.http);

flag_runWithSSL && https.createServer(getSslOptions(), app.callback()).listen(webConfig.port.https, () => {
});

ws.listen(webConfig.port.ws);
flag_runWithSSL && wss.listen(webConfig.port.wss);
