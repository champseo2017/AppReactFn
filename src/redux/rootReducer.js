import { PinSlices } from './slices';
import { CreatePinSlices } from './slices';

const reducer = {
  pin: PinSlices.reducer,
  createPin: CreatePinSlices.reducer,
};

export default reducer;