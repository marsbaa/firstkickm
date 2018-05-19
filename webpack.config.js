const webpack = require("webpack");
const path = require("path");
const envFile = require("node-env-file");
const HtmlWebpackPlugin = require("html-webpack-plugin");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

try {
  envFile(path.join(__dirname, "config/" + process.env.NODE_ENV + ".env"));
} catch (e) {}

module.exports = {
  entry: {
    app: ["script-loader!jquery/dist/jquery.min.js", "./app/app.jsx"],
    vendor: [
      "react",
      "react-dom",
      "react-router",
      "react-redux",
      "redux",
      "redux-thunk",
      "styled-components",
      "lodash",
      "moment"
    ]
  },
  externals: {
    jquery: "jQuery"
  },

  plugins: [
    new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor.bundle.js",
      minChunks: Infinity
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public/index.html"),
      filename: "index.html",
      inject: "body"
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: { comments: false }
    }),
    new webpack.DefinePlugin({
      "process.env": {
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
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "public"),
    publicPath: "/"
  },
  resolve: {
    modules: [
      "node_modules",
      "./app/components",
      "./app/components/Admin",
      "./app/components/Attendance",
      "./app/components/Centre",
      "./app/components/Charts",
      "./app/components/Coach",
      "./app/components/Common",
      "./app/components/Collections",
      "./app/components/CoachSchedule",
      "./app/components/Dashboard",
      "./app/components/Inventory",
      "./app/components/Jersey",
      "./app/components/MakeUp",
      "./app/components/Notes",
      "./app/components/Payment",
      "./app/components/Promotions",
      "./app/components/Settings",
      "./app/components/Students",
      "./app/components/Trials",
      "./app/components/User",
      "./app/components/Calendar",
      "./app/components/Openhouse",
      "./app/components/Cancel",
      "./app/components/Expenses",
      "./app/components/Credit",
      "./app/api",
      "./app/css",
      "./app/actions"
    ],
    alias: {
      helper: path.resolve(__dirname, "app/helper/index.jsx"),
      reducers: path.resolve(__dirname, "app/reducers/reducers.jsx"),
      router: path.resolve(__dirname, "app/router/index.jsx"),
      configureStore: path.resolve(__dirname, "app/store/configureStore.jsx"),
      firebaseApp: path.resolve(__dirname, "app/firebase/index.jsx")
    },
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["react", "es2015", "stage-0"]
        }
      },
      {
        test: /\.png$/,
        use: ["url-loader"]
      },
      {
        test: /\.jpg$/,
        use: ["file-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
