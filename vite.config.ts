import { defineConfig, loadEnv, type Plugin } from 'vite';
import YAML from 'yaml';

// stories/*.yaml are imported as their data
function yaml(): Plugin {
  return {
    name: 'yaml',
    transform(code, id) {
      if (!id.endsWith('.yaml')) return null;
      return { code: `export default ${JSON.stringify(YAML.parse(code))};`, map: null };
    },
  };
}

export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [yaml()],
  // DEBUG=TRUE (in .env.local, or the host's environment, e.g. on Render) shows the buttons that
  // skip to the next / previous line
  define: {
    __DEBUG__: JSON.stringify(String(process.env.DEBUG || loadEnv(mode, process.cwd(), '').DEBUG || '').toLowerCase() === 'true'),
  },
  // host: open it from the iPad over Wi-Fi
  server: { port: 5220, strictPort: true, host: true },
  build: {
    // old iPads stay on iOS 12 (Safari 12): lower modern JS syntax and CSS for them
    target: ['es2017', 'safari12'],
    cssTarget: ['safari12'],
  },
}));
