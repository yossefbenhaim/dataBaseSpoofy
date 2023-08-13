import cors from 'cors'
import dotenv from "dotenv"
import express from 'express'
import Filter from "postgraphile-plugin-connection-filter"
import PgPubSub from "@graphile/pg-pubsub"

import { postgraphile, makePluginHook } from "postgraphile"

dotenv.config()

const app = express();

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
