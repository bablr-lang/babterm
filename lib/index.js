/* global document */
import '@bablr/agast-helpers/debug/register';
import { controlKeys } from './constants.js';
import ls from './builtins/ls.js';
import rm from './builtins/rm.js';
import rmdir from './builtins/rmdir.js';
import false_ from './builtins/false.js';
import sleep from './builtins/sleep.js';
import source from './builtins/source.js';
import tree from './builtins/tree.js';
import { fs } from './filesystem.js';
import { applyTagsToElement } from './html.js';
import { cwd } from './cwd.js';
import { deepFreezeRecord, isDeepRecord } from '@bablr/record';
import { isObject } from '@bablr/agast-helpers/object';
import { printExpression } from '@bablr/agast-helpers/print';
import { getStreamIterator, streamFromTree } from '@bablr/agast-helpers/stream';
import { buildJSExpressionDeep } from '@bablr/helpers/builders';

let ev;

let repl = () => {
  ev = document.createElement('div');
  ev.classList.add('evaluation');

  let input = document.createElement('div');
  input.classList.add('input');

  let prompt = document.createElement('span');
  prompt.classList.add('prompt');
  prompt.appendChild(document.createTextNode('babterm$ '));
  input.appendChild(prompt);

  let command = document.createElement('span');
  command.classList.add('command');
  input.appendChild(command);

  ev.appendChild(input);

  let output = document.createElement('div');
  output.classList.add('output');

  ev.appendChild(output);

  let return_ = document.createElement('div');
  return_.classList.add('return');

  let status = document.createElement('span');
  status.classList.add('status');

  return_.appendChild(status);

  let message = document.createElement('span');
  message.classList.add('message');

  return_.appendChild(message);

  ev.appendChild(return_);

  document.getElementById('term').appendChild(ev);
};

let builtins = Object.assign(Object.create(null), {
  ls,
  rm,
  rmdir,
  false: false_,
  sleep,
  source,
  tree,
});

document.addEventListener('keydown', (e) => {
  let { key, ctrlKey, altKey, metaKey } = e;
  let command = ev.childNodes[0].childNodes[1];

  if (!controlKeys.includes(key) && !(ctrlKey || altKey || metaKey)) {
    command.appendChild(document.createTextNode(e.key));
  } else if (key === 'Backspace') {
    let child = command.childNodes[command.childNodes.length - 1];
    if (child) command.removeChild(child);
  } else if (key === 'Enter') {
    let text = command.innerText;

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
    } else {
      let args = parts.slice(1);
      let output = ev.childNodes[1];
      let return_ = ev.childNodes[2];
      let builtin_ = builtin || (() => false_(['CMD_NOT_FOUND']));

      let returnValue;
      try {
        let iter = getStreamIterator(applyTagsToElement(output, builtin_(args)));

        return_.classList.add('running');

        let step = iter.next();

        while (true) {
          if (step instanceof Promise) throw new Error('not implemented');
          if (step.done) break;
          let tag = step.value;

          step = iter.next();
        }

        returnValue = step.value;
      } catch (e) {
        returnValue = deepFreezeRecord({
          success: false,
          data: { reason: 'EVAL_ERROR', message: e.message },
        });
      }

      if (!isObject(returnValue) || !isDeepRecord(returnValue)) {
        returnValue = deepFreezeRecord({
          success: false,
          data: { reason: 'BAD_RETURN_VALUE' },
        });
      }

      return_.classList.remove('running');
      return_.classList.add('done');

      if (!returnValue.success) {
        return_.classList.add('return', 'failed');
      }

      if (returnValue.data !== undefined) {
        let iter = getStreamIterator(
          applyTagsToElement(
            return_.childNodes[1],
            streamFromTree(buildJSExpressionDeep(returnValue.data)),
          ),
        );

        let step = iter.next();

        while (true) {
          if (step instanceof Promise) throw new Error('not implemented');
          if (step.done) break;
          let tag = step.value;

          step = iter.next();
        }
      }
    }

    repl();
  }
});

repl();
