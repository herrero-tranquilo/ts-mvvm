import type { ViewModelKey, ProcessCategory } from "../typing";

export class ViewModelValue {
  subKey: ViewModelKey | ProcessCategory;
  cat: ProcessCategory;
  k: ViewModelKey | ProcessCategory;
  v: object;
  constructor(
    subKey: ViewModelKey | ProcessCategory,
    cat: ProcessCategory,
    k: ViewModelKey | ProcessCategory,
    v: object
  ) {
    this.subKey = subKey;
    this.cat = cat;
    this.k = k;
    this.v = v;
    Object.freeze(this);
  }
}
