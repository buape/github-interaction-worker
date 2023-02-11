import { isValidRequest, PlatformAlgorithm } from "discord-verify";
import { githubInfo } from './interactions/github/github';
import { ack } from './utils/respond';

declare let DISCORD_PUBLIC_KEY: string;
declare let DEFAULT_REPO_OWNER: string;
declare let DEFAULT_REPO: string;

export async function handleRequest(request: Request): Promise<Response> {
	try {
		if (!await isValidRequest(request, DISCORD_PUBLIC_KEY, PlatformAlgorithm.Cloudflare)) return new Response('Bad request signature', { status: 401 });

		const body = await request.clone().json();
		const { data: { name, options } } = body;

		if (body.type === 2) {
			if (options?.length) {
				const args = Object.fromEntries(options.map(({ name, value }: { name: string; value: any }) => [name, value]));

				if (name === 'github') {
					return githubInfo(args.owner ?? DEFAULT_REPO_OWNER, args.repository ?? DEFAULT_REPO, args.query);
				}
			}
		}

		return ack();
	} catch (err) {
		return ack();
	}
}
