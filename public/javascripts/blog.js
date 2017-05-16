var apipath = 'http://59.110.170.167:3000/';
var pageBar = new Vue({
    el: '.page-bar',
    data: {
        all: document.getELementById("total").innerHTML, //总页数
        cur: 1//当前页码
    },
    watch: {
        cur: function(oldValue , newValue){
            console.log(arguments);
        }
    },    
    methods: {
        btnClick: function(data){//页码点击事件
            if(data != this.cur){
                this.cur = data;
                this.$http.get(apipath+'/postblog',{page: this.cur}).then(function(res){
                    alert(res.body);    
                },function(){
                    alert('请求失败处理');   //失败处理
                });
            }
            
        },
        pageClick: function(){
            console.log('现在在'+this.cur+'页');
        }
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
})