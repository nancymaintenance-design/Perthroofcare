import { mkdir, readFile, writeFile, rename, readdir, unlink } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { pageIds as expectedPageFiles } from './manifest.mjs';
export class EditorError extends Error {
    status;
    constructor(status, message){
        super(message), this.status = status;
    }
}
export function assertPageId(pageId) {
    if (!expectedPageFiles.includes(pageId)) throw new EditorError(400, '页面未登记');
}
const queues = new Map();
export async function readDraft(root, pageId) {
    assertPageId(pageId);
    try {
        return JSON.parse(await readFile(join(root, pageId + '.json'), 'utf8'));
    } catch (error) {
        if (error.code === 'ENOENT') return null;
        throw error;
    }
}
export async function listHistory(root, pageId) {
    assertPageId(pageId);
    let entries;
    try {
        entries = await readdir(join(root, 'history', pageId));
    } catch (e) {
        if (e.code === 'ENOENT') return [];
        throw e;
    }
    return Promise.all(entries.filter((n)=>/^\d+\.json$/.test(n)).sort((a, b)=>parseInt(b) - parseInt(a)).slice(0, 20).map(async (n)=>{
        const d = JSON.parse(await readFile(join(root, 'history', pageId, n), 'utf8'));
        return {
            revision: d.revision,
            updatedAt: d.updatedAt
        };
    }));
}
export async function archiveLegacyDraft(root, draft) {
    assertPageId(draft.pageId);
    const directory = join(root, 'legacy');
    await mkdir(directory, {
        recursive: true
    });
    const file = join(directory, draft.pageId + '.' + draft.revision + '.json');
    const value = JSON.stringify(draft, null, 2);
    try {
        await writeFile(file, value, {
            flag: 'wx'
        });
    } catch (e) {
        if (e.code !== 'EEXIST') throw e;
        if (await readFile(file, 'utf8') !== value) throw new EditorError(409, '旧草稿备份不一致，请人工核对');
    }
}
export async function restoreRevision(root, pageId, historyRevision, expectedRevision, baseHash) {
    assertPageId(pageId);
    if (!Number.isSafeInteger(historyRevision) || historyRevision < 1) throw new EditorError(400, '历史修订无效');
    let old;
    try {
        old = JSON.parse(await readFile(join(root, 'history', pageId, historyRevision + '.json'), 'utf8'));
    } catch (e) {
        if (e.code === 'ENOENT') throw new EditorError(404, '历史修订不存在');
        throw e;
    }
    if (old.pageId !== pageId || old.baseHash !== baseHash) throw new EditorError(409, '历史页面基线已变化，需要人工核对');
    return saveDraft(root, {
        pageId,
        expectedRevision,
        baseHash,
        changes: old.changes
    });
}
export async function saveDraft(root, input) {
    assertPageId(input.pageId);
    if (!Number.isSafeInteger(input.expectedRevision) || input.expectedRevision < 0 || typeof input.baseHash !== 'string' || !input.changes || Array.isArray(input.changes) || Object.values(input.changes).some((v)=>typeof v !== 'string' || v.length > 20000)) throw new EditorError(400, '草稿格式无效');
    const key = resolve(root, input.pageId), prior = queues.get(key) ?? Promise.resolve();
    const operation = prior.catch(()=>{}).then(async ()=>{
        const old = await readDraft(root, input.pageId);
        if ((old?.revision ?? 0) !== input.expectedRevision) throw new EditorError(409, '草稿已在其他窗口更新，请保留当前文字后重新载入');
        const history = join(root, 'history', input.pageId);
        await mkdir(history, {recursive:true});
        const recorded=(await readdir(history)).filter(n=>/^\d+\.json$/.test(n)).map(n=>parseInt(n));
        const draft = {
            pageId: input.pageId,
            revision: Math.max(input.expectedRevision,...recorded) + 1,
            baseHash: input.baseHash,
            changes: input.changes,
            updatedAt: new Date().toISOString(),
            state: 'needs-translation'
        };
        await mkdir(root, {
            recursive: true
        });
        await mkdir(history, {
            recursive: true
        });
        const temporary = join(root, `.${randomUUID()}.tmp`);
        await writeFile(temporary, JSON.stringify(draft, null, 2), {
            flag: 'wx'
        });
        await writeFile(join(history, `${draft.revision}.json`), JSON.stringify(draft, null, 2), {
            flag: 'wx'
        });
        await rename(temporary, join(root, input.pageId + '.json'));
        const entries = (await readdir(history)).filter((n)=>/^\d+\.json$/.test(n)).sort((a, b)=>parseInt(b) - parseInt(a));
        await Promise.all(entries.slice(20).map((n)=>unlink(join(history, n))));
        return draft;
    });
    queues.set(key, operation);
    try {
        return await operation;
    } finally{
        if (queues.get(key) === operation) queues.delete(key);
    }
}
