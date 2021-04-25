# k6 meet Keycloak
The porpuse of this repository is to load test Keycloak functionality with [k6](https://k6.io/).  
Each isolated functionality is separated in a file.

## Install
Please see [installation instructions](https://k6.io/docs/getting-started/installation/).

## Run load test
To run a load test you have to run a file. You can do this by  
```
$ k6 run webserver.js
```

## CI
To run the load tests on a CI platform, we recommend using Docker.  
You can run the same comand with Docker by
```
$ docker run -i loadimpact/k6 run - < webserver.js
```

## Envariable
For local testing you can use the following command to load the `.env` conveniently:
```
$ npm run env -- k6 run webserver.js
```
As we load and pipe over npm, it's not recommended to use this when performing a load test.  
Use the [recommended way](https://k6.io/docs/using-k6/environment-variables/) and not dotenv with npm.