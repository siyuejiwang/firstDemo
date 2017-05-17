// var apipath = 'http://59.110.170.167:3000/';
var apipath = 'http://127.0.0.1:3000/';
var total = document.getElementById("total").innerHTML;
var Emmiter = new Vue({});
var Lists = new Vue({
    el: '.Lists',
    data: {
        items:[]
    },   
    mounted: function(){
        var self = this;
        Emmiter.$on('my-event', (data) => {
            self.items = data;
        });
    }
});

var pageBar = new Vue({
    el: '.page-bar',
    data: {
        all: total, //总页数
        cur: 1//当前页码
    },
    watch: {
        cur: function(oldValue , newValue){
            console.log(arguments);
        }
    },    
    methods: {
        btnClick: function(data,flag){//页码点击事件
            if(data != this.cur || flag){
                this.cur = data;
                this.$http.get(apipath+'postblog1',{page: this.cur}).then(function(res){
                    Emmiter.$emit('my-event',res.data.lists); 
                },function(){
                    alert('请求失败处理');   //失败处理
                });
            }
            
        },
        pageClick: function(){
            console.log('现在在'+this.cur+'页');
        }
    },
    mounted: function(){
        this.btnClick(1,true);
    },
    
    computed: {
        indexs: function(){
          var left = 1;
          var right = this.all;
          var ar = [];
          if(this.all>= 5){
            if(this.cur > 3 && this.cur < this.all-2){
                    left = this.cur - 2
                    right = this.cur + 2
            }else{
                if(this.cur<=3){
                    left = 1
                    right = 5
                }else{
                    right = this.all
                    left = this.all -4
                }
            }
         }
        while (left <= right){
            ar.push(left)
            left ++
        }
        return ar
       }
         
    }
});

Vue.filter('formatDate',function formatDate(value) {
    var date = new Date(value);
     Y = date.getFullYear(),
     m = date.getMonth() + 1,
     d = date.getDate(),
     H = date.getHours(),
     i = date.getMinutes(),
     s = date.getSeconds();
     if (m < 10) {
      m = '0' + m;
     }
     if (d < 10) {
      d = '0' + d;
     }
     if (H < 10) {
      H = '0' + H;
     }
     if (i < 10) {
      i = '0' + i;
     }
     if (s < 10) {
      s = '0' + s;
     }
     <!-- 获取时间格式 2017-01-03 10:13:48 -->
     // var t = Y+'-'+m+'-'+d+' '+H+':'+i+':'+s;
     <!-- 获取时间格式 2017-01-03 -->
     var t = Y + '-' + m + '-' + d + ' '+ H + ':' + i + ':' + s;
     return t;
});
