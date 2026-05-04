/* global document */
import { controlKeys } from './constants.js';
import ls from './builtins/ls.js';
import rm from './builtins/rm.js';
import rmdir from './builtins/rmdir.js';
import { fs } from './filesystem.js';
import { applyTagsToElement } from './html.js';
import { cwd } from './cwd.js';

let prompt_ = document.createElement('div');
prompt_.appendChild(document.createTextNode('babterm$ \u00A0'));

let builtins = Object.assign(Object.create(null), { ls, rm, rmdir });

document.addEventListener('keydown', (e) => {
  let { key, ctrlKey, altKey, metaKey } = e;
  if (!controlKeys.includes(key) && !(ctrlKey || altKey || metaKey)) {
    prompt_.appendChild(document.createTextNode(e.key));
  } else if (key === 'Backspace') {
    prompt_.removeChild(prompt_.childNodes[prompt_.childNodes.length - 1]);
  } else if (key === 'Enter') {
    let text = prompt_.innerText.slice(10);

    // TODO: this, better
    let parts = text.split(' ');

    let cmd = parts[0];

    let builtin = builtins[cmd];

    if (cmd === 'cd') {
      let target = parts[1];

      if (target === '..') {
        cwd.pop();
      } else {
        cwd.push(target);
      }
    } else if (builtin) {
      prompt_.appendChild(document.createElement('br'));
      let args = parts.slice(1);
      let iter = applyTagsToElement(prompt_, builtin(args))[Symbol.iterator]();

      let step = iter.next();

      while (!step.done) {
        let tag = step.value;

        step = iter.next();
      }
    } else {
      prompt_.appendChild(document.createElement('br'));
      prompt_.appendChild(document.createTextNode('command not found'));
    }

    prompt_ = document.createElement('div');
    prompt_.appendChild(document.createTextNode('babterm$ \u00A0'));
    document.body.appendChild(prompt_);
  }
});

document.body.appendChild(prompt_);
