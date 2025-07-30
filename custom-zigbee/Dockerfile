FROM alpine:3.18

# 安裝 Node.js 和必要套件
RUN apk add --no-cache \
    nodejs \
    npm \
    bash \
    && rm -rf /var/cache/apk/*

LABEL maintainer="chaoen5@gmail.com"

# 設定工作目錄
WORKDIR /app

# 複製 package 檔案並安裝依賴
COPY package*.json ./
RUN npm install --production

# 複製源碼
COPY src ./src
COPY run.sh /run.sh
RUN chmod a+x /run.sh

# 建立資料目錄
RUN mkdir -p /data

# 設定權限
RUN chown -R root:root /app /data

CMD [ "/run.sh" ]
