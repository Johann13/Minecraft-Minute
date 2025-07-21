import {type Component} from "solid-js";
import "./WatchedClipCheckbox.css";
import {useState} from "./MainStateProvider.tsx";

interface ClipButtonsProps {
  clipId: string;
  clipUrl: string;
  videoId: string;
}

export const ClipButtons: Component<ClipButtonsProps> = (props) => {
  const { clipId, clipUrl, videoId } = props;

  const {watched} = useState()

  const {add, remove, hasWatched} = watched

  return (
    <div class='flex gap-3 mt-4 items-end p-2'>
      <a
        href={clipUrl}
        target="_blank"
        class="button px-2 py-1 text-center view-clip-button"
        data-clip-id={clipId}
      >
        View Clip
      </a>
      {videoId !== '' &&
          <a
              href={`https://www.twitch.tv/videos/${videoId}`}
              target="_blank"
              class="button px-2 py-1 text-center"
          >
              Watch VOD
          </a>
      }
      <div class="flex-1"/>

      <div class="minecraft-checkbox-container">
        <input
          type="checkbox"
          id={`watched-clip-${clipId}`}
          class="minecraft-checkbox"
          data-clip-id={clipId}
          checked={hasWatched(clipId)}
          onChange={(e) => {
            if (e.target.checked) {
              add(clipId);
            } else {
              remove(clipId);
            }
          }}
        />
        <label
          for={`watched-clip-${clipId}`}
          class="minecraft-checkbox-label px-1 py-0.5 text-center font-minecraft flex items-center gap-0.5 text-xs"
        >
          <span class="checkbox-icon"></span>
          <span class="checkbox-text">Watched</span>
        </label>
      </div>
    </div>
  );
}
