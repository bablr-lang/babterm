import { printString, StreamIterable } from '@bablr/agast-helpers/stream';
import * as Tags from '@bablr/agast-helpers/tags';
import { fs } from '../filesystem.js';
import { get } from '@bablr/agast-helpers/path';
import { cwd } from '../cwd.js';
import { deepFreezeRecord } from '@bablr/record';

function* __ls(args) {
  let argsIdx = 0;

  let dir;
  let arg = args[argsIdx];
  let flagsStr = '';
  while (arg?.[0] === '-') {
    flagsStr += arg[1];
    arg = args[++argsIdx];
  }
  dir = arg;

  let resolvedDir = dir ? cwd.concat([dir]) : cwd;

  let target = resolvedDir.length ? get(resolvedDir, fs) : fs;

  if (flagsStr.includes('a')) {
    yield '<Directory>';
    yield printString('./');
    yield '</>';
    yield String.raw`<* '\n' />`;
    if (resolvedDir.length) {
      yield '<Directory>';
      yield printString('../');
      yield '</>';
      yield String.raw`<* '\n' />`;
    }
  }

  for (let tag of Tags.traverse(target.value.children)) {
    let isDir = tag.value.node.value.name === Symbol.for('Directory');

    yield isDir ? '<Directory>' : '<File>';
    yield printString(tag.value.reference.name + (isDir ? '/' : ''));
    yield '</>';
    yield String.raw`<* '\n' />`;
  }

  return deepFreezeRecord({ success: true, data: undefined });
}

let ls = (args) => {
  return new StreamIterable(__ls(args));
};

export default ls;
