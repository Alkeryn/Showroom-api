Showroom is a webUI to manage and launch docker images
To launch the software run :

```
npm install
npm start
```
And go to `localhost:8080` in your web browser
You can test the rest start / stop api this way

```
curl -X POST -d "id=THEID" http://localhost:8080/main/start
curl -X POST -d "id=THEID" http://localhost:8080/main/stop
```

You can see the list of active container at localhost:8080/main/containers
or fetch the json with curl
