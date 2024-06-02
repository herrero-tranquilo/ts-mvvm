import { Processor } from "./Processor/Processor";

export type ProcessoresEntries = [
  "styles" | "attributes" | "properties" | "events",
  InstanceType<typeof Processor>
][];

export type ViewModelKey =
  | "wrapper"
  | "title"
  | "contents"
  | "input"
  | "isStop"
  | "changeContents";

export type ProcessCategory =
  | "styles"
  | "attributes"
  | "properties"
  | "events"
  | "";
