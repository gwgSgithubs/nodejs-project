

// $(function(){

  var app={
    toggle:function(el,db,attr,id){
      $.get('/admin/changeStatus',{db:db,attr:attr,id:id},function(data){
        if(data.success){
          if(el.src.indexOf('yes')!=-1){
            el.src='/admin/images/no.gif';
          }else{
            el.src='/admin/images/yes.gif';
          }
        }
      })
    },
    changeSort: function(el, db, id){
      let val = el.value;
      console.log(val);
      $.get('/admin/changeSort', {db:db, id:id, sort:val}, function(data){
        if(data.success){
          console.log(data.success);
        }
      })
    },
    confirmDelete: function(){
      $('.delete').click(function(){
        let flag = confirm('您确定要删除吗?');
        return flag;
      })
    },
    pagination: function(){
      
    }
  }
  app.confirmDelete();
  app.pagination();
// }())
