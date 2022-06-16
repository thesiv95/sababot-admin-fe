const showConfirmation = async (
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
