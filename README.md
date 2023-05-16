# Whatspammer

Sends a custom message to all numbers in `numbers.json`.

## Quick Start

If the numbers you want to send the message to are all in the same country, you can use `genconfig.py` to generate `numbers.json`:

```console
$ ./genconfig.py
```

It will ask you for the message you wanna send, and the country code of all numbers. Then, it will give you a prompt where you can type the numbers you wanna send the message to. You can press `Enter` when you're done.

After generating the config, you can run the bot by running the commands:

```console
$ npm install -y
$ node index.js
```

When the bot starts, it will show you a QR Code, scan it with the Whatsapp mobile app, and the bot will start sending the messages.
