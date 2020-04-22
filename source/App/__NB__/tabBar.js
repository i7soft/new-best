function getIndexFromPath(list, pagePath) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].pagePath == pagePath) {
        return i;
      }
    }
  }
  
  function setData(that, data) {
    that.setData(data);
  }
  
  var themeColor = (typeof NBConfig !='undefined' && NBConfig.themeColor) || '#3cc51f';//主题颜色
  
  var isApp = false, isWechat = true, isMobile = true, isWeb = false, isIOS = false;
  if(typeof NB!='undefined'){
    //可以根据平台的不同，向用户展示不同的分享界面
    isApp = NB.IsApp, 
    isWechat = NB.IsWechat, 
    isMobile = NB.IsMobile, 
    isWeb = NB.IsWeb, 
    isIOS = NB.IsIOS;
  }
  
  Component({
  
    /**
    * 组件的属性列表
    */
    properties: {
      options: {
        type: Object,
        value: {},
        observer: function (newVal, oldVal, changedPath) {
          var that = this;
          var options = that.properties.options;
  
          var list = options.list || [];
          for (var i = 0; i < list.length; i++) {
            var pagePath = list[i].pagePath;
            if (pagePath.indexOf('/') != 0) list[i].pagePath = '/' + pagePath;//保证 tabbar 的路径是从根开始
          }
  
          setData(that, {
            selected: options.selected ||0,
            color: options.color || "#7A7E83",
            selectedColor: options.selectedColor || themeColor,
            backgroundColor: options.backgroundColor || '#f9f9f9',
            borderStyle: options.borderStyle || 'black',
            list: list,
            position: options.position || 'bottom'
          })
        }
      },
      url: {
        type: String,
        value: '',
        observer: function (newVal, oldVal, changedPath) {
          var that = this;
          var options = that.properties.options;
          setData(that, {
            selected: getIndexFromPath(options.list, newVal)
          })
        }
      },
      //修改配色设置
      tabBarStyle: {
        type: Object,
        value: {},
        observer: function (newVal, oldVal, changedPath) {
          var that = this;
  
          var data = {};
          for (var x in newVal) {
            data[x] = newVal[x];
          }
          setData(that, data);
        }
      },
      //修改 tabBar 的其中一项
      item: {
        type: Object,
        value: {},
        observer: function (newVal, oldVal, changedPath) {
          var that = this;
          var index = newVal.index;
          var item = that.data.list[index];
          for (var x in newVal) {
            if (x != 'index') {
              item[x] = newVal[x]
            }
          }
          var data = {};
          data['list[' + index + ']'] = item;
          setData(that, data);
        }
      },
      //在 tabBar 的项目上显示一个提醒的小圆点或数字
      //当 value 为 null 时，隐藏提醒，空字符串为显示小圆点
      badge: {
        type: Object,
        value: {},
        observer: function (newVal, oldVal, changedPath) {
          var that = this;
          var data = {};
          var value = newVal.value;
          if (value && value.length > 4) value = '...';
          data['list[' + newVal.index + '].badge'] = value;
          setData(that, data);
        }
      },
    },
  
    data: {
      // _options:{},
      height: 0,
      selected: 0,
      color: "",
      selectedColor: "",
      backgroundColor: '',
      borderStyle: '',
      list: [],
      position: ''
    },
    attached: function () {
      var res = wx.getSystemInfoSync();
      var tabbar_height = 48;
      if (isWeb && isMobile) {
        var safeArea = res.safeArea;
        if (safeArea.height < res.screenHeight) {
          tabbar_height = 80;
        }
      }
      this.setData({
        height: tabbar_height
      })
    },
    methods: {
      switchTab: function (e) {
        var that = this;
        var data = e.currentTarget.dataset;
  
        var currentSelected = that.data.selected;
  
        var tab_index = data.index;
  
        var item = that.data.list[tab_index];
  
        var url = item.pagePath;
  
        wx.switchTab({
          url: url,
          onPageLoadAnimation: {// NewBest 框架的自定义属性
            //注意：如果动画使用 translateX 来实现，在 ios safari 下会影响 position:fixed 的定位
            //建议：根据项目需要灵活使用
            fromPage: function () {
              return NB.createAnimation({ duration: 200 }).opacity(1).translateX(tab_index > currentSelected ? '-100%' : '100%').step().export();
            },
            toPage: function () {
              return NB.createAnimation({ duration: 0 }).opacity(1).translateX(tab_index > currentSelected ? '100%' : '-100%').step()
                .translateX(0).step({ duration: 200 }).export();
            }
          }
        });
  
  
        that.triggerEvent('tabItemTap', {
          index: tab_index,
          pagePath: url,
          text: item.text
        });
      }
    }
  })