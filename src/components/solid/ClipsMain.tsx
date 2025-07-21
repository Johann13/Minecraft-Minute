import {type Component, createSignal, Match, Switch} from "solid-js";
import type {Clip} from "../../lib/model/Clip.ts";
import {MainStateProvider, useState} from "./MainStateProvider.tsx";
import {ClipButtons} from "./ClipButtons.tsx";
import {MainButtons} from "./MainButtons.tsx";
import {ClipsGrid} from "./ClipsGrid.tsx";
import SettingsButton from "./SettingsButton";
import SettingsModal from "./SettingsModal";
import {ClipsList} from "./ClipsList.tsx";
import {WatchedCounter} from "./WatchedCounter.tsx";

interface MainProps {
  clips: Clip[]
  timezone: string,
  languages: string[],
  initOrder: 'newestfirst' | 'oldestfirst'
}

const Root: Component = () => {
  const [isSettingsOpen, setIsSettingsOpen] = createSignal(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);
  const {settings} = useState()

  return (
    <div>
      <div class="flex justify-center items-center gap-2 mb-4">
        <MainButtons />
        <SettingsButton onOpenSettings={openSettings} />
      </div>
      <WatchedCounter/>
      <Switch>
        <Match when={settings.settings.layout === 'grid'}>
          <ClipsGrid/>
        </Match>
        <Match when={settings.settings.layout === 'list'}>
          <ClipsList/>
        </Match>
      </Switch>
      <p>{JSON.stringify(settings.settings)}</p>
      <SettingsModal isOpen={isSettingsOpen()} onClose={closeSettings} />
    </div>
  );
}

const ClipsMain: Component<MainProps> = (props) => {
  return (
    <MainStateProvider clips={props.clips} languages={props.languages} timezone={props.timezone} initOrder={props.initOrder}>
      <Root/>
    </MainStateProvider>
  );
}

export default ClipsMain;
