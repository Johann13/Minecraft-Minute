import {createContext, createSignal, type ParentComponent, useContext} from "solid-js";
import type {Clip} from "../../lib/model/Clip.ts";
import {useSettings} from "../../lib/hooks/useSettings.ts";
import {useWatched} from "../../lib/hooks/useWatched.ts";

const useClipsHook = (
  clips: Clip[],
  timezone: string,
  languages: string[],
  initOrder: 'newestfirst' | 'oldestfirst'
) => {

  const settings = useSettings()
  const watched = useWatched()
  const [order, setOrder] = createSignal<'newestfirst' | 'oldestfirst'>(initOrder)
  const [embed, setEmbed] = createSignal<boolean>(false)

  const setOrderNewestFirst = () => setOrder('newestfirst')
  const setOrderOldestFirst = () => setOrder('oldestfirst')

  const enableEmbed = () => setEmbed(true)
  const disableEmbed = () => setEmbed(false)

  const formatter = new Intl.DateTimeFormat(languages, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: timezone
  });

  const sortedClips = () => {
    if (order() == 'newestfirst') {
      return clips.toSorted((a, b) => b.index - a.index)
    } else {
      return clips.toSorted((a, b) => a.index - b.index);
    }
  }

  return {
    clips: sortedClips,
    order, setOrderNewestFirst, setOrderOldestFirst,
    embed, enableEmbed, disableEmbed,
    formatter,
    settings,
    watched
  }
}

interface ClipsProps {
  clips: Clip[]
  timezone: string,
  languages: string[],
  initOrder: 'newestfirst' | 'oldestfirst'
}

const MainStateContext = createContext<ReturnType<typeof useClipsHook>>();

export const MainStateProvider: ParentComponent<ClipsProps> = (props) => {
  const hook = useClipsHook(props.clips, props.timezone, props.languages, props.initOrder);
  return (
    <MainStateContext.Provider value={hook}>
      {props.children}
    </MainStateContext.Provider>
  );
}
export const useState = () => useContext(MainStateContext)!;
