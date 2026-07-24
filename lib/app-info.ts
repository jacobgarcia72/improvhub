export const appName = "ImprovLink";

export const isDev = process.env.NODE_ENV === 'development';
export const isDevOrStaging = isDev || process.env.NODE_ENV === 'test' || process.env.VERCEL_ENV === 'preview';
export const isProd = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'preview';