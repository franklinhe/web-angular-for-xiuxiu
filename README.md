# WebAngularForXiuxiu - 医案管理 H5

## init(node: version > 12, cnpm)
    cnpm i

node-sass的编译问题的处理：
cd node-modules
git clone https://github.com/sass/node-sass.git
cd node-sass
vi package.json文件中nodeSassConfig>binarySite的值https://npm.taobao.org/mirrors/node-sass/
npm install
## run 
    npm run start
## build 
    npm run build-prod

## 配置文件 src/environments/*

    environment.api 当前使用的后台接口地址

    npm run start-o 使用的 environment.ts
    npm run build-prod 使用的 environment.prod.ts


## to do
1、数据后台化；
2、方剂分析界面适合手机端使用的改造；
3、生成.exe本地可以运行的方式；
4、服务器用户注册与管理，与微信等第三方应用绑定推广。

