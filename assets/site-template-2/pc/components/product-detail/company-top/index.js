import $ from "jquery"
import { eventTracker } from "../../../../../common/tracker";
import { get400Number } from "../../../../../common/get400Number"

export const viewTel = function () {
  $(document).on("ready", function () {
    const telBtn = $(".telBtn");
    telBtn.one("click", async () => {
      if (isSem) {
        const data = await get400Number()
        $(".telBtn >span").text(data.account ? data.account : '暂无联系方式')
      } else {
        const telNum = telBtn.attr("href").slice(4);
        $(".telBtn >span").text(telNum)
        eventTracker("phone-pc", "vad-pc")
      }
    });
    $(".online-btn").on("click", () => {
      eventTracker("53kf-pc", "vad-pc")
    });
  })
}