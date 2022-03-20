import { useSelector } from "react-redux";
import { selectFrontModeSettings, selectSideModeSettings } from "store";
import { AppMode } from "store/enums";
import { selectAppMode } from "store/slices/appStateSlice";

export const useSettings = () => {
  const sideModeSettings = useSelector(selectSideModeSettings);
  const frontModeSettings = useSelector(selectFrontModeSettings);
  const appMode = useSelector(selectAppMode);

  const settings =
    appMode === AppMode.FRONT ? frontModeSettings : sideModeSettings;

  return { sideModeSettings, frontModeSettings, appMode, settings };
};
