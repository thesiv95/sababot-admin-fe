import format from "format";
import * as Api from "../../utils/api";
import { NO_WORDS_BY_QUERY } from "../../utils/consts";

const nsfws_searchByWord = async (event: any, Toast: any) => {
  const q = event.target.value;
  let items;

  if (!q) {
    items = await Api.doGetRequest("/nsfws/getAllItems");
  } else {
    items = await Api.doGetRequest(`/nsfws/search?q=${q}&admin=true`);
  }

  if (!items || items.length === 0) {
    Toast.fire({
      icon: "error",
      title: format(
        NO_WORDS_BY_QUERY,
        q.length >= 10 ? q.slice(0, 10) + "..." : q
      ),
    });
    return null;
  }

  return items;
};

export default nsfws_searchByWord;
