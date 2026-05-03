import { treeFromString } from '@bablr/agast-helpers/tree';

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
