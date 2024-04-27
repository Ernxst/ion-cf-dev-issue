/// <reference path="./.sst/platform/config.d.ts" />
import type { BuildOptions } from "esbuild";

export default $config({
	app(input) {
		return {
			name: "ion-dev-issue",
			removal: input.stage === "production" ? "retain" : "remove",
			home: "cloudflare",
		};
	},
	async run() {
		$transform(cloudflare.WorkerScript, (args) => {
			args.compatibilityDate = '2024-04-04'
			args.compatibilityFlags = ["nodejs_compat"]
		})

		$transform(sst.cloudflare.Worker, (args) => {
			args.url = true
			args.build = $resolve([args.build]).apply(([build]) => {
				return {
					...build,
					esbuild: $resolve([build?.esbuild]).apply(([esbuild]) => ({
						...esbuild,
						// https://github.com/vitejs/vite/issues/15464#issuecomment-1872485703
						target: "es2020",
						external: ["cloudflare:workers", "node:process"]
					} satisfies BuildOptions))
				}
			})
		})

		const workerB = new sst.cloudflare.Worker(
			"WorkerB",
			{
				handler: "./packages/functions/src/workerB.handler.ts",
			}
		);

		const workerA = new sst.cloudflare.Worker(
			"WorkerA",
			{
				handler: "./packages/functions/src/workerA.handler.ts",
				link: [workerB],
			}
		);

		return {
			a: workerA.url,
			b: workerB.url,
		}
	},
});
