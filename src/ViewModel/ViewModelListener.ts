import { ViewModelValue } from "./ViewModel";

export { ViewModelListener };

class ViewModelListener {
  viewmodelUpdated(
    _target: InstanceType<typeof ViewModelListener>,
    _updated: Set<InstanceType<typeof ViewModelValue>>
  ) {
    throw "override";
  }
}
