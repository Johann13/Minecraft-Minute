import {type Component, Show} from "solid-js";
import {useState} from "./MainStateProvider.tsx";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: Component<SettingsModalProps> = (props) => {
  const {settings} = useState();

  const {setLayoutToList, setLayoutToGrid, enableTwitchClips, disableTwitchClips} = settings;

  const handleSave = (e: Event) => {
    e.preventDefault();
    props.onClose();
    // No need to reload the page as in the Astro version since Solid.js is reactive
  };

  const handleBackdropClick = (e: MouseEvent) => {
    // Close the modal if the backdrop is clicked
    if ((e.target as HTMLElement).classList.contains('settings-modal-backdrop')) {
      props.onClose();
    }
  };

  return (
    <Show when={props.isOpen}>
      <div
        class="settings-modal-backdrop fixed inset-0 z-50"
        onClick={handleBackdropClick}
      >
        <div class="settings-modal">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="font-minecraft text-shadow text-2xl bold">Settings</h2>
            </div>
            <div class="modal-body">
              <form id="settings-form" onSubmit={handleSave}>
                <div class="setting-group">
                  <label class="font-minecraft text-shadow">Layout</label>
                  <div class="radio-options">
                    <div class="radio-option">
                      <input
                        type="radio"
                        id="layoutList"
                        name="layout"
                        value="list"
                        checked={settings.settings.layout === 'list'}
                        onChange={() => setLayoutToList()}
                      />
                      <label for="layoutList" class="font-minecraft text-shadow">List</label>
                    </div>
                    <div class="radio-option">
                      <input
                        type="radio"
                        id="layoutGrid"
                        name="layout"
                        value="grid"
                        checked={settings.settings.layout === 'grid'}
                        onChange={() => setLayoutToGrid()}
                      />
                      <label for="layoutGrid" class="font-minecraft text-shadow">Grid</label>
                    </div>
                  </div>
                </div>

                <div class="setting-group">
                  <label class="font-minecraft text-shadow">Show Twitch Clips</label>
                  <div class="checkbox-option">
                    <div class="checkbox-row">
                      <input
                        type="checkbox"
                        id="showTwitchClips"
                        name="showTwitchClips"
                        checked={settings.settings.showTwitchClips}
                        onChange={(e) => e.target.checked ? enableTwitchClips() : disableTwitchClips()}
                      />
                      <label for="showTwitchClips" class="font-minecraft text-shadow">Show Twitch clips</label>
                    </div>
                    <div class="warning-text">⚠️ Loading many clips might take longer</div>
                  </div>
                </div>

                <div class="button-container">
                  <button type="submit" class="save-button font-minecraft text-shadow">Done</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .settings-modal-backdrop {
          background-color: rgba(0, 0, 0, 0.7);
        }
        
        .settings-modal {
          border: none;
          border-radius: 0;
          padding: 0;
          background-color: transparent;
          max-width: 500px;
          width: 90%;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          margin: 0;
          z-index: 51;
        }
        
        .modal-content {
          background-image: var(--background-image-sign);
          background-repeat: no-repeat;
          background-size: 100% 100%;
          padding: 1.5rem;
          color: white;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .modal-body {
          padding: 0.5rem 0;
        }
        
        .setting-group {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          padding: 0.5rem;
          background-color: rgba(0, 0, 0, 0.2);
        }
        
        .radio-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .radio-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .radio-option input[type="radio"],
        .checkbox-option input[type="checkbox"] {
          cursor: pointer;
        }
        
        .checkbox-option {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }
        
        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .checkbox-option label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .warning-text {
          font-size: 0.8rem;
          color: #ffcc00;
          margin-left: 1.5rem;
          font-style: italic;
        }
        
        .button-container {
          display: flex;
          justify-content: center;
          margin-top: 1.5rem;
        }
        
        .save-button {
          padding: 0.5rem 1rem;
          cursor: pointer;
          background-size: cover;
          background-image: url('/imgs/ui/button-inside.png');
          border-width: 2px;
          border-style: solid;
          border-image: url('/imgs/ui/button-border.png');
          border-image-width: 2px;
          border-image-slice: 10% 3%;
          border-image-repeat: stretch;
        }
        
        .save-button:hover {
          background-image: url('/imgs/ui/button-inside-hover.png');
          color: #fef08a;
          border-image: url('/imgs/ui/button-border-hover.png');
        }
      `}</style>
    </Show>
  );
};

export default SettingsModal;
