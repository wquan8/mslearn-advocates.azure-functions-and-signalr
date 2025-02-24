import { app, output, CosmosDBv4FunctionOptions, InvocationContext } from "@azure/functions";

const goingOutToSignalR = output.generic({
    type: 'signalR',
    name: 'signalR',
    hubName: 'default',
    connectionStringSetting: 'Endpoint=https://msl-sigr-signalr804a07abfb.service.signalr.net;AccessKey=4vBlnq1FAzKMYTC7nBqdTxG8RHtHY1DlEqc2TcOykDpVyX4Ca3YQJQQJ99BBACHYHv6XJ3w3AAAAASRSqxE5;Version=1.0;',
});

export async function dataToMessage(documents: unknown[], context: InvocationContext): Promise<void> {

    try {

        context.log(`Documents: ${JSON.stringify(documents)}`);

        documents.map(stock => {
            // @ts-ignore
            context.log(`Get price ${stock.symbol} ${stock.price}`);
            context.extraOutputs.set(goingOutToSignalR,
                {
                    'target': 'updated',
                    'arguments': [stock]
                });
        });
    } catch (error) {
        context.log(`Error: ${error}`);
    }
}

const options: CosmosDBv4FunctionOptions = {
    connection: 'COSMOSDB_CONNECTION_STRING',
    databaseName: 'stocksdb',
    containerName: 'stocks',
    createLeaseContainerIfNotExists: true,
    feedPollDelay: 500,
    handler: dataToMessage,
    extraOutputs: [goingOutToSignalR],
};

app.cosmosDB('send-signalr-messages', options);