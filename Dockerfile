FROM node:14

RUN mkdir -p /server

WORKDIR /server

ADD ./ /server

RUN npm install -g yarn;\
    yarn install; \
    yarn build; \
    yarn init-ormconf; 

EXPOSE 3000

# CMD ["/bin/sh" ,"./run.sh" ]
CMD ["yarn", "start"]