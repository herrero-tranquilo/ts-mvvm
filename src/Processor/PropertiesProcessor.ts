import { ViewModel } from "../ViewModel/ViewModel";
import { Processor } from "./Processor";

export class PropertiesProcessor<K extends keyof HTMLElement, V extends HTMLElement[K]> extends Processor<K, V> {
  _process(_vm: ViewModel, el: HTMLElement, k: K, v: V) {
    el[k] = v;
  }
}
