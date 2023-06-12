import { Switch } from "@components/shared";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBanKneesAndAnkles,
  toggleBanKneesAndAnkles,
} from "@store/slices/sideModeSettingsSlice";

export const BanKneesAndAnkles = () => {
  const banKneesAndAnkles = useSelector(selectBanKneesAndAnkles);
  const dispatch = useDispatch();

  return (
    <Switch
      label="Ban knees and ankles"
      isChecked={banKneesAndAnkles}
      onChange={() => dispatch(toggleBanKneesAndAnkles())}
    />
  );
};
