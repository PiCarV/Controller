import builtinModules from 'builtin-modules';

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    public: {
      url: '/',
      static: true,
      dot: true,
    },
    src: { url: '/dist' },
  },
  optimize: {
    bundle: false,
    minify: true,
    target: 'esnext',
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-sass',
    '@snowpack/plugin-postcss',
    [
      '@snowpack/plugin-typescript',
      {
        /* Yarn PnP workaround: see https://www.npmjs.com/package/@snowpack/plugin-typescript */
        ...(process.versions.pnp ? { tsc: 'yarn pnpify tsc' } : {}),
      },
    ],
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  packageOptions: {
    external: [
      ...builtinModules.filter((external) => external !== 'process'),
      'electron',
    ],
  },
  devOptions: {
    // we disable opening in the default browser as we use Tauri to open the app
    open: 'none',
    port: 8080,
    /* ... */
  },
  buildOptions: {
    baseUrl: './',
  },
};
