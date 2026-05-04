import { printString, StreamIterable } from '@bablr/agast-helpers/stream';
import * as Tags from '@bablr/agast-helpers/tags';
import { fs } from '../filesystem.js';
import { Path } from '@bablr/agast-helpers/path';
import { cwd } from '../cwd.js';

function* __touch(args) {
  let { 0: file } = args;

  set(cwd);

  Path.from(fs).removeAt();
}

let touch = (args) => {
  return new StreamIterable(__touch(args));
};

export default touch;
