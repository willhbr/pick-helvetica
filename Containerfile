FROM docker.io/library/ruby:alpine
RUN apk add g++ musl-dev make libstdc++ git tzdata
WORKDIR /src
COPY Gemfile .
RUN bundle
EXPOSE 80
ENTRYPOINT ["bundle", "exec", "jekyll", "serve", "-w"]

