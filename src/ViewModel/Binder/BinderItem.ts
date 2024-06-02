import type { ViewModelKey } from "../../typing";

export class BinderItem {
  el: HTMLElement;
  viewmodel: ViewModelKey;

  constructor(el: HTMLElement, viewmodel: ViewModelKey) {
    this.el = el;
    this.viewmodel = viewmodel;
    Object.freeze(this);
  }
}
