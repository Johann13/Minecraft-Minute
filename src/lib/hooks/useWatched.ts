import type {Clip} from "../model/Clip.ts";
import {createEffect, createSignal} from "solid-js";

const STORAGE_KEY = 'minecraft-minute-watched-clips'

export function useWatched() {

  const init = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const [watched, setWatched] = createSignal<string[]>(init)

  createEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watched()));
  })

  const hasWatched = (clipId: string) => {
    return watched().includes(clipId);
  }

  const add = (clipId: string) => {
    if (!hasWatched(clipId)) {
      setWatched((clips)=> {
        return [...clips, clipId];
      })
    }
  }

  const remove = (clipId: string) => {
    if (hasWatched(clipId)) {
      setWatched((clips)=> {
        return clips.filter(c=> c !== clipId);
      })
    }
  }

  const count = () => watched().length;

  return {
    hasWatched,
    add,
    remove,
    count,
  }

}
