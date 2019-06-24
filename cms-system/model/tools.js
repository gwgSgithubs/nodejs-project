const md5 = require('md5');
const multer = require('koa-multer');   // 引入图片上传的目录
module.exports = {
  md5(str){
    return md5(str);
  },
  resList(data){
    let resArr = [];
    for(let i = 0; i < data.length; i++){
      if(data[i].pid == '0'){
        resArr.push(data[i])
      }
    }
    for(let i = 0; i < resArr.length; i++){
      resArr[i].arr = [];
      for(let j = 0; j < data.length; j++){
        if(resArr[i]._id == data[j].pid){
          resArr[i].arr.push(data[j])
        }
      }
    }
    return resArr;
  },
  upload(){
    // 配置
    let storage = multer.diskStorage({
      //文件保存路径
      destination: function (req, file, cb) {
        cb(null, 'public/uploads') //注意路径必须存在  配置图片上传目录
      },                            //修改文件名称
      filename: function (req, file, cb) {  // 图片上传完成重命名
        var fileFormat = (file.originalname).split(".");  // 获取后缀名 分割数组
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
      }
    })
    //加载配置
    let upload = multer({ storage: storage });
    return upload;
  }
}
