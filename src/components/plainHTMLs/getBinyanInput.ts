const getBinyanInput = (values?: string[]): string => {
  // if no values - this is for insert
  if (!values) {
    return `
        <div style="display: flex"> 
          <div style="font-size: 0.9em">
            <input id="ru" placeholder="на русском" class="swal2-input">
            <input id="translit" placeholder="транскрипция" class="swal2-input">
            <input id="binyanType" placeholder="тип биньяна" class="swal2-input">
            <input id="infinitive" placeholder="н/ф на иврите" class="swal2-input">
            <input id="root" maxlength="5" placeholder="корень" class="swal2-input">
          </div>
          <div style="font-size: 0.9em">
            <input id="maleSingle" placeholder="наст.вр-м.р.ед.ч" class="swal2-input">
            <input id="femaleSingle" placeholder="наст.вр-ж.р.ед.ч" class="swal2-input">
            <input id="malePlural" placeholder="наст.вр-м.р.мн.ч" class="swal2-input">
            <input id="femalePlural" maxlength="5" placeholder="наст.вр-ж.р.мн.ч" class="swal2-input">
          </div>
          <div style="font-size: 0.9em">
            <input id="me" placeholder="пр.вр-я" class="swal2-input">
            <input id="youFemaleSingle" placeholder="пр.вр.-ж.р.-ты" class="swal2-input">
            <input id="youMaleSingle" placeholder="пр.вр-м.р.-ты" class="swal2-input">
          </div>
          <div style="font-size: 0.9em">
            <input id="he" placeholder="пр.вр-он" class="swal2-input">
            <input id="she" placeholder="пр.вр.-она" class="swal2-input">
            <input id="we" placeholder="пр.вр-мы" class="swal2-input">
          </div>
          <div style="font-size: 0.9em">
            <input id="youMalePlural" placeholder="пр.вр-вы-м.р." class="swal2-input">
            <input id="youFemalePlural" placeholder="пр.вр-вы-ж.р." class="swal2-input">
            <input id="theyMalePlural" placeholder="пр.вр-они-м.р." class="swal2-input">
            <input id="theyFemalePlural" placeholder="пр.вр-они-ж.р." class="swal2-input">
          </div>
        </div>
        `;
  } else {
    const [
      infinitive,
      translit,
      ru,
      binyanType,
      root,
      maleSingle,
      femaleSingle,
      malePlural,
      femalePlural,
      me,
      youMaleSingle,
      youFemaleSingle,
      he,
      she,
      we,
      youMalePlural,
      youFemalePlural,
      theyMalePlural,
      theyFemalePlural,
    ] = values;

    return `
        <div style="display: flex"> 
          <div style="font-size: 0.9em">
            <input id="ru" placeholder="на русском" class="swal2-input" value="${ru}">
            <input id="translit" placeholder="транскрипция" class="swal2-input" value="${translit}">
            <input id="infinitive" placeholder="н/ф на иврите" class="swal2-input" value="${infinitive}">
            <input id="binyanType" placeholder="тип биньяна" class="swal2-input" value="${binyanType}">
            <input id="root" maxlength="5" placeholder="корень" class="swal2-input" value="${root}">
          </div>
          <div style="font-size: 0.9em">
            <input id="maleSingle" placeholder="наст.вр-м.р.ед.ч" class="swal2-input" value="${maleSingle}">
            <input id="femaleSingle" placeholder="наст.вр-ж.р.ед.ч" class="swal2-input" value="${femaleSingle}">
            <input id="malePlural" placeholder="наст.вр-м.р.мн.ч" class="swal2-input" value="${malePlural}">
            <input id="femalePlural" maxlength="5" placeholder="наст.вр-ж.р.мн.ч" class="swal2-input" value="${femalePlural}">
          </div>
          <div style="font-size: 0.9em">
            <input id="me" placeholder="пр.вр-я" class="swal2-input" value="${me}">
            <input id="youFemaleSingle" placeholder="пр.вр.-ж.р.-ты" class="swal2-input" value="${youMaleSingle}">
            <input id="youMaleSingle" placeholder="пр.вр-м.р.-ты" class="swal2-input" value="${youFemaleSingle}">
          </div>
          <div style="font-size: 0.9em">
            <input id="he" placeholder="пр.вр-он" class="swal2-input" value="${he}">
            <input id="she" placeholder="пр.вр.-она" class="swal2-input" value="${she}">
            <input id="we" placeholder="пр.вр-мы" class="swal2-input" value="${we}">
          </div>
          <div style="font-size: 0.9em">
            <input id="youMalePlural" placeholder="пр.вр-вы-м.р." class="swal2-input" value="${youMalePlural}">
            <input id="youFemalePlural" placeholder="пр.вр-вы-ж.р." class="swal2-input" value="${youFemalePlural}">
            <input id="theyMalePlural" placeholder="пр.вр-они-м.р." class="swal2-input" value="${theyMalePlural}">
            <input id="theyFemalePlural" placeholder="пр.вр-они-ж.р." class="swal2-input" value="${theyFemalePlural}">
          </div>
        </div>
        `;
  }
};

export default getBinyanInput;
