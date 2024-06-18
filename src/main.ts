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

const viewmodel = ViewModel.get({
  isStop: false,
  wrapper: ViewModel.get({
    styles: {
      width: "50%",
      background: "#ffa",
      cursor: "pointer",
    },
  }),
  title: ViewModel.get({
    properties: {
      innerHTML: "Title",
    },
  }),
  contents: ViewModel.get({
    properties: {
      innerHTML: "Contents",
    },
  }),
  input: ViewModel.get({
    properties: {
      value: "Title",
    },
    events: {
      input(e: KeyboardEvent, vm: InstanceType<typeof ViewModel>) {
        if (e.isComposing) return;
        vm.parent.title.properties.innerHTML = (e.target as HTMLInputElement)?.value;
      },
      blur(e: FocusEvent, vm: InstanceType<typeof ViewModel>) {
        vm.properties.value = (e.target as HTMLInputElement).value.trim();
      },
    },
  }),
});

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<section id="target" data-viewmodel="wrapper">
  <h2 data-viewmodel="title"></h2>
  <section data-viewmodel="contents"></section>
  <input type="text" data-viewmodel="input" />
</section>
`;

setup(document.querySelector<HTMLDivElement>("#target")!, viewmodel);

