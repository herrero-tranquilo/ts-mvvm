import { Processor } from "./Processor/Processor";
import { ViewModel } from "./ViewModel/ViewModel";

export type ViewModelParams = {
  [key in string | ProcessCategory]: boolean | object | Function | InstanceType<typeof ViewModel>;
};

export type ProcessoresEntries = ["styles" | "attributes" | "properties" | "events", InstanceType<typeof Processor>][];

export type ProcessCategory = "styles" | "attributes" | "properties" | "events" | "";

export type KeyAbles = string | ProcessCategory;
