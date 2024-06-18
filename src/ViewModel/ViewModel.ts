import type { KeyAbles, ViewModelParams } from "../typing";

import { ViewModelListener } from "./ViewModelListener";

import { ViewModelValue } from "./ViewModelValue";

export { ViewModel, ViewModelValue };

class ViewModelSubject extends ViewModelListener {
  static #subjects = new Set<InstanceType<typeof ViewModelSubject>>();
  static #inited = false;

  private info = new Set<InstanceType<typeof ViewModelValue>>();
  private listeners = new Set<InstanceType<typeof ViewModelListener>>();

  private static notify() {
    const f = (_: number) => {
      this.#subjects.forEach((v) => {
        if (v.info.size) {
          v.notify();
          v.clear();
        }
      });
      if (this.#inited) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }
  private static watch(vm: InstanceType<typeof ViewModelSubject>) {
    this.#subjects.add(vm);
    if (!this.#inited) {
      this.#inited = true;
      this.notify();
    }
  }
  private static unwatch(vm: InstanceType<typeof ViewModelSubject>) {
    this.#subjects.delete(vm);
    if (!this.#subjects.size) this.#inited = false;
  }

  add(v: InstanceType<typeof ViewModelValue>) {
    this.info.add(v);
  }
  clear() {
    this.info.clear();
  }
  addListener(v: InstanceType<typeof ViewModelListener>) {
    this.listeners.add(v);
    ViewModelSubject.watch(this);
  }
  removeListener(v: InstanceType<typeof ViewModelListener>) {
    this.listeners.delete(v);
    if (!this.listeners.size) ViewModelSubject.unwatch(this);
  }
  notify() {
    this.listeners.forEach((v) => v.viewmodelUpdated(this, this.info));
  }
}

class ViewModel<T = ViewModelParams> extends ViewModelSubject {
  static get<T extends ViewModelParams>(data: T) {
    return new ViewModel<T>(data);
  }

  private _subkey: KeyAbles = "";
  private _parent: InstanceType<typeof ViewModel> | null = null;

  isStop?: boolean;
  changeContents?: Function;

  styles = {};
  attributes = {};
  properties = {};
  events = {};

  constructor(data: ViewModelParams) {
    super();
    (Object.entries(data) as [KeyAbles, InstanceType<typeof ViewModel> | object | boolean][]).forEach(([cat, obj]) => {
      if (cat == "styles" || cat == "attributes" || cat == "properties") {
        if (!obj || typeof obj != "object") throw `invalid object cat: ${cat}, obj: ${obj}`;

        this[cat] = Object.defineProperties(
          {},
          (Object.entries(obj) as [string, any]).reduce((r, [k, v]) => {
            r[k] = {
              enumerable: true,
              get: () => v,
              set: (newV: object) => {
                v = newV;
                this.add(new ViewModelValue(this.subkey, cat, k, v));
              },
            };
            return r;
          }, {} as PropertyDescriptorMap)
        );
      } else {
        Object.defineProperties(this, {
          [cat]: {
            enumerable: true,
            get: () => obj,
            set: (newV: object | boolean) => {
              console.log(22);
              obj = newV;
              this.add(new ViewModelValue(this.subkey, "", cat, obj));
            },
          },
        });
        if (obj instanceof ViewModel) obj.setParent(this, cat);
      }
    });
    Object.seal(this);
  }

  private setParent(parent: InstanceType<typeof ViewModel>, _subkey: KeyAbles) {
    this._parent = parent;
    this._subkey = _subkey;
    this.addListener(parent);
  }

  viewmodelUpdated(_target: InstanceType<typeof ViewModel>, updated: Set<InstanceType<typeof ViewModelValue>>) {
    updated.forEach((v) => this.add(v));
  }
  get subkey() {
    return this._subkey;
  }
  get parent() {
    return this._parent;
  }
}
