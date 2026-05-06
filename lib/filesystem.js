import { treeFromString } from '@bablr/agast-helpers/tree';

let history = [];

export let fs = treeFromString(`
  <Directory>
    \`test.cstml\`:
    <File>
      <Program>
        <ExpressionStatement>
          left: <* '2' />
          #: <* ' ' />
          operator: <* '+' />
          #: <* ' ' />
          right:
          <String>
            open: <* "'" />
            content: <* '2' />
            close: <*"'" />
          </>
        </>
      </>
    </>
    foo: <File "Foo file content" />
    bar: <File "Bar file content" />
    baz:
    <Directory>
      bog: <File "Bog file content" />
      snug: <File "Snug file content" />
    </>
  </>`);

export const writeFs = (newFs) => {
  history.push(fs);
  fs = newFs;
};
