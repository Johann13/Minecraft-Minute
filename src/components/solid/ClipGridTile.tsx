import {type Component} from "solid-js";
import type {Clip} from "../../lib/model/Clip.ts";
import {ClipButtons} from "./ClipButtons.tsx";
import {useState} from "./MainStateProvider.tsx";

interface ClipGridTileProps {
  clip: Clip;
}

export const ClipGridTile: Component<ClipGridTileProps> = (props) => {
  const {clip} = props;

  const videoCreatedDate = new Date(clip.videoCreatedAt);
  const offset = clip.vodOffset;
  const newDate = new Date(videoCreatedDate.getTime() + (offset * 1000));
  const {formatter} = useState();

  const newDateFormatted = formatter.format(newDate);

  return (
    <table class="table w-full">
      <tbody class="block sm:table-row-group">
      <tr class="block sm:table-row">
        <td class="block w-full sm:table-cell sm:w-1/3">
          <div class="relative aspect-video overflow-hidden">
            <img src={clip.clipThumbnailUrl} alt={clip.clipTitle}
                 class="w-full h-full object-cover"/>
          </div>
        </td>
        <td class="block w-full sm:table-cell p-2">
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
  );
}
