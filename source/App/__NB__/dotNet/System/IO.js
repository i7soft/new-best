var IO = {
    File:{
        // Exists: function (path) {
        //     var fs = require('fs');

        //     var result= fs.existsSync(path);

        //     return result;
        // },
    },
    Path:{
        //合并路径
        Combine:function(){
            var result="";
            for (var i = 0; i < arguments.length; i++) {
                var item=arguments[i];
                if (item != undefined) {
                    item=item.Trim('/');
                    result+='/'+item;
                }
            }
            return result.substr(1);
        }
    }

};

module.exports=IO;