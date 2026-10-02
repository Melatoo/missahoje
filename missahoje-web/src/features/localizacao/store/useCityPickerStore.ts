import { create } from 'zustand';

interface CityPickerState {
  open: boolean;
  returnFocusTo: HTMLElement | null;
  setOpen: (open: boolean) => void;
  openFrom: (opener: HTMLElement) => void;
}

export const useCityPickerStore = create<CityPickerState>((set) => ({
  open: false,
  returnFocusTo: null,
  setOpen: (open) => set(open ? { open, returnFocusTo: null } : { open }),
  openFrom: (opener) => set({ open: true, returnFocusTo: opener }),
}));
