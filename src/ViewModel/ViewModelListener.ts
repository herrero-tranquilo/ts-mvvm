import { Binder } from "./Binder/Binder";
import { ViewModel, ViewModelValue } from "./ViewModel";

export { ViewModelListener };

const ViewModelListener = class {
  viewmodelUpdated(
    _target: InstanceType<typeof ViewModel | typeof Binder>,
    _updated: Set<InstanceType<typeof ViewModelValue>>
  ) {
    throw "override";
  }
};
