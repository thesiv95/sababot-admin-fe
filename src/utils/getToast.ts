// toast appears for several seconds at right top

const getToast = (swalInstance: any) => {
  return swalInstance.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast: {
      addEventListener: (arg0: string, arg1: any) => void;
    }) => {
      toast.addEventListener("mouseenter", swalInstance.stopTimer);
      toast.addEventListener("mouseleave", swalInstance.resumeTimer);
    },
  });
};

export default getToast;
