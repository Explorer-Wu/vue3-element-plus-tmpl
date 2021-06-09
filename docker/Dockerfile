# FROM node:12.13.1-slim as build
FROM nginx:1.10.1

ARG PROJECT_DIR="dist"

COPY --chown=nginx:nginx ${PROJECT_DIR} /usr/share/nginx/html/release
COPY nginx.conf /etc/nginx/conf.d/
WORKDIR /usr/share/nginx/html/release


# RUN npm config set registry https://registry.docker-cn.com

# RUN npm install
# RUN npm run build
# RUN rm -rf .git

# FROM node:12.13.1-slim

# COPY --from=build /vue3-element-plus-tmpl /

# EXPOSE 3000
# WORKDIR /vue3-element-plus-tmpl

# CMD ["npm", "start"]

# ENTRYPOINT ["nginx", "-c"]
# CMD ["/etc/nextapp/nginx/nginx.conf"]
# CMD ["npm", "run", "start", "build", "test"]