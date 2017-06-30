const Koa = require('koa')
const app = new Koa()

const qiniu = require('qiniu')

const accessKey = ''//
const secretKey = ''//
const mac = new qiniu.auth.digest.Mac(accessKey,secretKey)
const options = {
	scope: ''//
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

const config = new qiniu.conf.Config()
config.zone = qiniu.zone.Zone_z2
const localFile = ''//本地文件
const formUploader = new qiniu.form_up.FormUploader(config)
const putExtra = new qiniu.form_up.PutExtra()
const key = ''//上传后文件名

formUploader.putFile(uploadToken,key,localFile,putExtra,function(respErr,respBody,respInfo){
	if(respErr){
		throw respErr
	}
	if(respInfo.statusCode == 200){
		console.log(respBody)
	}else{
		console.log(respInfo.statusCode)
		console.log(respBody)
	}
})

app.listen(3000)
console.log('server at port 3000')
