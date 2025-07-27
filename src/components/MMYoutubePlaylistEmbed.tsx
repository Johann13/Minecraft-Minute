import {type Component, createSignal, Show} from 'solid-js';


const MMYoutubePlaylistEmbed: Component = () => {
  const [isExpanded, setIsExpanded] = createSignal(false);

  const togglePlaylist = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div class="mb-6">
      <table class="table w-full">
        <tbody>
        <tr>
          <td class="p-2" colspan="2">
            <button
              onClick={togglePlaylist}
              class="w-full flex items-center justify-between p-2 font-minecraft text-shadow"
            >
              <span class="text-lg">YouTube Playlist</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class={`h-5 w-5 transform transition-transform duration-300 ${isExpanded() ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </td>
        </tr>
        <Show when={isExpanded()}>
          <tr class="block">
            <td class="block p-2">
              <div class="relative aspect-video overflow-hidden">
                <iframe
                  class="w-full h-full"
                  src="https://www.youtube-nocookie.com/embed/videoseries?si=GY4LQbdHeSIPq7wZ&amp;list=PLlnPJsQfGYSru8UV-9EePwImIcuGSYe0S&modestbranding=1&iv_load_policy=3"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
              </div>
            </td>
          </tr>
        </Show>
        </tbody>
      </table>
    </div>
  );
}

export default MMYoutubePlaylistEmbed;
