import React from "react";
import { useAppDispatch, useAppSelector } from "./store/store";
import { Link } from "wouter";
import { userActions } from "./store/user_store";
import { disableVideoModal } from "./store/video_modal_actions";

export default function VideoModal() {
  const courseId = useAppSelector((state) => state.user.videoModalCourse);
  const dispatch = useAppDispatch();
  const [disableModal, setDisableModal] = React.useState(false);

  const dialog = React.useRef<HTMLDialogElement>(null);

  // In order to open as a modal, you must
  React.useEffect(() => {
    if (dialog.current && courseId) {
      dialog.current.showModal();
    } else if (dialog.current) {
      dialog.current.close();
    }
  }, [dialog, courseId]);

  function onClose() {
    dispatch(userActions.closeVideoModal());
    if (disableModal) {
      disableVideoModal();
    }
  }

  function dismiss() {
    dialog.current?.close();
  }

  // use the onClose event because dialogs can also be closed with keyboard events
  return (
    <dialog ref={dialog} onClose={onClose}>
      <h3>Download videos separately</h3>
      <p>
        The course has been downloaded, but videos aren&apos;t included in this
        download because of their large file size. You can download course
        videos separately from the &quot;Course Videos&quot; page.
      </p>
      <label>
        <input
          type="checkbox"
          checked={disableModal}
          onChange={(e) => setDisableModal(e.target.checked)}
        ></input>
        Don&apos;t show me this again
      </label>
      {/* Dismiss the modal and navigate */}
      <Link href={`/manage_videos/${courseId}`} onClick={dismiss}>
        Course Videos
      </Link>
      <button type="button" onClick={dismiss}>
        I Understand
      </button>
    </dialog>
  );
}
