
var GraphicCode=require('../graphicCode/index');
var QRCodeGenerate=GraphicCode && GraphicCode.generate.qrCode;

// 画圆角矩形
function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width - radius, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    ctx.lineTo(x + width, y + radius);
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.quadraticCurveTo(x, y, x, y + radius);
    ctx.stroke();
}

var __document;
if(typeof document !='undefined'){
    __document=document;
}

module.exports={
    //浏览器模式下，动态引用外部 js
    appendScript:function(url,callback){
        var script = __document.createElement('script');
        script.charset = 'utf-8';
        if(callback) script.onload = script.onreadystatechange = function() {
            if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) {
                callback();
                script.onload = script.onreadystatechange = null;
            }
        };
        script.src = url;
        __document.head.appendChild(script);
    },
    //浏览器模式下，动态添加 css
    appendStyle:function(css,obj){
        var style=__document.createElement("style");
        style.setAttribute("type", "text/css");
    
        if(style.styleSheet){// IE
            style.styleSheet.cssText = css;
        } else {// w3c
            var cssText = __document.createTextNode(css);
            style.appendChild(cssText);
        }

        obj=obj || __document.head;

        obj.appendChild(style);
    },
    qrcode:function(OBJECT,instance){

        var qrcodeCanvasId=OBJECT.canvasId;
        var text=OBJECT.text;
        var qrcode_size=OBJECT.size;
        var logo=OBJECT.logo;

        // that.shareUrl=link;

        var qrcode_result=QRCodeGenerate({
            text:text
        });


        var moudleCount=qrcode_result.count;
        var qrcode_data=qrcode_result.data;

        var ctx = wx.createCanvasContext(qrcodeCanvasId,instance);
        var qrcode_width=qrcode_size,qrcode_height=qrcode_size;

        var f=qrcode_width/moudleCount;
        var g=qrcode_height/moudleCount;

        var j,k;

        //绘制二维码
        ctx.clearRect(0, 0, qrcode_size, qrcode_size);
        for(var h=0;h<qrcode_data.length;h++){
            var row=qrcode_data[h];
            for(var i=0;i<row.length;i++){
                ctx.fillStyle = row[i] ?'#000000' : '#ffffff',
                j = Math.ceil((i + 1) * f) - Math.floor(i * f),
                k = Math.ceil((h + 1) * f) - Math.floor(h * f),
                ctx.fillRect(Math.round(i * f), Math.round(h * g), j, k)
            }
        }

        //画布生效
        var draw=function(){
            
            ctx.draw(true,function(){
                
                //画布保存为临时文件
                wx.canvasToTempFilePath({
                    destWidth:qrcode_size,
                    destHeight:qrcode_size,
                    canvasId: qrcodeCanvasId,
                    success(res) {

                        //将临时文件转换为 base64 字符串
                        var fsm=wx.getFileSystemManager();
                        fsm.readFile({
                            filePath:res.tempFilePath,
                            encoding:'base64',
                            success:function(res){

                                OBJECT.success('data:image/jpeg;base64,'+res.data);
                            }
                        });


                    }
                },instance)
                
            });
        };

        //下载图片
        if(logo){

            var next=function(logo_tempUrl){
                //获取logo图片信息
                wx.getImageInfo({
                    src: logo_tempUrl,
                    success:function(res) {

                        var logo_width=res.width;
                        var logo_height=res.height;

                        var logo_drawWidth=qrcode_width/4;
                        var logo_drawHeight=qrcode_height/4;

                        if(logo_width>logo_height){
                            logo_drawHeight=logo_height*logo_drawWidth/logo_width;
                        }
                        else{
                            logo_drawWidth=logo_width*logo_drawHeight/logo_height;
                        }

                        //绘制 logo
                        var logo_x=(qrcode_width-logo_drawWidth)/2;
                        var logo_y=(qrcode_height-logo_drawHeight)/2;
                        ctx.save();
                        ctx.beginPath();
                        roundedRect(ctx, logo_x, logo_y, logo_drawWidth, logo_drawHeight, 50);
                        ctx.clip();
                        ctx.drawImage(
                            logo_tempUrl,
                            logo_x, 
                            logo_y,
                            logo_drawWidth, 
                            logo_drawHeight);
                        ctx.restore();

                        draw();
                    }
                })
            };

            if(logo.indexOf('wxfile://')==0){
                next(logo);
            }
            else{
                wx.downloadFile({
                    url: logo, 
                    success:function(res) {
                        var logo_tempUrl=res.tempFilePath;
                        next(logo_tempUrl);
                    }
                })
            }
        }
        else{
            draw();
        }
    },

};