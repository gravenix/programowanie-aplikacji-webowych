const path = require('path');

module.exports = {
    entry: ['./src/js/App.ts', './src/styles.scss'],
    output: {
        filename: 'js/app.js',
        path: path.resolve(__dirname, 'src')
    },
    module: {
        rules: [
            {
                test: /\.ts/i,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src/js')]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '/[name].css'
                        }
                    },
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
                include: [path.resolve(__dirname, 'src')],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};