FROM node:20.11-alpine3.19

WORKDIR /app

# Copy only package files first to leverage cache
COPY package.json yarn.lock ./
COPY apps/client/package.json ./apps/client/

# Copy shared packages
COPY packages ./packages 

# Install dependencies
RUN yarn install

# Copy source files
COPY ./apps/client ./apps/client

CMD ["yarn", "workspace", "client", "dev", "--host"] 