import { treeFromString } from '@bablr/agast-helpers/tree';

let history = [];

export let fs = treeFromString(`
  <Directory>
    foo: <File />
    bar: <File />
    baz:
    <Directory>
      bog: <File />
      snug: <File />
    </>
  </>`);

export const writeFs = (newFs) => {
  history.push(fs);
  fs = newFs;
};
