import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const origin = 'https://data.memoria-ll.link';
const masterPrefix = `${origin}/arknights-data/master/`;
const names = ['operator', 'material', 'gamedata'];
const digest = bytes => createHash('sha256').update(bytes).digest('hex');

function writeImmutable(path, bytes) {
    if (existsSync(path)) {
        if (!readFileSync(path).equals(bytes)) throw new Error(`Immutable release changed: ${path}`);
        return;
    }
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, bytes);
}

// Source master/manifest.json pins three immutable master blobs. The stage source
// is copied to a new immutable URL before the Browser manifest pointer moves (#608).
export function makeBrowserRelease(root = '.') {
    const data = join(resolve(root), 'arknights-data');
    const source = JSON.parse(readFileSync(join(data, 'master', 'manifest.json'), 'utf8'));
    if (source.schemaVersion !== 1 || !/^[0-9a-f]{64}$/.test(source.releaseId))
        throw new Error('Invalid upstream master release.');
    const files = {};
    for (const name of names) {
        const entry = source.files?.[name];
        if (!entry || entry.required !== true || typeof entry.path !== 'string' ||
            !entry.path.startsWith(masterPrefix) || !/^[a-zA-Z0-9_.-]+\.json$/.test(entry.path.slice(masterPrefix.length)) ||
            !/^[0-9a-f]{64}$/.test(entry.sha256) || !Number.isSafeInteger(entry.size) || entry.size < 1)
            throw new Error(`Invalid upstream ${name} descriptor.`);
        const bytes = readFileSync(join(data, 'master', entry.path.slice(masterPrefix.length)));
        if (bytes.length !== entry.size || digest(bytes) !== entry.sha256)
            throw new Error(`Upstream ${name} bytes differ from master manifest.`);
        files[name] = { url: entry.path, sha256: entry.sha256, size: entry.size };
    }
    const stageBytes = readFileSync(join(data, 'stage', 'stage_master_data.json'));
    const stage = JSON.parse(stageBytes.toString('utf8'));
    if (!stage.version || !Array.isArray(stage.stages) || stage.stages.length < 2)
        throw new Error('Incomplete stage source.');
    const stageHash = digest(stageBytes);
    const releaseId = digest(Buffer.from(`${source.releaseId}\n${stageHash}\n`, 'utf8'));
    const stagePath = `browser/releases/${releaseId}/stage.json`;
    files.stage = { url: `${origin}/arknights-data/${stagePath}`, sha256: stageHash, size: stageBytes.length };
    const manifest = { releaseId, files };
    const manifestPath = join(data, 'browser', 'manifest.json');
    writeImmutable(join(data, stagePath), stageBytes);
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
    return manifest;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    const manifest = makeBrowserRelease(process.argv[2] ?? '.');
    console.log(`Browser master release ${manifest.releaseId}`);
}
