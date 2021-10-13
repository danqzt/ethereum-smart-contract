ARG VARIANT="focal"
FROM mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}
USER root
WORKDIR /home/app
RUN apt-get update && apt-get -y install curl gnupg && \
    curl -sL https://deb.nodesource.com/setup_14.x  | bash - && \
    apt-get -y install nodejs && npm install &&\
    npm install -g truffle@5.3.4