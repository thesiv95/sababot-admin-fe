const parsePreviousTime = (str: string) => {
    str = str.replace(/-/g, '').trim();

/*
', 'он  אהב', 'она  אהבה', 'мы  אהבנו', 'вы (м)  אהבתם', 'вы (ж)  אהבתן', 'они (м)  אהבו', 'они (ж)  אהבו']0: "я אהבתי"1: "ты (м)  אהבת"2: "ты (ж)  אהבת"3: "он  אהב"4: "она  אהבה"5: "мы  אהבנו"6: "вы (м)  אהבתם"7: "вы (ж)  אהבתן"8: "они (м)  אהבו"9: "они (ж)  אהבו"length: 10[[Prototype]]: Array(0)
*/

    let strArray = str.split('\n');
    const mapped = strArray.map((el) => {
        if (el !== '') {
            // cut spaces etc
            const spaces = /\s+/g;
            const prepositionsRegExp = /я|ты\(м\)|ты\(ж\)|он*|мы|вы\(м\)|вы\(ж\)|о?н?и\(м\)|о?н?и\(ж\)/g;
            el = el.replace(spaces, '').trim();
            el = el.replace(prepositionsRegExp, '');
            el = el.replace('а', ''); // russian a, hot fix (bad fix but okay)
            return el;
        }
    });
    return mapped;
    
};

export default parsePreviousTime;