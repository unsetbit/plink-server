# plink-server

plink-server is a WebSocket server which helps plink clients to connect to each other. It's small layer on top of [onramp](https://github.com/unsetbit/onramp)).

## To use

1. Install Node 0.10+
2. Execute `npm install -g plink-server`
3. Execute `plink-server`

You can pass `-h [host]` to change set the host of the server. By default it will use "localhost:20500".
