const { NodeSSH } = require('node-ssh')

class MyPlugin {
  constructor(options) {
    this.ssh = new NodeSSH()
    this.options = options
    this.verifyOptions()
  }
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync(
      'AutoPlugin',
      async (compilation, callback) => {
        // 获取打包后的文件路径
        const outputPath = compilation.outputOptions.path
        // 远程服务器中文件的路径
        const remotePath = this.options.remotePath + '/'

        // ssh链接远程服务器
        await this.connectServer()

        // 先删除原有文件
        await this.ssh.execCommand(`rm -rf ${remotePath}*`)

        // 上传文件
        await this.uploadFile(outputPath, remotePath)

        // 关闭连接
        await this.ssh.dispose()

        callback()
      }
    )
  }

  // 连接服务器
  async connectServer() {
    console.log('connecting 正在连接远程服务器')

    try {
      await this.ssh.connect({
        host: this.options.host,
        username: this.options.username ?? 'root',
        password: this.options.password,
      })
    } catch (error) {
      throw new Error('connect failed 服务器连接失败', error)
    }

    console.log('connect succeeded 服务器连接成功')
  }

  // 上传文件
  async uploadFile(loaclPath, remotePath) {
    const status = await this.ssh.putDirectory(
      loaclPath,
      remotePath,
      {
        recursive: true, // 递归文件夹
        concurrency: 10, // 并发数
      }
    )
    if (status) {
      console.log('upload succeeded! 上传成功')
    } else {
      console.log('upload failed! 文件上传失败')
    }
  }

  // 验证传入options
  async verifyOptions() {
    if (!this.options.host) {
      throw new Error(
        'host is required 缺少host参数, 需要远程服务器地址'
      )
    }
    if (!this.options.password) {
      throw new Error(
        'password is required 缺少password参数, 需要服务器密码'
      )
    }
    if (!this.options.remotePath) {
      throw new Error(
        'remotePath is required 缺少remotePath参数, 需要放远程文件存放路径'
      )
    }
  }
}

module.exports = MyPlugin
module.exports.MyPlugin = MyPlugin
