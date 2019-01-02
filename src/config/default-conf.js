module.exports = {
    hostName: '0.0.0.0',
    port: 8989,
    root: process.cwd(), // 指向执行命令时所在的目录位置，为了实现默认在什么目录下执行命令，就在该目录下启用服务器
};
