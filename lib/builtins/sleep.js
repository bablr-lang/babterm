/* global setTimeout */
import { printString, StreamIterable, wait } from '@bablr/agast-helpers/stream';
import * as Tags from '@bablr/agast-helpers/tags';
import { fs } from '../filesystem.js';
import { get } from '@bablr/agast-helpers/path';
import { cwd } from '../cwd.js';
import { deepFreezeRecord } from '@bablr/record';

function* __sleep(args) {
  let { 0: timeSeconds = 1 } = args;

  yield wait(new Promise((resolve) => setTimeout(resolve, timeSeconds * 1000)));

  return deepFreezeRecord({ success: true, data: undefined });
}

let sleep_ = (args) => {
  return new StreamIterable(__sleep(args));
};

export default sleep_;
