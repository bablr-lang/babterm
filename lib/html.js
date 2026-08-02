/* global document window console requestAnimationFrame IntersectionObserver */

import classNames from 'classnames';
import { CloseNodeTag, LiteralTag, OpenNodeTag, ReferenceTag } from '@bablr/agast-helpers/symbols';
import { parseTag } from '@bablr/agast-helpers/builders';
import { continue_, getStreamIterator, StreamIterable, wait } from '@bablr/agast-helpers/stream';
import { freeze } from '@bablr/agast-helpers/object';

function* __applyTagsToElement(el, tags) {
  let iter = getStreamIterator(tags);

  let open;
  let referenceTag = null;
  let bindingTag;
  let stack_ = [];

  let step = iter.next();

  while (true) {
    while (step === null || step instanceof Promise) {
      if (step === null) yield continue_(), (step = iter.next());
      if (step instanceof Promise) step = yield wait(step);
    }

    if (step.done) break;

    let tag = parseTag(step.value);

    if (tag.type === ReferenceTag) {
    }

    if (tag.type === OpenNodeTag) {
      let node = document.createElement('node');
      let names = classNames({
        escape: referenceTag?.value.type === '@',
        token: tag.value.flags.token,
        trivia: referenceTag?.value.type === '#',
        intrinsic: referenceTag?.value.flags.intrinsic || false,
      });
      if (tag.value.name) {
        node.setAttribute('name', tag.value.name?.description);
      }
      if (tag.value.name) {
        node.setAttribute('name', tag.value.name?.description);
      }
      if (names) {
        node.setAttribute('class', names);
      }

      el.append(node);
      el = node;
    }

    if (tag.type === LiteralTag || (tag.type === OpenNodeTag && tag.value.literalValue)) {
      let literalValue = tag.type === LiteralTag ? tag.value : tag.value.literalValue;

      let lines = literalValue.split(/\r\n|\r|\n/g);

      let first = true;
      for (let line of lines) {
        if (!first) el.append(document.createElement('br'));
        el.append(document.createTextNode(line));
        first = false;
      }
    }

    if (tag.type === CloseNodeTag || (tag.type === OpenNodeTag && tag.value.selfClosing)) {
      el = el.parentElement;
    }

    step = iter.next();
  }

  return step.value;
}

export const applyTagsToElement = (el, tags) => {
  return new StreamIterable(__applyTagsToElement(el, tags));
};
