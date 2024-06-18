import type { ProcessCategory } from "../typing";

export class ViewModelValue {
  subKey: string;
  cat: ProcessCategory;
  k: ProcessCategory | string;
  v: any;
  constructor(subKey: string, cat: ProcessCategory, k: ProcessCategory | string, v: any) {
    this.subKey = subKey;
    this.cat = cat;
    this.k = k;
    this.v = v;
    Object.freeze(this);
  }
}
