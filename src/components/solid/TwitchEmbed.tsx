import {type Component, Show} from "solid-js";
import type {Clip} from "../../lib/model/Clip.ts";

interface TwitchEmbedProps {
  clip: Clip
}

export const TwitchEmbed: Component<TwitchEmbedProps> = (props) => {
  const src = () => {
    return `${props.clip.clipEmbedUrl}&parent=localhost&parent=minecraft-minute.ostof.dev`
  }

  const shouldShowEmbed = () => props.clip.clipEmbedUrl.includes('https://clips.twitch.tv')

  return (
    <div class="relative aspect-video overflow-hidden">
      <Show
        when={shouldShowEmbed()}
        fallback={
          <img src={props.clip.clipThumbnailUrl}
               alt={props.clip.clipTitle}
               class="w-full h-full object-cover"/>
        }>
        <iframe
          class='w-full h-full absolute top-0 left-0'
          frameborder="0"
          scrolling="no"
          allowfullscreen
          src={src()}
        />
      </Show>
    </div>

  );
}
