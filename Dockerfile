FROM switchboardlabs/node

ENV CHAIN solana
ENV ORACLE_KEY "H9URARvXsN6Yyq8ZRKYXb7QyTUPjA6rpbwYzNRN1As32"
ENV HEARTBEAT_INTERVAL 55
ENV RPC_URL "https://api.devnet.solana.com"
ENV NETWORK_ID devnet
ENV PROGRAM_ID "SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f"
ENV VERBOSE enabled
ENV DEBUG enabled
ENV FS_PAYER_SECRET_PATH /home/viristo/.config/solana/id.json