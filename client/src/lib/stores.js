import { readable } from "svelte/store";
import WebRenderer from "@elemaudio/web-renderer";

let context = new AudioContext();
let renderer = new WebRenderer();

(async () => {
  let node = await renderer.initialize(context, {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [2],
  });

  node.connect(context.destination);
})();

export const core = readable(renderer);
export const ctx = readable(context);