//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :barCodeDetail.js
//        description : 获取条形码的商品详情（条形码调用 APi 仅作为测试之用，请勿用于商业用途）。
//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================

var L=require('./utils/L');

Page({
    data:{
        text_copyText:L('Copy title'),
        text_copyBarCode:L('Copy bar code'),
        backgroundColor:'#fff',
        titleColor:'rgba(0,0,0,0.9)',
        fontColor:'rgba(0,0,0,0.5)',
        showDetail:false,//识别为商品
        showNone:false,//识别不了
        showBook:false,//识别为出版物
        info:{},
        title:'',
        sutitle:'',
        barcode:'',
    },
    onLoad:function(options){

        var that=this;

        var value=options.value;

        var countryCode=parseInt(value.substr(0,3));
        var isChina=countryCode>=690 && countryCode<=699;

        var tempCanvasId='tempCanvas';
        var tempImageSize=100;

        wx.showLoading({
            title:L('Loading')
        });

        var next=function(data,r,g,b){
            if((r==255 && g==255 && b==255) || (r==0 && g==0 && b==0) || isNaN(r)){
                r=g=b=200;
            }

            var info=[],title,subtitle,logo;

            if(data.ISBN){
                title=data.BookName;
                subtitle=data.Publishing;
                logo=data.img;

                if(data.Brand)info.push({k:L('Press'),v:data.Brand});

                if(data.Pages)info.push({k:L('Number of pages'),v:data.Pages});

                if(data.Price)info.push({k:L('Price'),v:data.Price});

                if(data.ISBN)info.push({k:'ISBN',v:data.ISBN});
            }
            else{
                if(data.country)info.push({k:L('Produced country'),v:data.country});

                if(data.supplier)info.push({k:L('Company'),v:data.supplier});
    
                if(data.place)info.push({k:L('Address'),v:data.place});
    
                if(data.standard)info.push({k:L('Standard'),v:data.standard});
    
                if(data.price)info.push({k:L('Price'),v:data.price});
    
                if(data.ean)info.push({k:L('Bar code'),v:data.ean});

                title=data.name;
                subtitle=data.brand;
                logo=data.img;
            }

       

            var fontColor=(r+g+b)/3<100?255:0;

            that.setData({
                info:info,
                logo:logo,
                showDetail:true,
                title:title,
                subtitle:subtitle,
                barcode:value,
                backgroundColor:"rgb(" + r + "," + g + "," + b + ")",
                titleColor:"rgba(" + fontColor + "," +fontColor + "," + fontColor + ",0.9)",
                fontColor:"rgba(" + fontColor + "," +fontColor + "," + fontColor + ",0.5)"
            });

            wx.hideLoading();
        };

        var fail=function(){
            wx.hideLoading();
            wx.showToast({
                title:L('Loading failed, please try again later~'),
                icon:'none'
            })
        };

        var downloadCover=function(data,url){
            wx.downloadFile({
                url:url, 
                success:function(res) {

                    var tempFilePath=res.tempFilePath;

                    var drawWidth=tempImageSize,drawHeight=tempImageSize;
                  
                    var ctx = wx.createCanvasContext(tempCanvasId,that);
                    ctx.clearRect(0, 0, tempImageSize, tempImageSize);
                    ctx.drawImage(tempFilePath,0,0,drawWidth,drawHeight);
                    ctx.draw(false,function(){

                        //获得图片的 imageData
                        wx.canvasGetImageData({
                            canvasId: tempCanvasId,
                            x: 0,
                            y: 0,
                            width: drawWidth,
                            height: drawHeight,
                            success:function(res) {
                                
                                var imageData=res.data;


                                var r=0,g=0,b=0;
                                var r2,g2,b2;

                                // 取所有像素的平均值
                                var i=0;
                                for (var row = 0; row < drawHeight; row++) {
                                    for (var col = 0; col < drawWidth; col++) {

                                        var s=((drawWidth * row) + col) * 4;

                                        r2 = imageData[s];
                                        g2 = imageData[s + 1];
                                        b2 = imageData[s + 2];

                                        if((r2+g2+b2>120*3) || (r2+g2+b2<50*3)){
                                            continue;
                                        }

                                        r+=r2;
                                        g+=g2;
                                        b+=b2;
                                        i++;
                                    }
                                }
                            
                                // 求取平均值
                                r /= i;
                                g /= i;
                                b /= i;
                            
                                // 将最终的值取整
                                r = Math.round(r);
                                g = Math.round(g);
                                b = Math.round(b);

                                data.img=tempFilePath;
                                next(data,r,g,b);
                            },
                            fail:function(){
                                next(data,0,0,0);
                            }
                        },that)
                    })
                },
                fail:function(){
                    next(data,0,0,0);
                }
            });
        };

        wx.request({
            //不保证此 api 一直可以使用
            url:'http://isbn.szmesoft.com/isbn/query?isbn='+value,
            success:function(res){
                var data=res.data;
                if(data.ErrorCode || !data.PhotoUrl){
                    wx.request({
                        //不保证此 api 一直可以使用
                        url:'http://app.cjtecc.cn/barcode/eandetail.php?ean='+value,
                        success:function(res){
                            var data=res.data;
                            if(data && data.Id){
                                var url=data.img;
            
                                if(url){
            
                                    downloadCover(data,url);
                                }
                                else{
                                    next(data,0,0,0);
                                }
                            }
                            else{
                                next(data,0,0,0);
                                
                            }
                        },
                        fail:function(res){
                            fail();
                        }
                    })
                }
                else{
                    var url=data.img='http://isbn.szmesoft.com/ISBN/GetBookPhoto?ID='+data.PhotoUrl;

                    downloadCover(data,url);
                }
            },
            fail:function(){
                fail();
            }
        })

        
    },
    copy:function(e){

        

        wx.setClipboardData({
            data:this.data[e.currentTarget.dataset.key],
            success:function(){
                wx.showToast({title:L('Copy successful'),icon:'none'});
            },
            fail:function(){
                wx.showToast({title:L('Copy failed'),icon:'none'});
            }
        })
    }
})