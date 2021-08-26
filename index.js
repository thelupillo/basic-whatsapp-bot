const fs = require('fs');
const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');
let client = new Client();

const SESSION_JSON_PATH = './session.json';

const withoutSession = () => {
    client = new Client();

    client.on('qr', (qr) => {
        console.log('qr');
        qrcode.generate(qr, { small: true });
    });

    client.on('authenticated', (session) => {
        console.log('authenticated');
        fs.writeFile(SESSION_JSON_PATH, JSON.stringify(session), (err) => {
            if (err) console.log(err);
        });
    });

    client.on('ready', () => {
        console.log('ready');
        clientReady();
    });

    client.initialize();
}

const withSession = () => {
    client = new Client({ session: require(SESSION_JSON_PATH) });

    client.on('authenticated', () => {
        console.log('authenticated');
    });

    client.on('auth_failure', () => {
        console.log('auth_failure');
        withoutSession();
    });

    client.on('ready', () => {
        console.log('ready');
        clientReady();
    });

    client.initialize();
}

const clientReady = () => {
    client.on('message', (message) => {
        // TODO: Add some logic when a message is received
    });
};

(fs.existsSync(SESSION_JSON_PATH)) ? withSession() : withoutSession();