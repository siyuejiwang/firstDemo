var bloglists = new Vue({
  el:"#list",
  data:{
      gridData: "",
      pages: ""
  },
  mounted: function() {
      this.$nextTick(function () {
          this.$http.('http://127.0.0.1:3000/getData',{page:1}).then(function(res) {
              console.log(res.data);

              this.gridData = res.data;
              this.pages = res.data;
          })
      })
  }
});
bloglists.gridData = 