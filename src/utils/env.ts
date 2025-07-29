interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_FACEBOOK_APP_ID: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_ENABLE_REFERRALS: string;
  readonly VITE_ENABLE_POINTS: string;
  readonly VITE_ENABLE_OAUTH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  FACEBOOK_APP_ID: import.meta.env.VITE_FACEBOOK_APP_ID,
  CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  APP_VERSION: import.meta.env.VITE_APP_VERSION,
  ENABLE_REFERRALS: import.meta.env.VITE_ENABLE_REFERRALS === 'true',
  ENABLE_POINTS: import.meta.env.VITE_ENABLE_POINTS === 'true',
  ENABLE_OAUTH: import.meta.env.VITE_ENABLE_OAUTH === 'true',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};