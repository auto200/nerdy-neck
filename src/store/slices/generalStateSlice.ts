import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GeneralState {
  currentCamId: string;
  version: string;
}

const initialGeneralState: GeneralState = {
  currentCamId: "",
  version: "0.0.1",
};

export const generalStateSlice = createSlice({
  name: "generalState",
  initialState: initialGeneralState,
  reducers: {
    setCurrentCamId: (state, action: PayloadAction<string>) => {
      state.currentCamId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentCamId } = generalStateSlice.actions;

export default generalStateSlice.reducer;
