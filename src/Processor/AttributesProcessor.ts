import { ViewModel } from "../ViewModel/ViewModel";
import { Processor } from "./Processor";

export class AttributesProcessor extends Processor<string, string> {
  _process(_vm: ViewModel, el: HTMLElement, k: string, v: string) {
    el.setAttribute(k, v);
  }
}
