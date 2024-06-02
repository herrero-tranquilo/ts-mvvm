import { ViewModel } from "./ViewModel/ViewModel";
import { StylesProcessor } from "./Processor/StylesProcessor";
import { AttributesProcessor } from "./Processor/AttributesProcessor";
import { PropertiesProcessor } from "./Processor/PropertiesProcessor";
import { EventsProcessor } from "./Processor/EventsProcessor";
import { Scanner } from "./Scanner/Scanner";

const setup = (element: Element, viewmodel: InstanceType<typeof ViewModel>) => {
  if (!element) return;

  const scanner = new Scanner();
  const binder = scanner.scan(element);

  binder.addProcessor(new StylesProcessor("styles"));
  binder.addProcessor(new AttributesProcessor("attributes"));
  binder.addProcessor(new PropertiesProcessor("properties"));
  binder.addProcessor(new EventsProcessor("events"));

  binder.watch(viewmodel);
};

const wrapper = {
  styles: {
    width: "50%",
    background: "#ffa",
    cursor: "pointer",
  },
  events: {
    click(_: MouseEvent, vm: InstanceType<typeof ViewModel>) {
      if (vm?.parent?.isStop) vm.parent.isStop = true;
    },
  },
};
const title = {
  properties: {
    innerHTML: "Title",
  },
};
const contents = {
  properties: {
    innerHTML: "Contents",
  },
};
const input = {
  properties: {
    value: "Title",
  },
  events: {
    input(e: KeyboardEvent, _vm: InstanceType<typeof ViewModel>) {
      if (e.isComposing) return;
      input.properties.value = (e.target as HTMLInputElement)?.value;
    },
    blur(e: FocusEvent, _vm: InstanceType<typeof ViewModel>) {
      input.properties.value = (e.target as HTMLInputElement).value.trim();
    },
  },
};

const viewmodel = ViewModel.get({
  isStop: false,
  wrapper: ViewModel.get(wrapper),
  title: ViewModel.get(title),
  contents: ViewModel.get(contents),
  input: ViewModel.get(input),
});

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<section id="target" data-viewmodel="wrapper">
  <h2 data-viewmodel="title"></h2>
  <section data-viewmodel="contents"></section>
  <input type="text" data-viewmodel="input" />
</section>
`;

setup(document.querySelector<HTMLDivElement>("#target")!, viewmodel);

