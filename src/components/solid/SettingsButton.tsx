import { type Component, createSignal } from "solid-js";

interface SettingsButtonProps {
  onOpenSettings: () => void;
}

export const SettingsButton: Component<SettingsButtonProps> = (props) => {
  return (
    <button
      class="settings-button font-minecraft text-shadow hidden sm:flex items-center gap-2"
      aria-label="Settings"
      onClick={props.onOpenSettings}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" style="overflow: visible; color: currentcolor;">
        <path d="M9.954 2.21a9.99 9.99 0 0 1 4.091-.002A3.993 3.993 0 0 0 16 5.07a3.993 3.993 0 0 0 3.457.261A9.99 9.99 0 0 1 21.5 8.876 3.993 3.993 0 0 0 20 12a3.99 3.99 0 0 0 1.502 3.124 10.043 10.043 0 0 1-2.046 3.543 3.993 3.993 0 0 0-3.456.261 3.993 3.993 0 0 0-1.954 2.86 9.99 9.99 0 0 1-4.091.004A3.993 3.993 0 0 0 8 18.927a3.993 3.993 0 0 0-3.457-.26A9.99 9.99 0 0 1 2.5 15.121 3.993 3.993 0 0 0 4 12a3.993 3.993 0 0 0-1.502-3.124 10.043 10.043 0 0 1 2.046-3.543A3.993 3.993 0 0 0 8 5.072a3.993 3.993 0 0 0 1.954-2.86zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      </svg>
      <span>Settings</span>
      <style>{`
        .settings-button {
          padding: 0.25rem 0.5rem;
          transition: all 0.2s ease;
          cursor: pointer;
          background-size: cover;
          background-image: url('/imgs/ui/button-inside.png');
          border-width: 2px;
          border-style: solid;
          border-image: url('/imgs/ui/button-border.png');
          border-image-width: 2px;
          border-image-slice: 10% 3%;
          border-image-repeat: stretch;
          color: white;
        }
        .settings-button:hover {
          background-image: url('/imgs/ui/button-inside-hover.png');
          background-size: cover;
          color: #fef08a;
          border-width: 2px;
          border-style: solid;
          border-image: url('/imgs/ui/button-border-hover.png');
          border-image-width: 2px;
          border-image-slice: 10% 3%;
          border-image-repeat: stretch;
          text-decoration: none;
        }
      `}</style>
    </button>
  );
};

export default SettingsButton;
