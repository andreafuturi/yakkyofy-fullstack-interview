FROM node:20.11-alpine3.19

WORKDIR /app

# Install Chromium and its dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set Chromium environment variables
ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/

# Copy only package files first to leverage cache
COPY package.json yarn.lock ./
COPY apps/consumer/package.json ./apps/consumer/

# Copy shared packages
COPY packages ./packages 

# Install dependencies
RUN yarn install

# Copy source files
COPY ./apps/consumer ./apps/consumer

# Add non-root user for security
USER node

CMD ["yarn", "workspace", "consumer", "dev"]