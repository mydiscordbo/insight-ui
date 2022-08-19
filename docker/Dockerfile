FROM node:8-alpine

RUN apk add --update --no-cache git \
                                libzmq \
                                zeromq-dev \
                                python \
                                make \
                                g++

WORKDIR /insight

# Copy vkaxcore-node
RUN git clone --branch master --single-branch --depth 1 https://github.com/vkaxevo/vkaxcore-node.git .

# Copy config file
COPY vkaxcore-node.json .

# Install NPM modules
RUN npm ci

ARG VERSION
ARG MAJOR_VERSION

# Install Insight modules
RUN bin/vkaxcore-node install @vkaxevo/insight-api@${MAJOR_VERSION}
RUN bin/vkaxcore-node install @vkaxevo/insight-ui@${VERSION}

FROM node:8-alpine

LABEL maintainer="Vkax Developers <developer@vkax.xyz>"
LABEL description="Dockerised Insight-Vkax"

WORKDIR /insight

# Copy project files
COPY --from=0 /insight/ .

EXPOSE 3001

CMD ["bin/vkaxcore-node", "start"]
