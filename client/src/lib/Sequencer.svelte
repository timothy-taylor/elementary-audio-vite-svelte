<script>
  import { el } from "@elemaudio/core";
  import { core } from "./stores.js"
  import { noteToHz } from "./utils.js";
  import * as lib from "./elem-components.js";

  let amp = 0.1;
  let freq = 3;
  let delayTime = 525;
  let delayFb = 0.1;
  let steps = [1, 5, 7, 8, 10];
  let attack = 0.2;
  let decay = 0.65;

  //
  // rerun render on any param change
  const renderChanges = () => {
    let kAmp = el.const({ key: "amp", value: amp });
    let kFreq = el.const({ key: "freq", value: freq });
    let kTime = el.const({ key: "time", value: delayTime });
    let kFb = el.const({ key: "fb", value: delayFb });
    let kAtk = el.const({ key: "attack", value: attack });
    let kDecay = el.const({ key: "decay", value: decay });
    let arp = steps.map(x => noteToHz(x))

    let env = el.adsr(kAtk, kDecay, 0, 0, el.train(kFreq));
    let dry = el.mul(kAmp, env, el.cycle(el.seq2({ seq: arp }, el.train(kFreq), 0)));
    let delay = lib.delay(dry, kTime, kFb);
    let sum = el.add(dry, delay);
    $core.render(el.dcblock(sum), el.dcblock(sum))
  }

  $core.on("load", () => {
    renderChanges();
  })
</script>

<form class="flex-col" on:change={renderChanges}>
    <label class="flex-col">
        amplitude: {amp}
        <input type="range" min="0" max="1" step="0.1" bind:value={amp}>
    </label>

    <label class="flex-col">
        attack: {attack}
        <input type="range" min="0" max="3" step="0.1" bind:value={attack}>
    </label>

    <label class="flex-col">
        decay: {decay}
        <input type="range" min="0.1" max="3" step="0.1" bind:value={decay}>
    </label>

    <label class="flex-col">
        seq speed: {freq}
        <input type="range" min="1" max="20" step="0.1" bind:value={freq}>
    </label>

    <label class="flex-col">
        5 step seq: {steps}
        {#each steps as step, i}
            <input type="range" min="0" max="24" step="1" bind:value={steps[i]}>
        {/each}
    </label>

    <label class="flex-col">
        delay time: {delayTime} ms
        <input type="range" min="30" max="1200" step="1" bind:value={delayTime}>
    </label>
    <label class="flex-col">
        delay feedback: {delayFb}
        <input type="range" min="0" max="1" step="0.1" bind:value={delayFb}>
    </label>
</form>

<style>
    input {
        padding: 0.6rem;
    }
    label {
        margin-bottom: 0.6rem;
    }

    /* utility classes */
    .flex-col {
        display: flex;
        flex-direction: column;
    }
</style>
