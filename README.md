# 项目初始化结构生成工具

## 搭建过程 

### 创建npm账号
再[官网](https://www.npmjs.com)上注册一个npm的账号

本地的npm添加账户（上一步注册得账号）
```
npm add user
```
查看当前的用户是谁
```
npm whoami
```

发布到npm官网上
```
npm publish
```
注意：每次发布得时候记得改依稀package.json中的版本号，否则会发布失败

按git标签发布
```
npm publish --tag 0.1.0
```

## 创建全局工具的方式
package.json中配置
```javascript
"bin": {
    "zk-init": "./bin/zk-init.js"
}

```
zk-init.js文件写法

```
#!/usr/bin/env node
if (process.argv.length === 3 &&
    (process.argv[2] === '-v' || process.argv[2] === '--version')) {
    console.log(require('../package').version);
    return;
}
```
注意：#!/usr/bin/env node，表明整个文件将以node方式运行，zk-init.js是一个node环境，要什么功能自由发挥吧。
## 使用方式
发布之后就可以通过npm安装了
```
sudo npm install zk-init -g
```
查看版本
```
zk-init -V // 大写得v
或
zk-init --version
```
查看帮助
```
zk-init -h
或
zk-init --help
```
## 命令参数说明
```
-V --version 查看版本号
-t --templatename 模板名
-r --rename 重命名文件夹
-f --folder 包含顶层文件夹
```

## 示例
```
zk-init jquery-simple
或者
zk-init -t jquery-simple
you will get:
- css
- js
- index.html

```

```
zk-init -t jquery-simple -f
you will get:
- jquery-simple
    - css
    - js
    - index.html
```

```
zk-init -t jquery-simple -r jquery-web
you will get:
- jquery-web
    - css
    - js
    - index.html
```

## 需要创建的项目模板
前端的项目，只提供webpack打包方式，提供less等集成

simple: // 无构建工具，只用html+css+js
webpack: // webpack 构建，提供less webpack-dev-server 

- jQuery
    - jQuery simple // 无构建工具，只用html+css+js
    - jQuery webpack
- BootStrap
    - BootStrap simple
    - BootStrap webpack
- React 
    - React webpack
- node 
- python 
- java 

## 实现思路
模板都单独放到github上，通过命令clone下来，并把.git文件夹删掉。这种方式不好，运行速度太慢了，而且断网情况下无法使用。
