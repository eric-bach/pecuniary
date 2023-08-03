/** @type {import('@remix-run/dev').AppConfig} */
export default {
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  publicPath: '/_static/build/',
  server: 'server.ts',
  serverBuildPath: 'server/index.mjs',
  serverModuleFormat: 'esm',
  // serverBuildPath: 'server/index.js',
  // serverModuleFormat: 'cjs',
  ignoredRouteFiles: ['**/.*'],
  future: {
    v2_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
};
