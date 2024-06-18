import type { ProcessoresEntries, ProcessCategory } from "../../typing";

import { Processor } from "../../Processor/Processor";
import { ViewModelListener } from "../ViewModelListener";
import { ViewModel, ViewModelValue } from "../ViewModel";

import { BinderItem } from "./BinderItem";

export { BinderItem };

export class Binder extends ViewModelListener {
  #items = new Set<InstanceType<typeof BinderItem>>();
  #processors: {
    [key in ProcessCategory]?: InstanceType<typeof Processor>;
  } = {};

  add(v: InstanceType<typeof BinderItem>) {
    this.#items.add(v);
  }

  viewmodelUpdated(target: InstanceType<typeof ViewModel>, updated: Set<InstanceType<typeof ViewModelValue>>) {
    type Item = [InstanceType<typeof ViewModel>, HTMLElement];
    const items: { [key in ProcessCategory | string]?: Item } = {};

    this.#items.forEach((item) => {
      const vm = target[item.viewmodel as keyof ViewModel];
      if (!(vm instanceof ViewModel)) return;
      items[item.viewmodel] = [vm, item.el];
    });
    updated.forEach((v) => {
      const item = items[v.subKey];
      if (!item) return;

      const [vm, el] = item;
      const processor = this.#processors[v.cat];
      if (!el || !processor) return;
      processor.process(vm, el, v.k, v.v);
    });
  }

  addProcessor<CK extends ProcessCategory>(v: InstanceType<typeof Processor<any, any, CK>>) {
    this.#processors[v.cat] = v;
  }
  watch(viewmodel: InstanceType<typeof ViewModel>) {
    viewmodel.addListener(this);
    this.render(viewmodel);
  }
  unwatch(viewmodel: InstanceType<typeof ViewModel>) {
    viewmodel.removeListener(this);
  }
  render(viewmodel: InstanceType<typeof ViewModel>) {
    const processores = Object.entries(this.#processors) as ProcessoresEntries;
    this.#items.forEach((item) => {
      const vm = viewmodel[item.viewmodel as keyof ViewModel];
      if (!vm || !(vm instanceof ViewModel)) return;

      const el = item.el;
      processores.forEach(([pk, processor]) => {
        (Object.entries(vm[pk]) as [ProcessCategory, object][]).forEach(([k, v]) => {
          processor.process(vm, el, k, v);
        });
      });
    });
  }
}
