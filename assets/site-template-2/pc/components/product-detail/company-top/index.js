import $ from "jquery"
import { eventTracker } from "../../../../../common/tracker";
import { init400Btn } from "../../../../../common/pc/official-400-btn"

init400Btn()

export const viewTel = function () {
  $(document).on("ready", function () {
    $(".online-btn").on("click", () => {
      eventTracker("53kf-pc", "vad-pc")
    });
  })
}