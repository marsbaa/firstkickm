const webpack = require('webpack');
const path = require('path');
const envFile = require('node-env-file');
const CompressionPlugin = require('compression-webpack-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

try {
  envFile(path.join(__dirname, 'config/' + process.env.NODE_ENV + '.env'));
} catch (e) {}

module.exports = {
  entry: ['script-loader!jquery/dist/jquery.min.js', './app/app.jsx'],
  externals: {
    jquery: 'jQuery'
  },
  plugins: process.env.NODE_ENV === 'production'
    ? [
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery'
        }),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true
          },
          output: { comments: false }
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new CompressionPlugin({
          asset: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.js$|\.css$|\.html$/,
          threshold: 10240,
          minRatio: 0.8
        }),

        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            API_KEY: JSON.stringify(process.env.API_KEY),
            AUTH_DOMAIN: JSON.stringify(process.env.AUTH_DOMAIN),
            DATABASE_URL: JSON.stringify(process.env.DATABASE_URL),
            STORAGE_BUCKET: JSON.stringify(process.env.STORAGE_BUCKET),
            SMS: JSON.stringify(process.env.SMS)
          }
        })
      ]
    : [
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery'
        }),
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            API_KEY: JSON.stringify(process.env.API_KEY),
            AUTH_DOMAIN: JSON.stringify(process.env.AUTH_DOMAIN),
            DATABASE_URL: JSON.stringify(process.env.DATABASE_URL),
            STORAGE_BUCKET: JSON.stringify(process.env.STORAGE_BUCKET),
            SMS: JSON.stringify(process.env.SMS)
          }
        })
      ],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  resolve: {
    modules: [
      'node_modules',
      './app/components',
      './app/components/Admin',
      './app/components/Attendance',
      './app/components/Centre',
      './app/components/Charts',
      './app/components/Coach',
      './app/components/CoachSchedule',
      './app/components/Inventory',
      './app/components/Jersey',
      './app/components/MakeUp',
      './app/components/Notes',
      './app/components/Payment',
      './app/components/Settings',
      './app/components/Students',
      './app/components/Trials',
      './app/components/User',
      './app/components/Calendar',
      './app/api',
      './app/css'
    ],
    alias: {
      helper: path.resolve(__dirname, 'app/helper/index.jsx'),
      actions: path.resolve(__dirname, 'app/actions/actions.jsx'),
      reducers: path.resolve(__dirname, 'app/reducers/reducers.jsx'),
      router: path.resolve(__dirname, 'app/router/index.jsx'),
      configureStore: path.resolve(__dirname, 'app/store/configureStore.jsx'),
      firebaseApp: path.resolve(__dirname, 'app/firebase/index.jsx')
    },
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        }
      },
      {
        test: /\.png$/,
        use: ['url-loader']
      },
      {
        test: /\.jpg$/,
        use: ['file-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devtool: false
};
