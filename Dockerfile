FROM oven/bun:1.3.5 AS builder

WORKDIR /app

COPY package.json bun.lockb* ./
COPY . .

RUN bun install

RUN cd apps/server && bun run build

FROM oven/bun:1.3.5-slim

WORKDIR /

COPY --from=builder /app/apps/server/build/out/sharkord-linux-x64 /sharkord

ENV RUNNING_IN_DOCKER=true

RUN chmod +x /sharkord

CMD ["/sharkord"]
