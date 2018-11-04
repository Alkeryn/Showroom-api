# Showroom is a webUI to manage and launch docker images
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
curl -X POST -d "id=THEID" http://localhost:8080/api/containers/start
curl -X POST -d "id=THEID" http://localhost:8080/api/containers/stop
```

You can see the list of active container at localhost:8080/api/containers
or fetch the json with curl

# File Hierarchy

* #### You must put all your html files in `/html/name.ejs`, yes you do need to use the `ejs` extension, look at `/html` to have an example or ask me questions

* #### You must put all `.css` files in `/public/css/*`<br> and can be accessed via the following path

* #### You must put all `.js` files in `/public/scripts/*`<br> and can be accessed via the following path


# Implemented API Documentation :


## GET API :

Path | Description
:-:|:-:
/api/containers|return a json that contains info about all containers (running and non running)

# Where you need to send the id, send the FULL id, it would work with less but do it in order to avoid colision

## POST API :
Path| Description | Takes | example | Should returns
:-:|:-:|:-:|:-:|:-:
/api/containers/stop | Stop a containers | id | `curl -d "id=f9bd3802cb4182" -X POST "localhost:8080/api/containers/stop"` | "stoped"
/api/containers/start | Stop a containers | id | `curl -d "id=f9bd3802cb4182" -X POST "localhost:8080/api/containers/start"`| "started"
/api/containers/state | return the state of a container| id | `curl -d "id=f9bd3802cb4182" -X POST "localhost:8080/api/containers/state"`| state {running, created ...}
/api/containers/remove | remove a containers | id | `curl -d "id=f9bd3802cb4182" -X POST "localhost:8080/api/remove"`| "done"

# Todo API Documentation :


## GET API :

Path| Description
:-:|:-:
/api/compose|return a json that contains info about all containers (running and non running)

## POST API :

Path| Description | Takes | example | Should returns
:-:|:-:|:-:|:-:|:-:
/api/containers/pull | pull an image | image | `curl -d "image=debian:latest" -X POST "localhost:8080/api/containers/pull"`| "done"
/api/containers/run | create and run a containers | image | `curl -d "image=debian:latest" -X POST "localhost:8080/api/containers/run"`| "started"
/api/containers/create | create a containers | image | `curl -d "image=debian:latest" -X POST "localhost:8080/api/containers/create"`| "done"
/api/compose/create | create an app |<span>|<span>| "done"
/api/compose/start| start an app |<span>|<span>|"started"
/api/compose/stop| stop an app |<span>|<span>|"stoped"
/api/compose/remove | remove an app |<span>|<span>|"done"

## DELETE API :
Path| Description | Takes | example | Should returns
:-:|:-:|:-:|:-:|:-:
