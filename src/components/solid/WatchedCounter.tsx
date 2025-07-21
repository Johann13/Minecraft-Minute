import {type Component} from "solid-js";
import {useState} from "./MainStateProvider.tsx";
import './WatchedCounter.css'

export const WatchedCounter: Component = () => {
  const {watched: {count}, clips} = useState();
  const numberOfClips = () => clips().length
  const countLabel = () => `${count()} / ${numberOfClips()}`;
  return (
    <div class={'flex items-center justify-center p-2'}>
      <div class="watched-clips-counter px-3 py-2 text-center font-minecraft flex items-center gap-2">
        Watched: {countLabel()}
      </div>
    </div>
  );
}
