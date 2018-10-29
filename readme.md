Showroom is a webUI to manage and launch docker images
To launch the software run :

```bash
npm install
npm install -g pm2 #Probably need sudo depending of your configuration

#Then

pm2 start server.js

#Or
pm2 start -- npm

# Those 2 commands are equivalent
```
And go to `localhost:8080` in your web browser

you can use only `npm start` to test it, but use `pm2` for production

You can test the rest start / stop api this way

```bash
curl -X POST -d "id=THEID" http://localhost:8080/main/start
curl -X POST -d "id=THEID" http://localhost:8080/main/stop
```

You can see the list of active container at localhost:8080/main/containers
or fetch the json with curl
