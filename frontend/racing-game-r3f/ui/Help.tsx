import { useStore } from "../store";

import { Keys } from "./Keys";

export function Help(): JSX.Element {
  const [set, help, sound] = useStore((state) => [
    state.set,
    state.help,
    state.sound,
  ]);

  return (
    <>
      <div className="nosound"></div>
      <div className="help">
        {!help && (
          <div className="row">
            <button
              onClick={() => set({ help: true })}
              className="row-item control-key"
            >
              WASD
            </button>
            <div className="row-item control-text">Drive</div>
          </div>
        )}
        {!help && (
          <div className="row">
            <button
              onClick={() => set({ help: true })}
              className="row-item control-key"
            >
              SPACE
            </button>
            <div className="row-item control-text">Break</div>
          </div>
        )}
        {!help && (
          <div className="row">
            <button
              onClick={() => set({ help: true })}
              className="row-item control-key"
            >
              R
            </button>
            <div className="row-item control-text">Reset</div>
          </div>
        )}
        {!help && (
          <div className="row">
            <button
              onClick={() => set({ help: true })}
              className="row-item control-key"
            >
              Q
            </button>
            <div className="row-item control-text">Quit</div>
          </div>
        )}
        {!help && (
          <div className="row">
            <button
              onClick={() => set({ help: true })}
              className="row-item control-key"
            >
              I
            </button>
            <div className="row-item control-text">Help</div>
          </div>
        )}
        <div className={`popup ${help ? "open" : ""}`}>
          <button className="popup-close" onClick={() => set({ help: false })}>
            i
          </button>
          <div className="popup-content">
            <Keys />
          </div>
        </div>
      </div>
    </>
  );
}
