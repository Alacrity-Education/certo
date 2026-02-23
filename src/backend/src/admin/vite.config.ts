import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  // Get the host and strip "https://" or "http://" if they exist
  const rawHost = process.env.PUBLIC_URL || '';
  const cleanHost = rawHost.replace(/^https?:\/\//, '');

  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      // Vite wants 'certo-be.alacrity.ro', not 'https://certo-be.alacrity.ro'
      allowedHosts: cleanHost ? [cleanHost] : [],
    },
  });
};
