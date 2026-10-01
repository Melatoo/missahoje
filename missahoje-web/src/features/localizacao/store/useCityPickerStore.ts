import { create } from 'zustand';

interface CityPickerState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useCityPickerStore = create<CityPickerState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
