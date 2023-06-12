import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { AppMode } from "@store/enums";
import { setAppMode } from "@store/slices/appStateSlice";
import { useSettings } from "@hooks/useSettings";
import { FrontModeSettings } from "./components/FrontModeSettings";
import { SideModeSettings } from "./components/SideModeSettings";

const appModeToTabIndexMap = {
  [AppMode.FRONT]: 0,
  [AppMode.SIDE]: 1,
};

const Settings = () => {
  const dispatch = useDispatch();
  const { appMode } = useSettings();

  return (
    <VStack p="5" pt="0" ml="2" w="400px">
      <Tabs isLazy index={appModeToTabIndexMap[appMode]}>
        <TabList>
          <Tab w="50%" onClick={() => dispatch(setAppMode(AppMode.FRONT))}>
            Front Mode
          </Tab>
          <Tab w="50%" onClick={() => dispatch(setAppMode(AppMode.SIDE))}>
            Side Mode
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel w="330px">
            <FrontModeSettings />
          </TabPanel>

          <TabPanel w="330px">
            <SideModeSettings />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default Settings;
