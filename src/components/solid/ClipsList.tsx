import {type Component, For, Match, Switch} from "solid-js";
import {useState} from "./MainStateProvider.tsx";
import {ClipListTile} from "./ClipListTile.tsx";
import {ClipListTileEmbed} from "./ClipListTileEmbed.tsx";


export const ClipsList: Component = () => {
  const {settings, clips} = useState()
  return (
    <Switch>
      <Match when={settings.settings.showTwitchClips}>
        <div class='flex flex-col gap-4'>
          <For each={clips()}>
            {
              clip => {
                return <ClipListTileEmbed clip={clip}/>
              }
            }
          </For>
        </div>
      </Match>
      <Match when={!settings.settings.showTwitchClips}>
        <div class='flex flex-col gap-4'>
          <For each={clips()}>
            {
              clip => {
                return <ClipListTile clip={clip}/>
              }
            }
          </For>
        </div>
      </Match>
    </Switch>
  );
}
