FROM node:22-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package.json
COPY package.json ./

# Copy schema package
COPY ../../packages/schema ./packages/schema/

# Build schema package
RUN cd packages/schema && pnpm build

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Default command
CMD ["pnpm", "dev"] 