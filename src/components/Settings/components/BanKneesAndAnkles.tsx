import { useDispatch, useSelector } from "react-redux";
import {
  selectBanKneesAndAnkles,
  toggleBanKneesAndAnkles,
} from "store/slices/sideModeSettingsSlice";
import { Switch } from "./shared";

const BanKneesAndAnkles = () => {
  const banKneesAndAnkles = useSelector(selectBanKneesAndAnkles);
  const dispatch = useDispatch();

  return (
    <Switch
      id="ban-knee-and-ankle-switch"
      label="Ban knees and ankles"
      isChecked={banKneesAndAnkles}
      onChange={() => dispatch(toggleBanKneesAndAnkles())}
    />
  );
};

export default BanKneesAndAnkles;
