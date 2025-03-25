const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

// Configurações do Dialogflow
const projectId = 'your-project-id';  // Substitua pelo seu ID do projeto Dialogflow
const sessionClient = new dialogflow.SessionsClient();
const sessionId = uuid.v4();
const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

// Configuração do cliente do WhatsApp
const client = new Client();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Escaneie o QR Code acima para autenticar!');
});

client.on('ready', () => {
    console.log('O WhatsApp Bot está pronto!');
});

client.on('message', async (message) => {
    // Quando receber uma mensagem, envia para o Dialogflow
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message.body,
                languageCode: 'pt-BR',
            },
        },
    };

    // Enviar a mensagem para o Dialogflow e obter a resposta
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    // Enviar a resposta do Dialogflow de volta para o WhatsApp
    message.reply(result.fulfillmentText);
});

// Iniciar o cliente do WhatsApp
client.initialize();
