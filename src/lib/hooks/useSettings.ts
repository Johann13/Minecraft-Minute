import {createStore} from "solid-js/store";


export function useSettings() {
  const initSettings = JSON.parse(localStorage.getItem('minecraft-minute-settings') || '{"layout": "list", "showTwitchClips": false}');

  const [settings, setSettings] = createStore<{
    layout: string;
    showTwitchClips: boolean;
  }>(initSettings)

  const setLayout = (layout: string) => {
    setSettings('layout', layout)
    localStorage.setItem('minecraft-minute-settings', JSON.stringify(settings))
  };
  const setLayoutToGrid = () => setLayout('grid');
  const setLayoutToList = () => setLayout('list');

  const setShowTwitchClips = (showTwitchClips: boolean) => {
    setSettings('showTwitchClips', showTwitchClips);
    localStorage.setItem('minecraft-minute-settings', JSON.stringify(settings))
  }
  const enableTwitchClips = () => setShowTwitchClips(true);
  const disableTwitchClips = () => setShowTwitchClips(false);

  return {
    settings,
    setLayoutToGrid,
    setLayoutToList,
    enableTwitchClips,
    disableTwitchClips
  }
}
