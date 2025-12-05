FROM node:18.20.8

# Install app dependencies
COPY package*.json ./
RUN npm install

RUN apt-get update && \
  apt-get install -y ffmpeg && \
  rm -rf /var/lib/apt/lists/*

# Bundle app source
COPY . .

CMD ["npm", "start"]
