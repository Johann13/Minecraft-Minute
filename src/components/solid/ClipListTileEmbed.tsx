import {type Component} from "solid-js";
import type {Clip} from "../../lib/model/Clip.ts";
import {ClipButtons} from "./ClipButtons.tsx";
import {useState} from "./MainStateProvider.tsx";
import {TwitchEmbed} from "./TwitchEmbed.tsx";

interface ClipListTileProps {
  clip: Clip;
}

export const ClipListTileEmbed: Component<ClipListTileProps> = (props) => {
  const {clip} = props;

  const videoCreatedDate = new Date(clip.videoCreatedAt);
  const offset = clip.vodOffset;
  const newDate = new Date(videoCreatedDate.getTime() + (offset * 1000));
  const {formatter} = useState();

  const newDateFormatted = formatter.format(newDate);


  return (
    <table class="table w-full h-full">
      <tbody class="block sm:table-row-group">
      <tr class="block sm:table-row">
        {/* Left side: thumbnail */}
        <td class={`block w-full sm:table-cell sm:w-1/2 p-2`}>
          <div class="relative aspect-video overflow-hidden">
            <TwitchEmbed clip={clip}/>
          </div>
        </td>

        {/* Right side: content */}
        <td class="block w-full sm:table-cell h-full">
          <div class="w-full h-full flex flex-col justify-between p-2">
            {/* Top section: header and index badge */}
            <div class="flex flex-row justify-between items-start">
              <div>
                <h3 class="text-xl font-minecraft text-shadow">{clip.broadcasterName}</h3>
                <p class="text-base text-shadow-sm">{newDateFormatted}</p>
              </div>
              <div class="bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center">
                <p class="font-minecraft text-base">#{clip.index}</p>
              </div>
            </div>

            {/* Bottom section: buttons */}
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
  );
}
