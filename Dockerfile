# DOCKER-VERSION 0.10.0

FROM ubuntu:12.04

RUN apt-get -y install git
RUN apt-get -y install build-essential libssl-dev curl
RUN git clone https://github.com/creationix/nvm.git /.nvm
RUN echo ". /.nvm/nvm.sh" >> /etc/bash.bashrc

RUN /bin/bash -c '. /.nvm/nvm.sh && nvm install v0.11.12 && nvm use v0.11.12 && nvm alias default v0.11.12 && ln -s /.nvm/v0.11.12/bin/node /usr/bin/node && ln -s /.nvm/v0.11.12/bin/npm /usr/bin/npm'

RUN git clone https://github.com/sriddell/presentmgr-node.git

RUN cd presentmgr-node; npm install

EXPOSE 3000
WORKDIR presentmgr-node

ENTRYPOINT git pull && npm start