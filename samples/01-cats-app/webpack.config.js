const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = [
    {
        mode: 'production',
        entry: [
            './src/sv/main.ts',
        ],
        output: {
            filename: '[contenthash].js',
            path: path.resolve(__dirname, 'dist/sv'),
        },
        externals: {
            // mysql2: 'commonjs mysql2',
            // typeorm: 'commonjs typeorm',
            prisma: 'commonjs prisma',
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: ['ts-loader'],
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.prisma'],
        },
        target: 'node12',
        plugins: [
            new CleanWebpackPlugin(),
        ],
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    extractComments: false,
                }),
            ],
        },
        node: {
            __dirname: true,
            __filename: true,
        },
    },
    {
        mode: 'production',
        entry: [
            './src/cl/main.ts'
        ],
        output: {
            filename: '[contenthash].js',
            path: path.resolve(__dirname, 'dist/cl'),
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: ['ts-loader'],
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        target: 'web',
        plugins: [
            new CleanWebpackPlugin(),
            new WebpackObfuscator({
                compact: true,
                disableConsoleOutput: false,
                selfDefending: true,
                simplify: true,
                stringArrayThreshold: 0.5,
                target: 'browser-no-eval'
            })
        ],
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    extractComments: false,
                }),
            ],
        },
    }
];
