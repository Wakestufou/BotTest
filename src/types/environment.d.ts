declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            TOKEN_DEV: string;
            APP_ID: string;
            APP_ID_DEV: string;
            GUILD_DEV: string;
            DATA_BASE: string;
            DATA_BASE_DEV: string;
        }
    }
}

export {};
