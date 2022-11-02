/** Input for x2 command only */
const getDoubles = (values?: string[]): string => {
    // if no values - this is for insert
    if (!values) {
      return `
                <input id="ru" placeholder="на русском" class="swal2-input">
                <input id="single" placeholder="x1" class="swal2-input">
                <input id="double" placeholder="x2" class="swal2-input">
            `;
    } else {
      const [ru, single, double] = values;
      return `
                <input id="ru" placeholder="на русском" class="swal2-input" value="${ru}">
                <input id="translit" placeholder="x1" class="swal2-input" value="${single}">
                <input id="he" placeholder="x2" class="swal2-input" value="${double}">
            `;
    }
  };
  
  export default getDoubles;