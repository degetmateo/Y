import postgres from "postgres";

export default class Postgres {
    private static db: postgres.Sql<{}>;

    public static init () {
        try {
            this.db = postgres ({
                host: process.env.POSTGRES_URL,
                port: parseInt(process.env.POSTGRES_PORT) || 5432,
                database: process.env.POSTGRES_DB_NAME,
                username: process.env.POSTGRES_USERNAME,
                password: process.env.POSTGRES_PASSWORD,
                ssl: 'require'
            });   

            console.log('✅ | Base de datos Postgres conectada.');
        } catch (error) {
            console.error('🟥 | Error: ', error);
        }
    }

    public static query (): postgres.Sql<{}> {
        return this.db;
    }
}