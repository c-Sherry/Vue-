// 由于 webpack 是基于Node进行构建的，所有，webpack的配置文件中，任何合法的Node代码都是支持的
var path = require('path');
// 导入在内存中生成 HTML 页面的 插件
// 只要是插件，都一定要 放到 plugins 节点中去
// 这个插件的两个作用：
//  1. 自动在内存中根据指定页面生成一个内存的页面
//  2. 自动，把打包好的 main.js 追加到页面中去
var htmlWebpackPlugin = require('html-webpack-plugin');

// 这个配置文件，起始就是一个 JS 文件，通过 Node 中的模块操作，向外暴露了一个 配置对象
module.exports = {
    //配置打包模式为开发模式
    mode: 'development',
    // 入口，表示，要使用 webpack 打包哪个文件
    entry: path.join(__dirname, './src/index.js'),
    // 指定 打包好的文件，输出到哪个目录中去
    output: {
        path: path.join(__dirname, './dist'), // 输出路径
        filename: 'main.js' // 指定输出文件的名称
    },
    plugins: [ // 所有webpack  插件的配置节点
        new htmlWebpackPlugin({// 创建一个在内存中生成 HTML页面的插件
            template: path.join(__dirname, './src/index.html'), // 指定模板文件路径
            filename: 'index.html' // 设置生成的内存页面的名称
        })
    ],
    //配置所有第三方loader模块的
    module:{
        rules:[//第三方模块的匹配规则  想匹配所有后缀名为.css的文件加一个$
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }, // 处理 CSS 文件的 loader
            { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] }, // 处理 less 文件的 loader
            { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] }, // 处理 scss 文件的 loader
            // 处理 图片路径的 loader
            { test: /\.(jpg|png|gif|bmp|jpeg)$/, use: 'url-loader?limit=18577&name=[hash:8][name].[ext]' },
            // 防止图片名重名 若想用自己的图片名则 &name=[name].[ext]
            //若想防止自己的图片重名. 在前面放一个hash值   &name=[hash:8]-[name].[ext]
            //hash值可以理解为DNA，那就保证了没有两个数据的哈希值是完全相同的。只有32位.
            { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader' }, // 处理 字体文件的 loader
            { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }, // 配置 Babel 来转换高级的ES语法
            // 2.2 注意： 在配置 babel 的 loader规则时，必须 把 node_modules 目录，通过 exclude 选项排除掉：
            // 原因有俩：
            // 2.2.1 不排除 node_modules， 则Babel 会把 node_modules 中所有的 第三方 JS 文件，都打包编译，这样，会非常消耗CPU，同时，打包速度非常慢；
            // 2.2.2 哪怕，最终，Babel 把 所有 node_modules 中的JS转换完毕了，但是，项目也无法正常运行！
            // 3. 在项目的 根目录中，新建一个 叫做 .babelrc  的Babel 配置文件，这个配置文件，属于JSON格式，所以，在写 .babelrc 配置的时候，必须符合JSON语法规范： 不能写注释，字符串必须用双引号
            { test: /\.vue$/, use: 'vue-loader' }, // 处理 .vue 文件的 loader
            {
                test: /vue-preview.src.*?js$/,
                loader: 'babel-loader'
            },

        ]


    },
    //
    resolve: {
        alias: {// 修改 Vue 被导入时候的包的路径
            'vue$': 'vue/dist/vue.js'
        }
    }
}