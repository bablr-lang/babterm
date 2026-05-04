import { printString, StreamIterable } from '@bablr/agast-helpers/stream';
import * as Tags from '@bablr/agast-helpers/tags';
import { fs, writeFs } from '../filesystem.js';
import { Path, get } from '@bablr/agast-helpers/path';
import { cwd } from '../cwd.js';

function* __rm(args) {
  let { 0: file } = args;

  if (!file) throw new Error();

  let resolvedPath = cwd.concat([file]);

  let existing = get(resolvedPath, fs);

  let newFs = fs;

  if (existing.value.name === Symbol.for('Directory') && !Tags.getSize(existing.value.children)) {
    newFs = Path.from(fs).removeAt(resolvedPath).node;
  }

  writeFs(newFs);
}

let rm = (args) => {
  return new StreamIterable(__rm(args));
};

export default rm;
