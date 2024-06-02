import type { ProcessCategory } from "../typing";
import { ViewModel } from "../ViewModel/ViewModel";

export abstract class Processor<K extends any, V extends any, CK = ProcessCategory> {
  cat;
  constructor(cat: CK) {
    this.cat = cat;
    Object.freeze(this);
  }
  process(vm: InstanceType<typeof ViewModel>, el: HTMLElement, k: K, v: V) {
    this._process(vm, el, k, v);
  }

  abstract _process(_vm: InstanceType<typeof ViewModel>, _el: HTMLElement, _k: K, _v: V): any;
}
