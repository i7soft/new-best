//======================================================================
//
//        Copyright (C) NewBest.live  
//        All rights reserved
//        下列 filename 指示文件仅可以在注册 NewBest.cn 的应用可以使用，其他情况一律不可以！一经发现，NewBest 保留法律追究的权利！
//
//        filename :scanCode.js
//        description : 扫码组件，调用 wx.scanCode 时候使用。
//
//        created by NewBest.live
//        http://newbest.live
//
//======================================================================

var L=require('./utils/L');
var slideUp='nb-animate-slide-up',slideDown='nb-animate-slide-down';
var GraphicCode=require('./graphicCode/index');

var isApp=NB && NB.IsApp,isWechat=NB && NB.IsWechat,isMobile=NB.IsMobile,isWeb=NB.IsWeb;//可以根据平台的不同，向用户展示不同的分享界面

//NBConfig 是 NewBest 框架的全局配置
var themeColor=(NBConfig && NBConfig.themeColor) || '#3cc51f';//主题颜色

function setData(that,data){
    that.setData(data);
}

function triggerEvent(that,eventName,options){
    that.triggerEvent(eventName,options);
}

var viewFinderSize=250;//取景框大小

var scanType=['barCode', 'qrCode','datamatrix','pdf417'];

Component({

    externalClasses:[slideUp,slideDown,'nb-icon','nb-icon-image','nb-icon-down-arrow','nb-icon-light'],

    /**
     * 组件的属性列表
     */
    properties: {
        data:Object,
        show: {
            type: Number,
            value: 0,
            observer: function (newVal) {
                var that=this;
                var properties=that.properties;
                var data=properties.data;
                if(newVal){

                   

                    setData(that,{
                        _show: true,
                        animationName:slideUp,
                        onlyFromCamera:data.onlyFromCamera
                    });

                  
                }
                
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        _show:0,
        animationName:'',
        themeColor:themeColor,
        viewFinderSize:viewFinderSize,//取景框大小
        text:L('Put in the box and scan automatically'),
        onlyFromCamera:false,
        cameraDone:false,
        flase:false//控制闪光灯
    },


    /**
     * 组件的方法列表
     */
    methods: {
        onAnimationEnd:function(e){
            var that=this;
            if(that.willHide){
                that.willHide=false;
                setData(that,{_show:0})
            }
        },
        hide:function(){
            var that=this;
            // that.listener.stop();//停止监听 camera
            that.willHide=true;
            wx.hideLoading();
            setData(that,{animationName:slideDown});
        },
        //相机初始化完成，可以进行拍照
        camera_onInitDone:function(){

            var that=this;

            setData(that,{cameraDone:true});

            // var systemInfo=wx.getSystemInfoSync();

            // var client_width=systemInfo.clientWidth||systemInfo.screenWidth;
            // var client_height=systemInfo.clientHeight || systemInfo.screenHeight;

            // var context=wx.createCameraContext(that);

            // var flag_scanFinish=true;

            // var listener = that.listener=context.onCameraFrame(function(frame){
            //     // console.log(frame.width, frame.height)

            //     // if(!flag_scanFinish) return;

            //     flag_scanFinish=false;

            //     var data=frame.data;

            //     var frame_width=frame.width;
            //     var frame_height=frame.height;

            //     var new_viewFinderSize=parseInt(frame_width*viewFinderSize/client_width);//要截取的取景框大小

            //     // console.log(new_viewFinderSize);

            //     var left=parseInt((frame_width-new_viewFinderSize)/2);
            //     var right=left+new_viewFinderSize;
            //     var top=parseInt((frame_height-new_viewFinderSize)/2);
            //     var bottom=top+new_viewFinderSize;


            //     var newData = [];

               
            //     //截取中间的位置来识别
            //     for(var y=top;y<bottom;y++){
                    
            //         for(var x=left;x<right;x++){
            //             var s=4*(y*frame_width+x);
            //             newData.push(data[s]);
            //             newData.push(data[s+1]);
            //             newData.push(data[s+2]);
            //             newData.push(data[s+3]);
            //         }
            //         // var sub=Array.prototype.slice.call(data.slice(y_4*(frame_width+left),y_4*(frame_width+right)));
            //         // newData=newData.concat();
            //     }

            //     wx.canvasPutImageData({
            //         canvasId: 'tempCanvas',
            //         x: 0,
            //         y: 0,
            //         width: new_viewFinderSize,
            //         height:new_viewFinderSize,
            //         data: new Uint8ClampedArray(newData),
            //         complete:function (res) {
            //             console.log(res);
            //         }
            //     },that);
               
                
            //     var scan_count=scanType.length;

            //     // GraphicCode.scan({
            //     //     data:new Uint8ClampedArray(newData),
            //     //     width:new_viewFinderSize,
            //     //     height:new_viewFinderSize
            //     // },function(res){

            //     //     if(!scan_count) {//当前 frame 识别结束
            //     //         flag_scanFinish=true;
            //     //         return;
            //     //     }

            //     //     scan_count--;
                    
            //     //     if(res){//本次识别结束
            //     //         wx.vibrateShort();
            //     //         //todo:播放扫描成功的音效
            //     //         scan_count=0;
            //     //         triggerEvent(that,'scancode',res);
            //     //         that.hide();
            //     //     }
            //     // },scanType);
            // });
            // listener.start()
        },
        scanCode:function(e){
            var that=this;
            //播放扫描成功的声音
            wx.playVoice({
                filePath: 'audio/scanCode.mp3',
            });
            triggerEvent(that,'scancode',e.detail);
            that.hide();
        },
        fromImage:function(){


            var that=this;

            if(GraphicCode){

                var tempCanvasId='tempCanvas';
                var tempImageSize=300;
              
                wx.chooseImage({
                    count:1,
                    sizeType:['compressed'],
                    sourceType:['album'],
                    success:function(res){

                        wx.showLoading({
                            title: L('Identifying'),
                        });
   
                        var tempUrl=res.tempFilePaths[0];

                        //获取图片信息
                        wx.getImageInfo({
                            src: tempUrl,
                            success:function(res) {
                                var image_width=res.width;
                                var image_height=res.height;

                                var drawWidth=tempImageSize;
                                var drawHeight=tempImageSize;

                                if(image_width>image_height){
                                    drawHeight=image_height*drawWidth/image_width;
                                }
                                else{
                                    drawWidth=image_width*drawHeight/image_height;
                                }

                                //缩小图片，提高识别速度
                                var ctx = wx.createCanvasContext(tempCanvasId,that);
                                ctx.clearRect(0, 0, tempImageSize, tempImageSize);
                                ctx.drawImage(tempUrl,0,0,drawWidth,drawHeight);
                                ctx.draw(false,function(){

                                    //获得图片的 imageData
                                    wx.canvasGetImageData({
                                        canvasId: tempCanvasId,
                                        x: 0,
                                        y: 0,
                                        width: drawWidth,
                                        height: drawHeight,
                                        success:function(res) {
                                         
                                          

                                            var scan_count=scanType.length;

                                            GraphicCode.scan(res,function(res){

                                                if(!scan_count) return;

                                                scan_count--;
                                               
                                                if(res){
                                                    scan_count=0;
                                                    wx.hideLoading();
                                                    triggerEvent(that,'scancode',res);
                                                    that.hide();
                                                }
                                                else{
                                                   
                                                    if(!scan_count){
                                                      
                                                        wx.hideLoading();
                                                        wx.showToast({
                                                            title:L('No scan result'),
                                                            icon:'none'
                                                        })
                                                    }
                                                }
                                            },scanType);
                                            
                                        }
                                    },that)
                                })
                            },
                            fail:function(){
                                wx.hideLoading();
                            }
                        });
                    }
                });
                
                
            }
        }
    },
    
})