import path from 'path';
import { defineConfig } from 'umi';

export default defineConfig({
  dynamicImport: {
    loading: '@/components/LoadingCp',
  },
  dva: {
    immer: true,
  },
  antd: {},
  sass: {
    implementation: require('node-sass'),
  },
  exportStatic: {},
  base: '/',
  publicPath: '/',
  routes: [
    {
      exact: false,
      path: '/',
      component: '@/layouts/index',
      routes: [
        {
          path: '/',
          component: '../pages/editor',
        },
      ],
    },
  ],
  theme: {
    'primary-color': '#2F54EB',
  },
  extraBabelPlugins: [['import', { libraryName: 'zarm', style: true }]],
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
    utils: path.resolve(__dirname, 'src/utils/'),
    assets: path.resolve(__dirname, 'src/assets/'),
  },
});
