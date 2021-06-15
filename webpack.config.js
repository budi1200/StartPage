const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const sveltePreprocess = require("svelte-preprocess");
const path = require("path");

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

module.exports = {
	entry: {
		bundle: "./src/main.ts",
	},
	resolve: {
		alias: {
			svelte: path.dirname(require.resolve("svelte/package.json")),
		},
		extensions: [".mjs", ".ts", ".js", ".svelte"],
		mainFields: ["svelte", "browser", "module", "main"],
	},
	output: {
		path: __dirname + "/public",
		filename: "[name].js",
		chunkFilename: "[name].[id].js",
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: [
					{
						loader: "svelte-loader",
						options: {
							compilerOptions: {
								dev: !prod,
							},
							emitCss: prod,
							hotReload: !prod,
							preprocess: sveltePreprocess({
								postcss: true,
							}),
						},
					},
				],
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
			{
				test: /\.pcss$/,
				// skip tailwind's css in devmode to improve reload times
				include: !prod ? /tailwind.pcss/ : /you-shouldn't-match-me-or-else/,
				use: "null-loader",
			},
			{
				test: /\.pcss$/,
				exclude: !prod ? /tailwind.pcss/ : /you-shouldn't-match-me-or-else/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
			},
			{
				// required to prevent errors from Svelte on Webpack 5+
				test: /svelte\/.*\.mjs$/,
				resolve: {
					fullySpecified: false,
				},
			},
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	mode: prod ? "production" : "development",
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].css",
		}),
	],
	optimization: {
		minimizer: [`...`, new CssMinimizerPlugin()],
	},
	devtool: prod ? false : "source-map",
	devServer: {
		hot: true,
		contentBase: "public",
		host: "localhost",
	},
};
