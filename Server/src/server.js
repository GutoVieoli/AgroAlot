const ee = require('@google/earthengine');
const privateKey = require('./.private-key.json');
const express = require('express');
const cors = require('cors');


const app = express();

app.use( cors( ) );
app.use(express.json());

const mapRoutes = require('./routes/map.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const propriedadesRoutes = require('./routes/propriedades.routes')

app.use('/requestMap', mapRoutes.router);
app.use('/', usuariosRoutes.router);
app.use('/propriedades', propriedadesRoutes.router);


const port = process.env.PORT || 3000;

console.log('Authenticating Earth Engine API using private key...');
ee.data.authenticateViaPrivateKey(
    privateKey,
    () => {
        console.log('Authentication successful.');
        ee.initialize(
            null, null,
            () => {
                console.log('Earth Engine client library initialized.');
                app.listen(port);
                console.log(`Listening on port ${port}`);
            },
            (err) => {
                console.log(err);
                console.log(
                    `Please make sure you have created a service account and have been approved.
    Visit https://developers.google.com/earth-engine/service_account#how-do-i-create-a-service-account to learn more.`);
            });
    },
    (err) => {
      console.log(err);
    }
);