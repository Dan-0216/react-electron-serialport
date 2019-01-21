# Serialport-Tool 
桌面应用串口工具,用来读取计算机串口连接称重设备与滚动皮带信息,对接厂商软件获取条码信息,整合条码和称重信息后发送给工作站前端.并根据前端返回信息进行皮带滚动.
***
## 技术栈
    - react + react router + redux 
    - electron 
    - node-serialport
    - socket.io
    
## 工作流程

### 工作流
桌面应用通过发送称重信息+串口信息给工作站前端。工作站返回成功信息给桌面应用，桌面应用通过串口控制皮带转动。
### 原理
1.首先建立socket服务器.端口为8089,与厂商软件建立连接,厂商发送的信息包括，扫描相机ip,条码信息. 

2.桌面应用通过串口直连的方式读取，主机串口上的称重信息与滚动皮带。(一个供包台主机对应两个供包点，也就是读取两个串口称重与两个滚动皮带串口).  

3.通过在桌面应用上绑定 扫描设备ip--AGV停靠点ip  串口--AGV停靠点ip--串口类型,将厂商软件发送的条码信息解析为 AGV停靠点ip+条码+称重 通过socket方式发送给工作站前端.工作站返回成功信息给桌面应用,桌面应用通过AGV停靠点ip信息,控制相关的皮带滚动.

## 运行环境
- node 8.11.3
- webpack 4.16.0
- node-gyp 3.7.0
- electron 1.4.13
- python  2.7.12


## 如何使用 && 打包发布

### 运行程序
```bash
#第一步 首先在根目录下安装
npm install 
#第二步 启动程序
npms start
```

### 打包发布 exe程序
```bash
# 第一步 首先在根目录运行webpack命令
webpack

# 第二步 在根目录运行package 打包命令
npm run package

# 第三步 打包成功后可看到根目录多了一个OutApp文件夹 在OutApp\Quicktron-win32-x64\resources\app 文件夹下 执行命令 npm install --production
npm install --production

# 第四步 加密混淆源码 根目录下运行 npm run asar 同时会删除OutApp\Quicktron-win32-x64\resources\app 下的源码
npm run asar

```

