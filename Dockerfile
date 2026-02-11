FROM oven/bun:1.3.5-slim

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /

RUN curl -L -o /sharkord https://github.com/lipka28/sharkord-at-home/releases/latest/download/sharkord-linux-x64

ENV RUNNING_IN_DOCKER=true
RUN chmod +x /sharkord

CMD ["/sharkord"]
