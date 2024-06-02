import { ViewModel } from "../ViewModel/ViewModel";
import { Processor } from "./Processor";

export class StylesProcessor<K extends keyof CSSStyleDeclaration, V extends HTMLElement["style"][K]> extends Processor<
  K,
  V
> {
  _process(_vm: ViewModel, el: HTMLElement, k: K, v: V) {
    el.style[k] = v;
  }
}
