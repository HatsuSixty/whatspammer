const fs = require('fs')
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal')

const client = new Client();

function get_config(file) {
    if (!fs.existsSync(file)) {
        console.error(`ERROR: File \`${file}\` does not exist`);
        process.exit(1);
    }

    let config = {};
    try {
        config = require(file);
    } catch (e) {
        if (e instanceof SyntaxError) {
            console.error(`ERROR: Syntax error on file \`${file}\``);
            process.exit(1);
        } else {
            console.error(`ERROR: Unknown error encountered while parsing file \`${file}\``);
            process.exit(1);
        }
    }

    if (!config.hasOwnProperty("message")) {
        console.error(`ERROR: Could not find field \`message\` in file \`${file}\``);
        process.exit(1);
    }

    if (!config.hasOwnProperty("numbers")) {
        console.error(`ERROR: Could not find field \`numbers\` in file \`${file}\``);
        process.exit(1);
    }

    if (!Array.isArray(config["numbers"])) {
        console.error(`ERROR: Field \`numbers\` in file \`${file}\` is not an array`);
        process.exit(1);
    }

    if (config["numbers"].length < 1) {
        console.error(`ERROR: Field \`numbers\` in file \`${file}\` must have at least one element`);
        process.exit(1);
    }

    for (number of config["numbers"]) {
        if (!number.hasOwnProperty("country_code")) {
            console.error(
                `ERROR: Could not find field \`country_code\` in element of array \`numbers\` in file \`${file}\``
            );
            process.exit(1);
        }
        if (!number.hasOwnProperty("number")) {
            console.error(
                `ERROR: Could not find field \`number\` in element of array \`numbers\` in file \`${file}\``
            );
            process.exit(1);
        }
    }

    return config;
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function send_message(ccode, number, message) {
    const sanitized_number = number.toString().replace(/[- )(]/g, "");
    const final_number = `${ccode}${sanitized_number.substring(sanitized_number.length - 11)}`;

    const number_details = await client.getNumberId(final_number);

    if (number_details) {
        const sendMessageData = await client.sendMessage(number_details._serialized, message);
        console.log(`[INFO] Sent message to number \`${number}\``);
    } else {
        console.error(`[WARN] ${final_number} mobile number is not registered. Ignoring it.`);
    }
}

client.on('qr', async (qr) => {
    console.log('QR RECEIVED: ', qr);
    qrcode.generate(qr, {small: true});
});

client.on('ready', async () => {
    const USER_DATA = get_config('./numbers.json');
    const message = USER_DATA["message"];
    const numbers = USER_DATA["numbers"];

    for (number of numbers) {
        await send_message(number["country_code"], number["number"], message);
        await delay(1000);
    }
});

client.initialize();
