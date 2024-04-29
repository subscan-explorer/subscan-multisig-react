const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
const path = require('path');
const antdVarsPath = './src/theme/antd/vars.less';
const CracoAntDesignPlugin = require('craco-antd');
const { getLessVars } = require('antd-theme-generator');
const themeVariables = getLessVars(path.join(__dirname, antdVarsPath));
const defaultVars = getLessVars(path.join(__dirname, './node_modules/antd/lib/style/themes/default.less'));
const darkVars = {
  ...getLessVars(path.join(__dirname, './node_modules/antd/lib/style/themes/dark.less')),
  '@primary-color': defaultVars['@primary-color'],
  '@picker-basic-cell-active-with-range-color': 'darken(@primary-color, 20%)',
};
const lightVars = {
  ...getLessVars(path.join(__dirname, './node_modules/antd/lib/style/themes/compact.less')),
  '@primary-color': defaultVars['@primary-color'],
};
const { alias, configPaths } = require('react-app-rewire-alias');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// just for dev purpose, use to compare vars in different theme.
// fs.writeFileSync('./ant-theme-vars/dark.json', JSON.stringify(darkVars));
// fs.writeFileSync('./ant-theme-vars/light.json', JSON.stringify(lightVars));
// fs.writeFileSync('./ant-theme-vars/theme.json', JSON.stringify(themeVariables));

const options = {
  antDir: path.join(__dirname, './node_modules/antd'),
  stylesDir: path.join(__dirname, './src'),
  varFile: path.join(__dirname, antdVarsPath),
  themeVariables: Array.from(
    new Set([...Object.keys(darkVars), ...Object.keys(lightVars), ...Object.keys(themeVariables)])
  ),
  indexFileName: './public/index.html',
  generateOnce: false,
  publicPath: '',
  customColorRegexArray: [],
};
const themePlugin = new AntDesignThemePlugin(options);

module.exports = {
  babel: {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false, // 对ES6的模块文件不做转化，以便使用tree shaking、sideEffects等
          useBuiltIns: 'entry', // browserslist环境不支持的所有垫片都导入
          // https://babeljs.io/docs/en/babel-preset-env#usebuiltins
          // https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md
          corejs: {
            version: 3, // 使用core-js@3
            proposals: true,
          },
        },
      ],
    ],
    plugins: [
      ['@babel/plugin-proposal-private-methods', { loose: true }],
      // 配置 babel-plugin-import
      // ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }, 'antd'],
      // 配置解析器
      // ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      // ['babel-plugin-styled-components', { displayName: true }],
    ],
    loaderOptions: (babelLoaderOptions, { env, paths }) => {
      return babelLoaderOptions;
    },
  },
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeThemeLessPath: path.join(__dirname, 'src/theme/antd/vars.less'),
      },
    },
  ],
  typescript: {
    enableTypeChecking: false,
  },
  webpack: {
    plugins: {
      add: [themePlugin],
      // add: [themePlugin, new BundleAnalyzerPlugin({ analyzerPort: 8919 })],
    },
    // .
    // add mjs compatibility configuration
    configure: (webpackConfig) => {
      webpackConfig.optimization.splitChunks = {
        ...webpackConfig.optimization.splitChunks,
        chunks: 'all',
        minSize: 1000000,
        maxSize: 5000000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`;
            },
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      });
      webpackConfig.module.rules.push({
        test: /\.js$/,
        loader: require.resolve('@open-wc/webpack-import-meta-loader'),
      });
      const config = alias(configPaths(path.join(__dirname, './tsconfig.paths.json')))(webpackConfig);

      return config;
    },
  },
};
