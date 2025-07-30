ARG BUILD_FROM=ghcr.io/hassio-addons/base-nodejs:16.3.4
FROM $BUILD_FROM

LABEL maintainer="chaoen5@gmail.com"

# 安裝必要的套件
RUN apk add --no-cache \
    udev \
    && rm -rf /var/cache/apk/*

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
