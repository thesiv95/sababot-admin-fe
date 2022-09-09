import format from "format";
import * as Api from "@/utils/api";
import { DELAY_API_REQUEST_MS, NO_WORDS_BY_QUERY } from "@/utils/consts";
import getToast from "@/utils/getToast";

/** NSFWS - search by word */
const searchByWord = (
  event: { target: { value: string } },
  swalInstance: any
) => {
  const Toast = getToast(swalInstance);

  setTimeout(async () => {
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
      return;
    }
    this.items = items;
    this.loading = false;
  }, DELAY_API_REQUEST_MS);
};

export default searchByWord;
