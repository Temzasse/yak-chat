# Yak Chat

A chat app blaa blaa...

## Development

> NOTE: you need to have Node and Docker installed!

First install linters:
```
$ npm install
```

Then start the app:
```
$ npm run up
```

### Handy commands

Remove current containers:
```
$ npm run down
```

Remove current containers and rebuild them:
```
$ npm run clean:build
```

Remove node_modules and install packages:
```
$ npm run clean:install
```

When you add a new npm package you need to reinstall packages inside the Docker
container:
```
$ npm run reinstall:client
$ npm run reinstall:server
```