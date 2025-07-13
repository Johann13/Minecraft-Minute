import {Show} from 'solid-js';
import {useAddClipForm} from '../lib/hooks/useAddClipForm.ts';

const AddClipForm = () => {
  const {
    isExpanded,
    toggleForm,
    error,
    success,
    clipUrl,
    setClipUrl,
    handleSubmit
  } = useAddClipForm();
  return (
    <div class="mb-6">
      <table class="table w-full">
        <tbody>
        <tr>
          <td class="p-2" colspan="2">
            <button
              onClick={toggleForm}
              class="w-full flex items-center justify-between p-2 font-minecraft text-shadow"
            >
              <span class="text-lg">Add a new clip</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class={`h-5 w-5 transform transition-transform duration-300 ${isExpanded() ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"/>
              </svg>
            </button>
          </td>
        </tr>
        <Show when={isExpanded()}>
          <tr>
            <td colspan="2">
              <form onSubmit={handleSubmit} class="p-2">
                <div class="mb-3">
                  <label for="clip-url" class="block text-sm font-minecraft text-shadow mb-1">Clip URL</label>
                  <input
                    type="text"
                    id="clip-url"
                    name="clip-url"
                    value={clipUrl()}
                    onInput={(e) => setClipUrl(e.target.value)}
                    placeholder="https://www.twitch.tv/ravs_/clip/..."
                    class="w-full p-2 border-2 border-gray-700 bg-gray-700 text-gray-300"
                    required
                  />
                </div>

                <Show when={error()}>
                  <div class="text-red-500 text-sm font-minecraft mb-2">{error()}</div>
                </Show>

                <Show when={success()}>
                  <div class="text-green-500 text-sm font-minecraft mb-2">Clip added successfully!</div>
                </Show>

                <button
                  type="submit"
                  class="button px-4 py-2 text-center font-minecraft text-shadow"
                >
                  Add Clip
                </button>
              </form>
            </td>
          </tr>
        </Show>
        </tbody>
      </table>
    </div>
  );
}


export default AddClipForm;
