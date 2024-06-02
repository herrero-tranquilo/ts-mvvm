import type { ViewModelKey } from "../typing";

import { Binder, BinderItem } from "../ViewModel/Binder/Binder";

export class Scanner {
  scan(el: Element) {
    const binder = new Binder();
    this.checkItem(binder, el);
    const stack = [el.firstElementChild];
    let target;
    while ((target = stack.pop())) {
      this.checkItem(binder, target);
      if (target.firstElementChild) stack.push(target.firstElementChild);
      if (target.nextElementSibling) stack.push(target.nextElementSibling);
    }
    return binder;
  }
  checkItem(binder: InstanceType<typeof Binder>, el: Element) {
    const vm = el.getAttribute("data-viewmodel") as ViewModelKey;
    if (vm) binder.add(new BinderItem(el as HTMLElement, vm));
  }
}
