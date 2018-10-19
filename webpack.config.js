module.exports = {
　context:__dirname+"/src", //源文件目录
　　entry:{
　　　　app:"./index.js" //在源文件目录下去找index.js 文件作为打包的入口文件
　　},
　　output:{
　　　　path:__dirname+"/dist", //生成的文件存放目录
       publicPath:"./dist/", //图片文件打包生成路径
　　　　filename:"[name].bundle.js" //生成的文件 name 表示entry下面的app
　　},
module:{
    rules:[
        {
            test:/\.jsx?$/,
            exclude: /node_modules/,
            use: [{
                loader: "babel-loader",
                options: { presets: ["react","es2015","stage-1"] }
            }],
        },
        {   //这里的内容是新增加的对样式的支持
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
        },
        　{
            　test: /\.(png|jpg)$/,
            　loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
        },{
            test: /\.node$/,
			loader: 'node-loader'
        }
    ]
},
    target:'electron-renderer',
    externals: {
        serialport: "serialport",
        bindings:"bindings"
    }
};