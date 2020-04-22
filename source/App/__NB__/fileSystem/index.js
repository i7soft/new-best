var file={
    mime:   require('./mime')
};

if(typeof NB !='undefined'){
    if(NB.IsWeb && !NB.IsDesktop){
        file.zip    =       require('./archive/zip.min'),           //npm i jszip@3.2.1
        file.m3u8   =       require('./video/hls.min'),             //npm i hls.js@0.12.4
        file.flv    =       require('./video/flv.min'),             //npm i flv.js@1.5.0
        file.mpd    =       require('./video/dash.all.debug'),      //npm i dashjs@2.9.3
        file.mp3    =       wx.createWorker('__NB__/fileSystem/audio/lame.all.js'), //npm install lamejs
        file.rtmp   =       0,//video-js-swf
        file.preview=function(fileOrFolder){
    
            //zip 解压缩预览
    
            //图片 图片预览---todo：做视频组件
    
            //音乐 语音预览---todo：做音频组件
    
            //视频 视频预览
    
            //if web
            //docx xlsx ppts 用 KUKUDOCS （https://kukudocs.com/jsDemo） 实现在线预览---要收费
            //其他格式不超过 1MB 的office 使用在线预览，暂定（https://www.idocv.com/examples.html）
            //else native 使用 rn 的插件
    
            //代码：高亮显示（https://prismjs.com/）
    
        }
    }
}

// todo:桌面端全能视频播放器
// https://github.com/Kagami/mpv.js
// https://github.com/c10342/player

//todo:桌面端全能音频播放器

//todo:桌面端全能解压缩

module.exports = file;