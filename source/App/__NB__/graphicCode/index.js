// var BarCodeScan=require("BarcodeReader");
// var QRCodeScan=require("jsQR");
var QRCodeGenerate=require("./qrcode");

// var Buffer=require('../utils/Buffer').Buffer;

var System=require('../dotNet/System');
var Convert=System.Convert;
var Text=System.Text;

var isWeb=NB.IsWeb;

var worker_QRCodeScan,worker_BarCodeScan;

if(isWeb){


    //创建多线程
    worker_QRCodeScan=wx.createWorker('__NB__/graphicCode/jsQR.js');
    worker_BarCodeScan=wx.createWorker('__NB__/graphicCode/BarcodeReader.js');


}

function formatScanResult(value,type,scanType){
  
    
    return { 
        charSet:'UTF-8',
        rawData:Convert.ToBase64String(Text.Encoding.UTF8.GetBytes(value)),
        result: value,
        type:type,
        scanType:scanType || type
    };
}

module.exports = {
    generate:{
        qrCode:QRCodeGenerate
    },
    // scanType
    // default:['barCode', 'qrCode']
    // value:barCode qrCode datamatrix pdf417
    scan:function(bitmap,callback,scanType){

        scanType=scanType || ['barCode', 'qrCode'];

     

        if(isWeb){

            
            // 识别二维码
            if(Array.IndexOf(scanType,'qrCode')>-1){

                if(worker_QRCodeScan){
                    worker_QRCodeScan.onMessage(function (scan_res) {
                        
                       
                        

                        if(scan_res){
                            
                            callback(formatScanResult(scan_res.data,'QR_CODE'))
                        }
                        else{
                            callback();
                        }

                        
                      
                    });
                    worker_QRCodeScan.postMessage({
                        data:bitmap.data,
                        width:bitmap.width,
                        height:bitmap.height
                    });
                }
                else{
                    callback();
                }
            }
            
            // 识别条形码
            // 支持格式：["CODE_128", "CODE_93", "CODE_39", "EAN_13", "2Of5", "Inter2Of5", "CODABAR"]
            if(Array.IndexOf(scanType,'barCode')>-1){

                if(worker_BarCodeScan){
                    worker_BarCodeScan.onMessage(function (scan_res) {
                        
                     
                      

                        if(scan_res){
                         
                            var scan_value=scan_res.Value;
                            var scan_format=scan_res.Format;
                            callback(formatScanResult(scan_value,'barcode',scan_format))
                        }
                        else{
                            callback();
                        }
                      
                    });
                    worker_BarCodeScan.postMessage({
                        data:bitmap.data,
                        width:bitmap.width,
                        height:bitmap.height
                    });
                }

                else{
                    callback();
                }
            }

            if(Array.IndexOf(scanType,'datamatrix')>-1){
                callback();
            }
           
            if(Array.IndexOf(scanType,'pdf417')>-1){
                callback();
            }
        }

    },
    // QRCode:{
    //     scan:QRCodeScan,
    //     generate:QRCodeGenerate,
    // },
    // BarCode:{
    //     scan:BarCodeScan
    // },
    // path:{
    //     QRCodeScan:'graphicCode/jsQR.js',
    //     BarCodeScan:'graphicCode/BarcodeReader.js'
    // }
}