/** Standard input for group of words, use this one by default */
const getCommonInput = (values?: string[]): string => {
  // if no values - this is for insert
  if (!values) {
    return `
            <input id="ru" placeholder="на русском" class="swal2-input">
            <input id="translit" placeholder="транскрипция" class="swal2-input">
            <input id="he" placeholder="на иврите" class="swal2-input">
        `;
  } else {
    const [ru, translit, he] = values;
    return `
            <input id="ru" placeholder="на русском" class="swal2-input" value="${ru}">
            <input id="translit" placeholder="транскрипция" class="swal2-input" value="${translit}">
            <input id="he" placeholder="на иврите" class="swal2-input" value="${he}">
        `;
  }
};

export default getCommonInput;
