import {type Component, Show} from "solid-js";
import type {Clip} from "../../lib/model/Clip.ts";
import {ClipButtons} from "./ClipButtons.tsx";
import {useState} from "./MainStateProvider.tsx";
import {TwitchEmbed} from "./TwitchEmbed.tsx";

interface ClipGridTileEmbedProps {
  clip: Clip
}

export const ClipGridTileEmbed: Component<ClipGridTileEmbedProps> = (props) => {
  const {clip} = props;

  const videoCreatedDate = new Date(clip.videoCreatedAt);
  const offset = clip.vodOffset
  const newDate = new Date(videoCreatedDate.getTime() + (offset * 1000));
  const {formatter} = useState()

  const newDateFormatted = formatter.format(newDate);

  return (
    <div class="w-full h-full">
      <table class="table w-full">
        <tbody class="block">
        <tr class="block">
          <td class="block w-full p-2">
            <TwitchEmbed clip={clip} />
          </td>
          <td class="block w-full p-2">
            <div class="w-full h-full flex flex-col justify-between">
              <div class="flex flex-row justify-between items-center">
                <div>
                  <h3 class="text-lg font-minecraft text-shadow">{clip.broadcasterName}</h3>
                  <p class="text-sm text-shadow-sm">{newDateFormatted}</p>
                </div>
                <div class="bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center">
                  <p class="font-minecraft text-sm">#{clip.index}</p>
                </div>
              </div>
              <ClipButtons
                clipId={clip.clipId}
                clipUrl={clip.clipUrl}
                videoId={clip.videoId}
              />
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  );
}
