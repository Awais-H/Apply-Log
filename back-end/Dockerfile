FROM node:22-alpine

WORKDIR /app

COPY package*json .

RUN npm install

#Copying from source destination to working directory
COPY . .

# Generate Prisma client at build time
RUN npx prisma generate

EXPOSE 5000

CMD ["node", "./src/server.js"]