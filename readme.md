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

/api/docker mimic docker command

/api/compose mimic docker-compose command

/api/apps allow to create / delete / import / export "apps"

## GET API :

Path | Description
:-:|:-:
/api/containers|return a json that contains info about all containers (running and non running)
/api/compose|return a json that contains info about all docker compose (running and non running)

# Where you need to send the id, send the FULL id, it would work with less but do it in order to avoid colision

## POST API :
Path| Description | Takes | example | Should returns
:-:|:-:|:-:|:-:|:-:
/api/containers/stop | Stop a containers | id | curl -d "id=f9bd3802cb4182" -X POST http://localhost:8080/api/containers/stop | "stoped"
/api/containers/start | Stop a containers | id | curl -d "id=f9bd3802cb4182" -X POST http://localhost:8080/api/containers/start| "started"
/api/containers/state | return the state of a container| id | curl -d "id=f9bd3802cb4182" -X POST http://localhost:8080/api/containers/state| state {running, created ...}
/api/containers/remove | remove a containers | id | curl -d "id=f9bd3802cb4182" -X POST http://localhost:8080/api/remove| "done"
/api/containers/create | create a containers (name is optional) | image | curl -d "image=debian:latest&name=thename" -X POST http://localhost:8080/api/containers/create| ID or error msg
/api/containers/pull | pull an image | image | curl -d "image=debian:latest" -X POST http://localhost:8080/api/containers/pull| "done"
/api/compose/up| create ad start a compose |name|curl -X POST -d "name=medialog" http://localhost:8080/api/compose/up|"started"
/api/compose/down| stop ad rm a compose |name|curl -X POST -d "name=medialog" http://localhost:8080/api/compose/down|"done"
/api/compose/start| start a compose |name|curl -X POST -d "name=medialog" http://localhost:8080/api/compose/start|"started"
/api/compose/stop| stop a compose |name|curl -X POST -d "name=medialog" http://localhost:8080/api/compose/stop|"stoped"
/api/compose/create| create |image|curl -X POST -d "name=medialog" http://localhost:8080/api/compose/create|"done"

# Todo API Documentation :


## GET API :

Path| Description
:-:|:-:
/api/apps|return a json that contains info about all apps (running and non running)

## POST API :

Path| Description | Takes | example | Should returns
:-:|:-:|:-:|:-:|:-:
/api/containers/run | create and run a containers | image | `curl -d "image=debian:latest" -X POST "localhost:8080/api/containers/run"`| "started"
/api/apps/import| import a .yml or tar and give it a name & description + list of authorized users and members etc ...
/api/apps/export| export a .yml or tar
/api/apps/remove| remove an apps

## DELETE API :
Path| Description | Takes | example | Should returns
:-:|:-:|:-:|:-:|:-:
