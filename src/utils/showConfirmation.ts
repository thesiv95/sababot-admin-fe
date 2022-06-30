const showConfirmation = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  swalInstance: any,
  text: string,
  toDelete = true
) => {
  return swalInstance.fire({
    title: toDelete ? "Подтвердите удаление" : "Подтвердите восстановление",
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Да",
    cancelButtonText: "Нет",
  });
};

export default showConfirmation;
