const getLessonInput = (values?: string[]): string => {
  // if no values - this is for insert
  if (!values) {
    return `
            <input id="index" placeholder="на русском" class="swal2-input">
            <input id="title" placeholder="транскрипция" class="swal2-input">
            <input id="url" placeholder="на иврите" class="swal2-input">
        `;
  } else {
    const [index, title, url] = values;
    return `
            <input id="index" placeholder="на русском" class="swal2-input" value="${index}">
            <input id="title" placeholder="транскрипция" class="swal2-input" value="${title}">
            <input id="url" placeholder="на иврите" class="swal2-input" value="${url}">
        `;
  }
};

export default getLessonInput;
