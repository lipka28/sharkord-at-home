FROM ubuntu:22.04

COPY apps/server/build/out/sharkord-linux-x64 /sharkord

RUN chmod +x /sharkord

CMD ["/sharkord"]