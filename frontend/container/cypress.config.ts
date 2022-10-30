import { defineConfig } from 'cypress';

const defaultBaseUrl = 'http://localhost:8080';

export default defineConfig({
  e2e: {
    baseUrl: defaultBaseUrl,
    setupNodeEvents(on, config) {},
  },
});
