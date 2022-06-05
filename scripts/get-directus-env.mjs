export function getDirectusEnv() {
  const env = process.env;

  return {
    // General
    HOST: '127.0.0.1',
    PORT: env.WEBSITE_PORT,
    PUBLIC_URL: env.WEBSITE_PUBLIC_URL,
    ROOT_REDIRECT: false,

    // Security
    KEY: env.WEBSITE_KEY,
    SECRET: env.WEBSITE_SECRET,
    CONTENT_SECURITY_POLICY_DIRECTIVES__IMG_SRC: ['*'],
    CONTENT_SECURITY_POLICY_DIRECTIVES__CONNECT_SRC: ['*'],
    CONTENT_SECURITY_POLICY_DIRECTIVES__MEDIA_SRC: ['*'],

    // Database
    DB_CLIENT: 'postgres',
    DB_HOST: env.POSTGRES_HOST,
    DB_PORT: env.POSTGRES_PORT,
    DB_DATABASE: env.WEBSITE_POSTGRES_DATABASE,
    DB_USER: env.POSTGRES_USER,
    DB_PASSWORD: env.POSTGRES_PASSWORD,

    // Storage
    STORAGE_LOCATIONS: 'Local',
    STORAGE_LOCAL_DRIVER: 'local',
    STORAGE_LOCAL_ROOT: './uploads',

    // Extension
    EXTENSIONS_PATH: './dist/extensions',
    EXTENSIONS_AUTO_RELOAD: true,

    // Mail
    EMAIL_FROM: env.MAIL_FROM,
    EMAIL_TRANSPORT: 'smtp',
    EMAIL_SMTP_HOST: 'localhost',
    EMAIL_SMTP_PORT: 465,
    EMAIL_SMTP_SECURE: false,
    EMAIL_SMTP_IGNORE_TLS: false,
    EMAIL_SMTP_USER: env.MAIL_USER,
    EMAIL_SMTP_PASSWORD: env.MAIL_PASSWORD,
  };
}