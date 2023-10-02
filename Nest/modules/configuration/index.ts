import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
export default () => ({
  postgres: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB_NAME,
    entities: [`dist/src/modules/storage/entities/*.entity.js`],
    migrationsTableName: 'migrations',
    synchronize: false,
    migrationsRun: false,
    migrations: [`dist/migrations/*`],
    cli: {
      migrationsDir: './migrations',
    },
  },
  crypto: {
    secret: 'test',
    rounds: 10,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  solana: {
    network: process.env.NETWORK || 'devnet',
  },
  solscan: {
    network: process.env.SOLSCAN_NETWORK,
  },
  tatum: {
    apiKey: process.env.TATUM_API_KEY,
  },
  pinata: {
    apiKey: process.env.PINATA_API_KEY,
    secret: process.env.PINATA_SECRET,
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
  },
});
