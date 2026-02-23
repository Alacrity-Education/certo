export default ({ env }) => {
  // 1. Define your standard hardcoded origins
  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:1337',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://[::1]:3000',
    'https://bold-approval-5bde4fbd5d.strapiapp.com',
    'https://certo.netlify.app',
    'https://certo.schroedinger-hat.org',
    'https://certo-strapi.schroedinger-hat.org',
  ];

  // 2. Dynamically pull your tunnel/production domains from your .env
  const frontendUrl = env('FRONTEND_URL');
  const publicUrl = env('PUBLIC_URL');
  
  // 3. Optional: Allow passing a comma-separated list of extra origins from .env
  // This is great for Netlify deploy previews! (e.g., CORS_ORIGINS=https://deploy-preview-123--certo.netlify.app)
  const extraOrigins = env.array('CORS_ORIGINS', []);

  // 4. Merge them all together into a flat array of strings
  const allOrigins = [
    ...defaultOrigins,
    ...extraOrigins,
  ];

  // Add the ENV urls if they exist
  if (frontendUrl) allOrigins.push(frontendUrl);
  if (publicUrl) allOrigins.push(publicUrl);

  return [
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", 'https:', 'http:'],
            'img-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', 'res.cloudinary.com', 'localhost:1337', '*'],
            'media-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', 'res.cloudinary.com', 'localhost:1337', '*'],
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    {
      name: 'strapi::cors',
      config: {
        // Pass the array of strings directly—no functions allowed!
        origin: allOrigins,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
        headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
        keepHeaderOnError: true,
        credentials: true,
      }
    },
    'strapi::poweredBy',
    'strapi::logger',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};
