FROM alpine:3.18

# 安裝 Node.js 和必要套件
RUN apk add --no-cache \
    nodejs \
    npm \
    udev \
    bash \
    && rm -rf /var/cache/apk/*

LABEL maintainer="chaoen5@gmail.com"

# 建立 udev 規則目錄
RUN mkdir -p /etc/udev/rules.d

# 添加 udev 規則，允許存取 USB 序列埠設備
RUN echo 'SUBSYSTEM=="usb", ATTRS{idVendor}=="10c4", ATTRS{idProduct}=="ea60", MODE="0666"' > /etc/udev/rules.d/99-zigbee.rules

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

# 啟動 udev
CMD [ "/run.sh" ]
