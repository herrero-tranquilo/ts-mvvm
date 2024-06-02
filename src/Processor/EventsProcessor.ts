import { ViewModel } from "../ViewModel/ViewModel";
import { Processor } from "./Processor";

export class EventsProcessor<
  K extends keyof HTMLElementEventMap,
  V extends (this: HTMLElement, ev: HTMLElementEventMap[K], vm: InstanceType<typeof ViewModel>) => any
> extends Processor<K, V> {
  _process(vm: ViewModel, el: HTMLElement, k: K, v: V) {
    el.addEventListener(k, (e) => {
      v.call(el, e as HTMLElementEventMap[K], vm);
    });
  }
}
