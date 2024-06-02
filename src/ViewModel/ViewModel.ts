import type { ViewModelKey, ProcessCategory } from "../typing";

import { Binder } from "./Binder/Binder";
import { ViewModelListener } from "./ViewModelListener";

import { ViewModelValue } from "./ViewModelValue";

export { ViewModel, ViewModelValue };

class ViewModel extends ViewModelListener {
  static get(data: {
    [key in ViewModelKey | ProcessCategory]?: boolean | object | Function | InstanceType<typeof ViewModel>;
  }) {
    return new ViewModel(data);
  }
  static #subjects = new Set<InstanceType<typeof ViewModel>>();
  static #inited = false;
  static notify(vm: InstanceType<typeof ViewModel>) {
    this.#subjects.add(vm);
    if (this.#inited) return;
    this.#inited = true;
    const f = (_: number) => {
      this.#subjects.forEach((vm) => {
        if (vm.#isUpdated.size) {
          vm.notify();
          vm.#isUpdated.clear();
        }
      });
      requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }
  static define(vm: InstanceType<typeof ViewModel>, cat: ProcessCategory, obj: object) {
    return Object.defineProperties(
      obj,
      (Object.entries(obj) as [ProcessCategory, object][]).reduce((r, [k, v]) => {
        r[k] = {
          enumerable: true,
          get: () => v,
          set: (newV) => {
            v = newV;
            vm.#isUpdated.add(new ViewModelValue(vm.subKey, cat, k, v));
          },
        };
        return r;
      }, {} as PropertyDescriptorMap & ThisType<any>)
    );
  }

  isStop?: boolean;
  changeContents?: Function;

  wrapper?: InstanceType<typeof ViewModel>;
  title?: InstanceType<typeof ViewModel>;
  contents?: InstanceType<typeof ViewModel>;
  input?: InstanceType<typeof ViewModel>;

  styles = {};
  attributes = {};
  properties = {};
  events = {};

  subKey: ViewModelKey | ProcessCategory = "";
  parent: InstanceType<typeof ViewModel> | null = null;

  #isUpdated = new Set<InstanceType<typeof ViewModelValue>>();
  #listeners = new Set<InstanceType<typeof ViewModel | typeof Binder>>();

  constructor(data: {
    [key in ViewModelKey | ProcessCategory]?: boolean | object | Function | InstanceType<typeof ViewModel>;
  }) {
    super();
    (Object.entries(data) as [ViewModelKey | ProcessCategory, object][]).forEach(([k, v]) => {
      if (k == "styles" || k == "attributes" || k == "properties") {
        if (!v || typeof v != "object") throw `invalid object k:${k}, v:${v}`;
        this[k] = ViewModel.define(this, k, v);
      } else {
        Object.defineProperty(this, k, {
          enumerable: true,
          get: () => v,
          set: (newV) => {
            v = newV;
            this.#isUpdated.add(new ViewModelValue(this.subKey, "", k, v));
          },
        });
        if (v instanceof ViewModel) {
          v.parent = this;
          v.subKey = k;
          v.addListener(this);
        }
      }
    });
    ViewModel.notify(this);
    Object.seal(this);
  }
  viewmodelUpdated(_target: InstanceType<typeof ViewModel>, updated: Set<InstanceType<typeof ViewModelValue>>) {
    updated.forEach((v) => this.#isUpdated.add(v));
  }
  addListener(v: InstanceType<typeof ViewModel | typeof Binder>) {
    this.#listeners.add(v);
  }
  removeListener(v: InstanceType<typeof ViewModel | typeof Binder>) {
    this.#listeners.delete(v);
  }
  notify() {
    this.#listeners.forEach((v) => v.viewmodelUpdated(this, this.#isUpdated));
  }
}
