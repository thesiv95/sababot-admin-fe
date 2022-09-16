import { CONFIRM_DELETE, CONFIRM_RESTORE, NO, YES } from "./consts";

const showConfirmation = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  swalInstance: any,
  text: string,
  toDelete = true
) => {
  return swalInstance.fire({
    title: toDelete ? CONFIRM_DELETE : CONFIRM_RESTORE,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: YES,
    cancelButtonText: NO,
  });
};

export default showConfirmation;
