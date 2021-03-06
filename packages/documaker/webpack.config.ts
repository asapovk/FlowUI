const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')

module.exports = function (workdir) {
    return {
        mode: 'development',

        entry: {
            app: [__dirname + '/index.tsx']
        },

        output: {
            filename: 'documaker.js',
            path: __dirname + '/public',
            publicPath: '/',
        },

        devtool: 'source-map',

        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json']
        },

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    oneOf: [
                        {
                            test: /\.raw\.tsx?$/,
                            use: 'raw-loader',
                        },
                        {
                            test: /\.tsx?$/,
                            use: {
                                loader: 'babel-loader',
                                options: {
                                    presets: [
                                        '@babel/preset-env',
                                        '@babel/preset-typescript',
                                        '@babel/preset-react',
                                        '@emotion/babel-preset-css-prop'
                                    ],
                                    plugins: [
                                        '@babel/proposal-class-properties',
                                        '@babel/proposal-object-rest-spread',
                                        '@babel/plugin-transform-runtime',
                                        ['@babel/plugin-transform-typescript', { allowNamespaces: true }],
                                        ['@babel/plugin-proposal-optional-chaining', {
                                            loose: true
                                        }],
                                    ]
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'WEBPACK_WORKDIR': JSON.stringify(workdir)
            }),
            new MonacoWebpackPlugin(),
            new FilterWarningsPlugin({ 
                exclude: /source-map-loader|Critical dependency: the request of a dependency is an expression/ 
            })
        ]
    }
}