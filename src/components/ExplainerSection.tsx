import {createSignal, Show} from 'solid-js';

const ExplainerSection = () => {
  const [isExpanded, setIsExpanded] = createSignal(false);

  const toggleExplainer = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div class="mb-6">
      <table class="table w-full">
        <tbody>
        <tr>
          <td class="p-2" colspan="2">
            <button
              onClick={toggleExplainer}
              class="w-full flex items-center justify-between p-2 font-minecraft text-shadow"
            >
              <span class="text-lg">What is Minecraft Minute?</span>
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
          <tr>
            <td colspan="2">
              <div class="p-2">
                <p class="font-minecraft text-shadow">
                  Minecraft Minute is a daily game where players share one character, each playing for one minute per
                  day, continuing from where the last left off.
                </p>
              </div>
            </td>
          </tr>
        </Show>
        </tbody>
      </table>
    </div>
  );
}


export default ExplainerSection;
