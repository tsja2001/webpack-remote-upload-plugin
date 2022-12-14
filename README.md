# webpack 打包完成后,自动远程部署插件

# 安装
```js
npm i webpack-auto-upload-plugin -D
```

# 使用
```js
// webpack.config.js
const WebpackAutoUploadPlugin = require('webpack-auto-upload-plugin')

module.exports = {
	...
  plugins: [
		new WebpackAutoUploadPlugin({
      // 服务器地址(必传)
      host: '123.456.789'
      // 服务器用户名(默认root)
      username: 'root'
      // 服务器连接密码(必传)
      password: 'xxxxxx'
      // 文件部署到服务器的位置(必传)
      remotePath: '/root/public'
    })
  ]
}
```

每次执行 `npx webpack`或者`npm run build`打包命令时, 就会将打包好的文件自动部署到远程服务器中

# 源码
https://github.com/tsja2001/webpack-auto-upload-plugin