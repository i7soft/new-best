Page({
    data:{
        value:'',
        showWebView:'',
    },
    onLoad:function(options){

        // console.log(options);

        var value=options.value;
       
        this.setData({
            value:value,
            showWebView:value.toLowerCase().indexOf('http')==0
        })
    }
})