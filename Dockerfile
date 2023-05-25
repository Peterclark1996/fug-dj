FROM node:16.14.0-alpine AS nodeBuilder
COPY /client /app

WORKDIR /app
RUN yarn install
RUN yarn build

FROM gradle:7.5.1-alpine AS kotlinBuilder
COPY /server /home/gradle/default

WORKDIR /home/gradle/default
RUN gradle build --no-daemon

FROM openjdk:17 AS default
COPY --from=kotlinBuilder /home/gradle/default/build/libs/*.jar /server.jar
RUN mkdir client
COPY --from=nodeBuilder /app/dist/* /client/

EXPOSE 8080:8080

CMD [ "java", "-jar", "/server.jar" ]