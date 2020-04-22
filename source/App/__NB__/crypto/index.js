var base64=require("./base64.min");//注意：npm buffer 对 base-js 有依赖
var sha1=require("./sha1.min");
var md5=require("./md5.min");



module.exports = {
    md5:md5,
    sha1:sha1,
    base64:base64
}