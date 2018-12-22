# Showroom is a webUI to manage and launch docker images
To launch the software you need node **v10.10** at least and npm installed then run :

```bash
npm install
npm install -g pm2 #Probably need sudo depending of your configuration

#Then
#for developpement :

npm start

#Fore production :

pm2 start server.js

#Or

pm2 start -- npm

# Those 2 commands are equivalent
```
And go to http://localhost:8080 in your web browser

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
In case of success, the returned http code will generally be 200

in case of error the returned http code will be 500

**Do not use the output to verify everything was successful but the http code**

And finally, the argument name don't matter anymore but the order does, though most don't need more than one

Path| Description | Takes | example | Should returns
:-:|:-:|:-:|:-:|:-:
/api/containers/stop | Stop a containers | id | curl -d "id=f9bd3802cb4182" -X POST http://localhost:8080/api/containers/stop | "done"
/api/containers/start | Stop a containers | id | curl -d "id=f9bd3802cb4182" -X POST http://localhost:8080/api/containers/start| "done"
/api/containers/state | return the state of a container| id | curl -d "id=f9bd3802cb4182" -X POST http://localhost:8080/api/containers/state| state {running, created ...}
/api/containers/remove | remove a containers | id | curl -d "id=f9bd3802cb4182" -X POST http://localhost:8080/api/remove| "done"
/api/containers/create | create a containers (name is optional) | image | curl -d "image=debian:latest&name=thename" -X POST http://localhost:8080/api/containers/create| container ID
/api/containers/pull | pull an image | image | curl -d "image=debian:latest" -X POST http://localhost:8080/api/containers/pull| "done"
/api/compose/up| create ad start a compose |id|curl -X POST -d "id=theid" http://localhost:8080/api/compose/up|"done"
/api/compose/down| stop ad rm a compose |id|curl -X POST -d "id=theid" http://localhost:8080/api/compose/down|"done"
/api/compose/start| start a compose |id|curl -X POST -d "id=theid" http://localhost:8080/api/compose/start|"done"
/api/compose/stop| stop a compose |id|curl -X POST -d "id=theid" http://localhost:8080/api/compose/stop|"done"
/api/compose/create| create |id|curl -X POST -d "id=theid" http://localhost:8080/api/compose/create|"done"
/api/apps/import| import a tar.gz | tar | curl -X POST -F "tar=@path" http://localhost:8080/api/apps/import | app ID
/api/apps/remove| remove app |id|curl -X POST -d "id=theid" http://localhost:8080/api/apps/remove |"done"

# Todo API Documentation :


## GET API :

Path| Description
:-:|:-:
/api/apps|return a json that contains info about all apps (running and non running)

## POST API :

Path| Description | Takes | example | Should returns
:-:|:-:|:-:|:-:|:-:
/api/containers/run | create and run a containers | image | `curl -d "image=debian:latest" -X POST "localhost:8080/api/containers/run"`| "done"
/api/apps/export| export a .yml or tar

## DELETE API :
Path| Description | Takes | example | Should returns
:-:|:-:|:-:|:-:|:-:
