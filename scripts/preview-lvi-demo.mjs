import {spawn} from 'node:child_process';
import path from 'node:path';
import {existsSync} from 'node:fs';
const slug=process.argv[2];
if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug??''))throw new Error('Usage: npm run demo:preview -- yritys-demo');
const dir=path.resolve('.demo-output',slug);if(!existsSync(dir))throw new Error('Generate this demo first');
// Never bind this unpublished preview to a public network interface.
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev',dir,'--hostname','127.0.0.1','--port','3100'],{stdio:'inherit'});
child.on('exit',code=>process.exit(code??1));
