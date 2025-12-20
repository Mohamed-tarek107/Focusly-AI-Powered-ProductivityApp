# run in a machine that has node 20 
FROM node:20

# create a folder for running 
WORKDIR /app

# copy the packages
COPY package*.json ./

# Install packages 
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]