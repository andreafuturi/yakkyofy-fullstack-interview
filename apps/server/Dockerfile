FROM node:20.11-alpine3.19

WORKDIR /app

# Copy only package files first to leverage cache
COPY package.json yarn.lock ./
COPY apps/server/package.json ./apps/server/

# Copy shared packages
COPY packages ./packages

# Install dependencies
RUN yarn install

# Copy source files
COPY ./apps/server ./apps/server

# Add non-root user for security
USER node

CMD ["yarn", "workspace", "server", "dev"]