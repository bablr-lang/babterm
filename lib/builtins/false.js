import { printString, StreamIterable } from '@bablr/agast-helpers/stream';
import * as Tags from '@bablr/agast-helpers/tags';
import { fs } from '../filesystem.js';
import { get } from '@bablr/agast-helpers/path';
import { cwd } from '../cwd.js';
import { deepFreezeRecord } from '@bablr/record';

function* __false(args) {
  let { 0: reason } = args;

  return deepFreezeRecord({ success: false, data: reason ? { reason } : undefined });
}

let false_ = (args) => {
  return new StreamIterable(__false(args));
};

export default false_;
