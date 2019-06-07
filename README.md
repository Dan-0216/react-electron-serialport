# Serialport-Tool 
桌面应用串口工具,用来读取计算机串口
***
## 技术栈
    - react + react router + redux 
    - electron 
    - node-serialport
    - socket.io
    

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

