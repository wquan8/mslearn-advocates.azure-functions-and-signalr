import { app, input } from '@azure/functions';

const inputSignalR = input.generic({
    type: 'signalRConnectionInfo',
    name: 'connectionInfo',
    hubName: 'default',
    connectionStringSetting: 'Endpoint=https://msl-sigr-signalr804a07abfb.service.signalr.net;AccessKey=4vBlnq1FAzKMYTC7nBqdTxG8RHtHY1DlEqc2TcOykDpVyX4Ca3YQJQQJ99BBACHYHv6XJ3w3AAAAASRSqxE5;Version=1.0;',
});

app.http('open-signalr-connection', {
    authLevel: 'anonymous',
    handler: (request, context) => {
        return { body: JSON.stringify(context.extraInputs.get(inputSignalR)) }
    },
    route: 'negotiate',
    extraInputs: [inputSignalR]
});