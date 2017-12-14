# Yak Chat

Yak Chat is a school project to research modern technologies such as WebSockets, Service Worker and offline storages
to create an efficient and easy-to-use chat application.

---

<p align='center'>
  <img src="media/demo.gif" width="70%"/>
<p/>

---

## Requirements

* Docker
* Node.js (relatively new > v6)

## Development

First install linters:
```
$ npm install
```

Then start the app:
```
$ npm run up
```

Build the production (demo) version with [ngrok](https://ngrok.com/):

First start ngrok:
```
$ ./ngrok http -region eu 3000
```

Then change the *API_URL* in `/client/src/config.js` to be the https url that ngrok outputs.

Then build the demo:
```
$ npm run demo
```

If you have made changes after last build re-build from scratch:
```
$ npm run demo:clean
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

## Screenshots

<p align='center'>
  <img src="media/screenshot_1.png" width="100%"/>
<p/>

<p align='center'>
  <img src="media/screenshot_2.png" width="100%"/>
<p/>

<p align='center'>
  <img src="media/screenshot_3.png" width="100%"/>
<p/>