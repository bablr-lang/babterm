import { StreamIterable } from '@bablr/agast-helpers/stream';
import * as Tags from '@bablr/agast-helpers/tags';
import { fs } from '../filesystem.js';
import { Path, get } from '@bablr/agast-helpers/path';
import { cwd } from '../cwd.js';
import { deepFreezeRecord } from '@bablr/record';
import { streamFromTree } from '@bablr/agast-helpers/tree';

function* __source(args) {
  let { 0: file } = args;

  if (!file) {
    return deepFreezeRecord({ success: false, data: { reason: 'BAD_ARGS' } });
  }

  let resolvedPath = cwd.concat([file]);

  let existing = get(resolvedPath, fs);

  if (!existing) {
    return deepFreezeRecord({ success: false, data: { reason: 'FILE_NOT_FOUND' } });
  }

  yield* streamFromTree(existing);

  return deepFreezeRecord({ success: true, data: undefined });
}

let source = (args) => {
  return new StreamIterable(__source(args));
};

export default source;
