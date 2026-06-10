import { printString, StreamIterable } from '@bablr/agast-helpers/stream';
import * as Tags from '@bablr/agast-helpers/tags';
import { fs } from '../filesystem.js';
import { Path, get } from '@bablr/agast-helpers/path';
import { cwd } from '../cwd.js';
import { deepFreezeRecord } from '@bablr/record';
import { parseTag, streamFromTree } from '@bablr/agast-helpers/tree';
import { buildTag } from '@bablr/helpers/builders';
import { CloseNodeTag, OpenNodeTag } from '@bablr/agast-helpers/symbols';

function* __tree(args) {
  let { 0: file } = args;

  if (!file) {
    return deepFreezeRecord({ success: false, data: { reason: 'BAD_ARGS' } });
  }

  let resolvedPath = cwd.concat([file]);

  let existing = get(resolvedPath, fs);

  if (!existing) {
    return deepFreezeRecord({ success: false, data: { reason: 'FILE_NOT_FOUND' } });
  }

  let first = true;
  let depth = 0;
  for (let tag of streamFromTree(existing)) {
    if (!first) yield String.raw`<* '\n' />`;
    let tag_ = parseTag(tag);

    debugger;
    if (tag_.type === CloseNodeTag) --depth;

    yield String.raw`<* ${printString('  '.repeat(depth))} />`;

    yield* streamFromTree(buildTag(tag_));

    if (tag_.type === OpenNodeTag && !tag_.value.selfClosing) ++depth;
    first = false;
  }

  return deepFreezeRecord({ success: true, data: undefined });
}

let tree = (args) => {
  return new StreamIterable(__tree(args));
};

export default tree;
