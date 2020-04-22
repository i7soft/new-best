var equal=require('./Equal');

function addPrototype(object,props){
    for(var x in props){
        object.prototype[x]=props[x]
    }
}

function addStatic(object,props){
    for(var x in props){
        object[x]=props[x]
    }
}

if(!Object.Equals){

    // 确定两个对象实例是否相等
    Object.Equals=function(a,b){
        
        return equal(a,b);
    };

    function Size(input){
        return input.length;
    }

    addPrototype(Array,{
        // 创建 Array 的浅表副本。
        // https://docs.microsoft.com/zh-cn/dotnet/api/system.array.clone?view=netframework-4.7.2
        Clone:function(){
            var array=this;
            var newArray=[];
            for (var i = 0,l=Size(array); i < l; i++) {
                newArray.push(array[i]);
            }
            return newArray;
        },

        // 从指定的目标数组索引处开始，将当前一维数组的所有元素复制到指定的一维数组中。
        // https://docs.microsoft.com/zh-cn/dotnet/api/system.array.copyto?view=netframework-4.7.2
        CopyTo:function(array,index){

            var that=this;
        
            for (var i = 0,l=Size(that); i < l; i++) {
                array[index+i]=that[i];
            }

        },


    });

    addStatic(Array,{
        // 将一个 Array 的一部分元素复制到另一个 Array 中
        // https://docs.microsoft.com/zh-cn/dotnet/api/system.array.copy?view=netframework-4.7.2
        Copy:function(sourceArray, sourceIndex, destinationArray, destinationIndex, length){

            var sourceArrayLength=Size(sourceArray);

            var endIndex=Math.min(sourceArrayLength,sourceIndex+length);

            for (var i = sourceIndex; i < endIndex; i++) {
                destinationArray[destinationIndex+i-sourceIndex]=sourceArray[i];
            }
        },

        // 确定指定数组包含的元素是否与指定谓词定义的条件匹配。
        // https://docs.microsoft.com/zh-cn/dotnet/api/system.array.exists?view=netframework-4.7.2
        Exists:function(array, match){

        
            for (var i = 0,l=Size(array); i < l; i++) {
                var res=match && match(array[i]);
                if(res) return true;
            }

            return false;
        },

        // 搜索与指定谓词所定义的条件相匹配的元素，并返回整个 Array 中的第一个匹配元素。
        // https://docs.microsoft.com/zh-cn/dotnet/api/system.array.find?view=netstandard-2.1
        Find:function (array,match) {
        
            var result = null; 
            for (var i = 0,l=Size(array); i < l; i++) {
                var item = array[i];
                
                var res = match && match(item);
                if (res) {
                    result = item;
                    break;
                }
            }
            return result;
        },

        // 检索与指定谓词定义的条件匹配的所有元素。
        // https://docs.microsoft.com/zh-cn/dotnet/api/system.array.findall?view=netstandard-2.1
        FindAll : function (array,match) {
        
            var result = []; 
            for (var i = 0,l=Size(array); i < l; i++) {
                var item = array[i];
                
                var res = match && match(item);
                if (res) {
                    result.push(item);
                }
            }
            return result;
        },

        // 搜索与指定谓词定义的条件匹配的元素，然后返回 Array 或其某个部分中第一个匹配项的从零开始的索引。
        // https://docs.microsoft.com/zh-cn/dotnet/api/system.array.findindex?view=netstandard-2.1
        FindIndex : function (array) {

            var args=arguments;
            var args_1=args[1];
            var match;
            var startIndex=0,length=Size(array);
            if(args_1){
                if(typeof args_1=='function'){
                    match=args_1;
                }
                else{
                    startIndex=args_1;
                    var args_2=args[2];
                    if(typeof args_2=='function'){
                        match=args_2;
                    }
                    else{
                        length=args_2;
                        match=args[3];
                    }
                }
            }
        
        
            var result = -1; 
            for (var i = startIndex,l=Math.min(startIndex+length,Size(array)); i < l; i++) {
                var item = array[i];
                
                var res = match && match(item);
                if (res) {
                    result = i;
                    break;
                }
            }
            return result;
        },

        // 搜索与指定谓词所定义的条件相匹配的元素，并返回整个 Array 中的最后一个匹配元素
        // https://docs.microsoft.com/zh-cn/dotnet/api/system.array.findlast?view=netstandard-2.1
        FindLast : function (array,match) {
        
            var result = null; 
            for (var i = Size(array)-1; i >=0; i--) {
                var item = array[i];
                
                var res = match && match(item);
                if (res) {
                    result = item;
                    break;
                }
            }
            return result;
        },

        // 搜索与指定谓词定义的条件匹配的元素，然后返回 Array 或其某个部分中最后一个匹配项的从零开始的索引。
        // https://docs.microsoft.com/zh-cn/dotnet/api/system.array.findlastindex?view=netstandard-2.1
        FindLastIndex : function (array) {

            var args=arguments;
            var args_1=args[1];
            var match;
            var startIndex=Size(array)-1,length=Size(array);
            if(args_1){
                if(typeof args_1=='function'){
                    match=args_1;
                }
                else{
                    startIndex=args_1;
                    var args_2=args[2];
                    if(typeof args_2=='function'){
                        match=args_2;
                    }
                    else{
                        length=args_2;
                        match=args[3];
                    }
                }
            }
        
        
            var result = -1; 
            for (var i = startIndex,l=Math.max(startIndex-length,0); i >l; i--) {
                var item = array[i];
                
                var res = match && match(item);
                if (res) {
                    result = i;
                    break;
                }
            }
            return result;
        },

        // 对指定数组的每个元素执行指定操作。
        // https://docs.microsoft.com/zh-cn/dotnet/api/system.array.foreach?view=netstandard-2.1
        ForEach:function(array,action){
            for (var i = 0,l=Size(array); i < l; i++) {
                action && action(array[i]);
            }
        },

        // 在一个一维数组或该数组的一系列元素中搜索指定对象，并返回其首个匹配项的索引。
        // https://docs.microsoft.com/zh-cn/dotnet/api/system.array.indexof?view=netstandard-2.1
        IndexOf:function(array,value,startIndex,count){

            startIndex=startIndex||0;
            count=count||Size(array);
            count=Math.min(count,Size(array));

            for(var i=startIndex;i<count;i++){
                if(equal(array[i],value))return i;
            }
            return -1;
        },

        // 返回一维 Array 或部分 Array 中某个值的最后一个匹配项的索引。
        // https://docs.microsoft.com/zh-cn/dotnet/api/system.array.lastindexof?view=netstandard-2.1
        LastIndexOf:function(array,value,startIndex,count){

            startIndex=startIndex||(Size(array)-1);
            count=count||Size(array);
            var l=Math.max(startIndex-count,0);

            for(var i=startIndex;i>l;i--){
                if(equal(array[i],value))return i;
            }
            return -1;
        },

        // 将一维数组的元素数更改为指定的新大小。
        // https://docs.microsoft.com/zh-cn/dotnet/api/system.array.resize?view=netstandard-2.1
        // 此方法分配指定大小的新数组，从旧的数组的元素复制到新，然后使用新替换旧的数组。
        // 如果array是null，此方法具有指定大小创建一个新数组。
        // 如果newSize等同于Length的旧的数组，此方法不执行任何操作
        Resize:function(array,newSize){

            var newArray=array;

            if(array){
                var size=Size(array);
                if(size!=newSize){
                    newArray= new Array(newSize);
                    Array.Copy(array,0,newArray,0,Math.min(size,newSize));
                }
            }
            else{
                newArray= new Array(newSize);
            }
            return newArray;
        },

        // 反转一维 Array 或部分 Array 中元素的顺序。
        // https://docs.microsoft.com/zh-cn/dotnet/api/system.array.reverse?view=netstandard-2.1
        Reverse:function(array,index,length){

        

            if(typeof index !='undefined' && length !='undefined'){
                var subArray=array.slice(index,index+length);
                subArray.reverse();
                for(var i=index;i<length;i++){
                    array[i]=subArray[i-index];
                }
            }
            else{
                array.reverse()
            }
            return array;
        },

        // 使用指定的 Array，对一维 IComparer 的部分元素进行排序。
        // https://docs.microsoft.com/zh-cn/dotnet/api/system.array.sort?view=netstandard-2.1
        Sort:function(array,index,length,comparer){

            var subArray=array.slice(index,index+length);
            subArray.sort(comparer);
            for(var i=index;i<length;i++){
                array[i]=subArray[i-index];
            }

            return array;
        },

        // 确定数组中的每个元素是否都与指定谓词定义的条件匹配。
        // https://docs.microsoft.com/zh-cn/dotnet/api/system.array.trueforall?view=netstandard-2.1
        TrueForAll : function (array,match) {
    
            for (var i = 0,l=Size(array); i < l; i++) {
                var item = array[i];
                
                var res = match && match(item);
                if (!res) {
                    return false;
                }
            }
            return true;
        }
    });

   


   

  

    

    

   

    

    
}

