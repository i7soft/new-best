var fs=require('fs');
var path=require('path');
const sharp = require('sharp');

const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

const Jimp = require("jimp");

//npm i png-to-ico
var pngToIco=(function(){

    // http://fileformats.wikia.com/wiki/Icon
    // the correct sizes are 256x256, 48x48, 32x32, 16x16
    const sizeList = [48, 32, 16];
    const err = new Error("Please give me an png image of 256x256 pixels.");
    err.code = "ESIZE";

    return function(filepath) {
        return Jimp.read(filepath)
            .then(image => {
            const bitmap = image.bitmap;
            const size = bitmap.width;
            if (image._originalMime !== Jimp.MIME_PNG || size !== bitmap.height) {
                throw err;
            }
            if (size !== 256) {
                image.resize(256, 256, Jimp.RESIZE_BICUBIC);
            }

            const resizedImages = sizeList.map(targetSize =>
                image.clone().resize(targetSize, targetSize, Jimp.RESIZE_BICUBIC)
            );

            return Promise.all(resizedImages);
            })
            .then(imagesToIco);
    };

    function imagesToIco(images) {
        const header = getHeader(images.length);
        const headerAndIconDir = [header];
        const imageDataArr = [];
      
        let len = header.length;
        let offset = header.length + 16 * images.length;
      
        images.forEach(img => {
          const dir = getDir(img, offset);
          const bmpInfoHeader = getBmpInfoHeader(img, 0);
          const dib = getDib(img);
      
          headerAndIconDir.push(dir);
          imageDataArr.push(bmpInfoHeader, dib);
      
          len += dir.length + bmpInfoHeader.length + dib.length;
          offset += bmpInfoHeader.length + dib.length;
        });
      
        return Buffer.concat(headerAndIconDir.concat(imageDataArr), len);
    }
      
    // https://en.wikipedia.org/wiki/ICO_(file_format)
    function getHeader(numOfImages) {
        const buf = Buffer.alloc(6);
      
        buf.writeUInt16LE(0, 0); // Reserved. Must always be 0.
        buf.writeUInt16LE(1, 2); // Specifies image type: 1 for icon (.ICO) image
        buf.writeUInt16LE(numOfImages, 4); // Specifies number of images in the file.
      
        return buf;
    }
      
    function getDir(img, offset) {
        const buf = Buffer.alloc(16);
        const bitmap = img.bitmap;
        const size = bitmap.data.length + 40;
        const width = bitmap.width >= 256 ? 0 : bitmap.width;
        const height = width;
        const bpp = 32;
      
        buf.writeUInt8(width, 0); // Specifies image width in pixels.
        buf.writeUInt8(height, 1); // Specifies image height in pixels.
        buf.writeUInt8(0, 2); // Should be 0 if the image does not use a color palette.
        buf.writeUInt8(0, 3); // Reserved. Should be 0.
        buf.writeUInt16LE(0, 4); // Specifies color planes. Should be 0 or 1.
        buf.writeUInt16LE(bpp, 6); // Specifies bits per pixel.
        buf.writeUInt32LE(size, 8); // Specifies the size of the image's data in bytes
        buf.writeUInt32LE(offset, 12); // Specifies the offset of BMP or PNG data from the beginning of the ICO/CUR file
      
        return buf;
    }
      
    // https://en.wikipedia.org/wiki/BMP_file_format
    function getBmpInfoHeader(img, compressionMode) {
        const buf = Buffer.alloc(40);
        const bitmap = img.bitmap;
        const size = bitmap.data.length;
        const width = bitmap.width;
        // https://en.wikipedia.org/wiki/ICO_(file_format)
        // ...Even if the AND mask is not supplied,
        // if the image is in Windows BMP format,
        // the BMP header must still specify a doubled height.
        const height = compressionMode === 0 ? width * 2 : width;
        const bpp = 32;
      
        buf.writeUInt32LE(40, 0); // The size of this header (40 bytes)
        buf.writeInt32LE(width, 4); // The bitmap width in pixels (signed integer)
        buf.writeInt32LE(height, 8); // The bitmap height in pixels (signed integer)
        buf.writeUInt16LE(1, 12); // The number of color planes (must be 1)
        buf.writeUInt16LE(bpp, 14); // The number of bits per pixel
        buf.writeUInt32LE(compressionMode, 16); // The compression method being used.
        buf.writeUInt32LE(size, 20); // The image size.
        buf.writeInt32LE(0, 24); // The horizontal resolution of the image. (signed integer)
        buf.writeInt32LE(0, 28); // The horizontal resolution of the image. (signed integer)
        buf.writeUInt32LE(0, 32); // The number of colors in the color palette, or 0 to default to 2n
        buf.writeUInt32LE(0, 36); // The number of important colors used, or 0 when every color is important; generally ignored.
      
        return buf;
    }
      
    // https://en.wikipedia.org/wiki/BMP_file_format
    // Note that the bitmap data starts with the lower left hand corner of the image.
    // blue green red alpha in order
    function getDib(img) {
        const bitmap = img.bitmap;
        const size = bitmap.data.length;
        const buf = Buffer.alloc(size);
        const width = bitmap.width;
        const height = width;
        const lowerLeftPos = (height - 1) * width * 4;
      
        for (let x = 0; x < width; x++) {
          for (let y = 0; y < height; y++) {
            const pxColor = img.getPixelColor(x, y);
      
            const r = (pxColor >> 24) & 255;
            const g = (pxColor >> 16) & 255;
            const b = (pxColor >> 8) & 255;
            const a = pxColor & 255;
      
            const bmpPos = lowerLeftPos - y * width * 4 + x * 4;
      
            buf.writeUInt8(b, bmpPos);
            buf.writeUInt8(g, bmpPos + 1);
            buf.writeUInt8(r, bmpPos + 2);
            buf.writeUInt8(a, bmpPos + 3);
          }
        }
      
        return buf;
    }
})();

async function tinyPng(source,target,resize,tiny){
    await sharp(source).resize(resize).png().toFile(target);

    if(tiny){
        var res=await imagemin([target], {
            plugins: [
                imageminPngquant({
                    speed: 1,
                    quality: [0.7, 0.9] //lossy settings
                })
            ]
        });
    
        fs.writeFileSync(target, res[0].data);
    }
   
}

var projectConfig=require('./source/project.config.json');

var logo=path.join(__dirname,'source', projectConfig.logo);



var autoGenerateIcon=projectConfig.autoGenerateIcon;

(async () => {

    //platform-web
    var logo_path=path.join(__dirname,'platform','web','logo');
    
    if(autoGenerateIcon.web.tile_squareLarge)await tinyPng(logo,path.join(logo_path ,'tile_squareLarge.png'),558,true);
    if(autoGenerateIcon.web.tile_squareMedium)await tinyPng(logo,path.join(logo_path ,'tile_squareMedium.png'),270,true);
    if(autoGenerateIcon.web.tile_squareSmall)await tinyPng(logo,path.join(logo_path ,'tile_squareSmall.png'),128,true);
    if(autoGenerateIcon.web.icon_homeButton)await tinyPng(logo,path.join(logo_path ,'icon_homeButton.png'),114,true);

    if(autoGenerateIcon.web.icon_favicon)await sharp(logo).resize(16).png().toFile(path.join(logo_path, 'icon_favicon.gif'));

    if(autoGenerateIcon.web.favicon){
        var png_48=path.join(logo_path ,'48.png');
        await tinyPng(logo,png_48,48);

        var buf=await pngToIco(png_48);
        fs.writeFileSync(path.join(logo_path, 'favicon.ico'), buf);
        fs.unlinkSync(png_48);
    }
   
    console.log('success');

})();
