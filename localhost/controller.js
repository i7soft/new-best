var path=require('path');
var fs=require('fs');
const mime = require('mime');

var readFile = (path, ascCode) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, ascCode, (err, data) => {
            if (err) {
                reject(console.log(err))
            } else {
                resolve(data)
            }
        })
    })
};

function onBeforeResopnse(ctx,data){
    var allData = {};
    for (var x in ctx.query) {
        allData[x] = ctx.query[x];
    }

    if (ctx.request.fields){

        for (var x in ctx.request.fields) { //post 会覆盖 get 的相同值
            allData[x] = ctx.request.fields[x];
        }
    }
    //https://www.npmjs.com/package/koa-better-body
    var final_data = {
        data: allData, //get和 post 的 key-value 集合
        query: ctx.query, //get
        form: ctx.request.fields, //post
        message: ctx.request.body, //socket 数据 或者 post 过来的文本
    };

    // 合并 data
    data = data || {};
    for (var x in data) {
        final_data[x] = data[x];
    }

    final_data.isPost = (ctx.request.fields || ctx.request.body) ? true : false;

    return final_data;
}

async function response(ctx,data){
    var is_debug=ctx.query.debug || ctx.query._t;
    var urlPath=ctx.path;
    if(urlPath=='' || urlPath=='/'){
        urlPath='/NB.index.html';
    }
    urlPath=decodeURIComponent(urlPath);
    var appRoot='../release/platform/web';
    if(is_debug)appRoot='../debug/platform/web';
    var staticFile=path.join(__dirname,appRoot,urlPath);
 
    if(fs.existsSync(staticFile)){
        

        var ext = path.extname(staticFile);
        var _mime = mime.getType(ext);

        if (_mime) {
            ctx.type = _mime;
        }

        if (_mime && (_mime.indexOf('text/') > -1 || _mime.indexOf('json') > -1)) {
            var _content=await readFile(staticFile,'utf8');
            if(urlPath=='/NB.index.html'){
                _content=_content.replace(/<script.*?NB.config.js.*?>/,'<script src="./NB.config.js'+(is_debug?'?debug=true':'')+'">');
                var projectConfig=JSON.parse(await readFile(path.join(__dirname,'../source/project.config.json'),'utf8'));
                _content=_content.replace(/{{appName}}/g,projectConfig.appName);
            }
            ctx.body = _content;
        } else {
            var _content=await readFile(staticFile);
            // response image
            ctx.res.writeHead(200)
            ctx.res.write(_content)
            ctx.res.end()
        }
    }
    else{
        ctx.body="hello NB world~";
        ctx.status = 404;
    }
}

module.exports=async function(ctx,data){

    data=onBeforeResopnse(ctx,data);

    await response(ctx,data);
    
}