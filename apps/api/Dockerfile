FROM node:22-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package.json
COPY package.json ./

# Copy schema package
COPY ../../packages/schema ./packages/schema/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build schema package
RUN cd packages/schema && pnpm build

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm db:generate

# Expose port
EXPOSE 3001

# Default command
CMD ["pnpm", "dev"] 