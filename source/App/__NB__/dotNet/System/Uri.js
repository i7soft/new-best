
module.exports=function (uriString) {

        // _classCallCheck(this, Uri);

        if (uriString.indexOf("://")==-1) uriString = "nb://127.0.0.1" + (uriString.StartsWith("/") ? "" : "/") + uriString;

        var result={};
        result.OriginalString=uriString;
   
        var schemeIndex=uriString.indexOf(':');
        result.Scheme=uriString.substr(0,schemeIndex).toLowerCase();
        if(result.Scheme=="file")result.IsFile=true;
        else result.IsFile=false;

        var url=uriString.substr(schemeIndex+3);
        var pathIndex=url.indexOf('/');
        if(pathIndex==-1){
            url=url+'/';
            pathIndex=url.indexOf('/');
        }
        result.Authority=url.substr(0,pathIndex);//带端口的路径
        var portIndex=result.Authority.indexOf(':');
        if(portIndex>-1){
            var port=result.Authority.substr(portIndex+1);
            result.Port=port;
            if(result.Scheme=="https"){
                if(port=="443") result.IsDefaultPort=true;
                else result.IsDefaultPort=false;
            }
            else{
                if(port=="80") result.IsDefaultPort=true;//这里的判断不是十分严谨，还有 ftp 等其他协议没处理
                else result.IsDefaultPort=false;
            }
            result.Host=result.Authority.substr(0,portIndex);
        }
        else{
            result.IsDefaultPort=true;
            if(result.Scheme=="https"){
                result.Port="443";
            }
            else{
                result.Port="80";//这里的判断不是十分严谨，还有 ftp 等其他协议没处理
            }
            result.Host=result.Authority;
        }
    

        var fragmentIndex=url.indexOf('#');
        if(fragmentIndex>-1) {
            result.Fragment=url.substr(fragmentIndex);
            result.PathAndQuery=url.substr(pathIndex,fragmentIndex-pathIndex);
        }
        else {
            result.Fragment="";
            result.PathAndQuery=url.substr(pathIndex);
        }

        

        var queryIndex=result.PathAndQuery.indexOf('?');

        result.Parameters={};
        if(queryIndex>-1){
            result.Query=result.PathAndQuery.substr(queryIndex);
            var strs=result.Query.substr(1).split('&');
            //
            for(var i=0,len=strs.length;i<len;i++){
                if(strs[i]=='')continue;
                var tmp=strs[i].indexOf('=');
                result.Parameters[strs[i].substr(0,tmp)]=decodeURIComponent(strs[i].substr(tmp+1));//todo:处理转义
            }      
        }
        else {
            result.Query="";
        }

        if(queryIndex>-1){
            result.AbsolutePath=result.PathAndQuery.substr(0,queryIndex);

        }
        else{
            result.AbsolutePath=result.PathAndQuery;
        }

        result.Segments=result.AbsolutePath.Trim('/').split('/');


        return result;
    }
