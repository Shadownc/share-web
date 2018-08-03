# 基础镜像为node，版本为v8.9.3
FROM node:8.9.3
# 镜像作者，可以附加联系信息
MAINTAINER shadow

# 创建容器内的项目存放目录
RUN mkdir -p /srv/api
WORKDIR /srv/api

#  将Dockerfile当前目录下所有文件拷贝至容器内项目目录并安装项目依赖
COPY package.json /srv/api
RUN npm install
COPY . /srv/api

# 容器对外暴露的端口号，要和node项目配置的端口号一致
EXPOSE 3000

# 容器启动时执行的命令
#CMD [ "pm2", "restart", "/srv/api/index.js" ]
ENTRYPOINT ["node","index.js"]