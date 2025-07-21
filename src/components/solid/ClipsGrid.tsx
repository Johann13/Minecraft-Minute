import {type Component, For, Match, Switch} from "solid-js";
import {useState} from "./MainStateProvider.tsx";
import {ClipGridTileEmbed} from "./ClipGridTileEmbed.tsx";
import {ClipGridTile} from "./ClipGridTile.tsx";


export const ClipsGrid: Component = () => {
  const {settings, clips} = useState()
  return (
    <Switch>
      <Match when={settings.settings.showTwitchClips}>
        <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <For each={clips()}>
            {
              clip => {
                return <ClipGridTileEmbed clip={clip}/>
              }
            }
          </For>
        </div>
      </Match>
      <Match when={!settings.settings.showTwitchClips}>
        <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <For each={clips()}>
            {
              clip => {
                return <ClipGridTile clip={clip}/>
              }
            }
          </For>
        </div>
      </Match>
    </Switch>
  );
}
