const cors = require('cors');
const express = require('express');
const { default: PgPubSub } = require('@graphile/pg-pubsub');
const Filter = require('postgraphile-plugin-connection-filter');
const { postgraphile, makePluginHook } = require('postgraphile');

const app = express();

require('dotenv').config();

app.use(cors());

const subsPluginHook = makePluginHook([PgPubSub]);

const res = postgraphile(process.env.CONNECTION_STRING, process.env.SCHEMA, {
    pluginHook: subsPluginHook,
    graphiql: true,
    enhanceGraphiql: true,
    appendPlugins: [Filter],
    graphileBuildOptions: {
        connectionFilterRelations: true,
    },
    subscriptions: true,
    simpleSubscriptions: true,
    websocketMiddlewares: [],
});
app.use(res);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port: ${process.env.PORT}`);
});
