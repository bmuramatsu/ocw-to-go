import { AppDispatch } from "./store";
import { userActions } from "./user_store";

const DISABLED_MODAL_KEY = "hasDisabledVideoModal";

// Making this a thunk because it accesses localStorage, and typical actions
// should have no side-effects
export function openVideoModalAction(courseId: string) {
  return async (dispatch: AppDispatch) => {
    if (!localStorage.getItem(DISABLED_MODAL_KEY)) {
      dispatch(userActions.openVideoModal({ courseId }));
    }
  };
}

export function disableVideoModal() {
  localStorage.setItem(DISABLED_MODAL_KEY, "true");
}
