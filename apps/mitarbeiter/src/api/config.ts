/** Never store access tokens or server secrets in this module. */
export const apiConfig = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
  isConfigured: Boolean(process.env.EXPO_PUBLIC_API_URL),
} as const;
