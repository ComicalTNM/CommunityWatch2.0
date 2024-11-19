// backend/src/config/index.ts

interface Config {
    /**
     * The port the backend server should listen on.
     */
    PORT: number;
    /**
     * The MongoDB connection string.
     */
    MONGODB_URI: string;
    /**
     * The secret used to sign CSRF tokens.
     */
    CSRF_SECRET: string;
    /**
     * The secret used to sign JWT tokens.
     */
    JWT_SECRET: string;
    /**
     * The current node environment.
     */
    NODE_ENV: 'development' | 'production';
    /**
     * The URL of the frontend application.
     */
}

function getString(env: string, acceptableValues? : string[]) {
    if (!process.env[env]) {
        throw new Error(`Environment variable ${env} is missing`);
    }
    if (acceptableValues && !acceptableValues.includes(process.env[env]!)) {
        throw new Error(`Environment variable ${env} must be one of ${acceptableValues.join(', ')}`);
    }
    return process.env[env]!;
}

function getNumber(env: string) {
    if (!process.env[env]) {
        throw new Error(`Environment variable ${env} is missing`);
    }
    return parseInt(process.env[env]!, 10);
}

function init(): Config {
    return {
        PORT: getNumber('BACKEND_PORT'),
        MONGODB_URI: getString('MONGODB_URI'),
        CSRF_SECRET: getString('CSRF_SECRET'),
        JWT_SECRET: getString('JWT_SECRET'),
        NODE_ENV: getString('NODE_ENV', ['development', 'production']) as 'development' | 'production',
        // FRONTEND_URL: getString('FRONTEND_URL'),
        // Add other environment variables here
    };
}

const config: Config = init();

export default config;