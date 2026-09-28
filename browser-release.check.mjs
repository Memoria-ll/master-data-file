import test from 'node:test';
import assert from 'node:assert/strict';
import { copyFileSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { makeBrowserRelease } from './browser-release.mjs';

test('four-blob pointer pins existing master hashes and an immutable stage', () => {
    const temp = mkdtempSync(join(tmpdir(), 'aom-browser-master-'));
    try {
        const local = join(temp, 'arknights-data');
        mkdirSync(join(local, 'master'), { recursive: true });
        mkdirSync(join(local, 'stage'), { recursive: true });
        const upstream = JSON.parse(readFileSync('arknights-data/master/manifest.json', 'utf8'));
        copyFileSync('arknights-data/master/manifest.json', join(local, 'master/manifest.json'));
        for (const name of ['operator', 'material', 'gamedata']) {
            const file = upstream.files[name].path.split('/').at(-1);
            copyFileSync(join('arknights-data/master', file), join(local, 'master', file));
        }
        const stage = join(local, 'stage/stage_master_data.json');
        copyFileSync('arknights-data/stage/stage_master_data.json', stage);
        const first = makeBrowserRelease(temp);
        assert.deepEqual(first, makeBrowserRelease(temp), 'reruns do not change the pointer');
        assert.equal(readFileSync(join(local, 'browser/manifest.json'), 'utf8'),
            readFileSync('arknights-data/browser/manifest.json', 'utf8'));
        const oldStage = join(local, `browser/releases/${first.releaseId}/stage.json`);
        assert.ok(existsSync(oldStage));
        const stageData = JSON.parse(readFileSync(stage, 'utf8'));
        stageData.version += '-next';
        writeFileSync(stage, JSON.stringify(stageData));
        const second = makeBrowserRelease(temp);
        assert.notEqual(second.releaseId, first.releaseId);
        assert.ok(existsSync(oldStage), 'previous release remains immutable');
        const material = upstream.files.material.path.split('/').at(-1);
        writeFileSync(join(local, 'master', material), '{}');
        assert.throws(() => makeBrowserRelease(temp), /bytes differ/);
        assert.equal(JSON.parse(readFileSync(join(local, 'browser/manifest.json'), 'utf8')).releaseId,
            second.releaseId, 'failed generation preserves the published pointer');
    } finally {
        rmSync(temp, { recursive: true, force: true });
    }
});
