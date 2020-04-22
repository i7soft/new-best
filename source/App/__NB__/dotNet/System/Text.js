var buffer=require('../../utils/Buffer').Buffer;

var Text = {
    Encoding:{
        ASCII:{
            GetBytes: function (string) {
                return buffer(string,'ascii');
            },
        },
        UTF8:{
            GetBytes: function (string) {
                return buffer(string,'utf8');
            },
        }
    }

};

module.exports=Text;