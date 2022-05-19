import $ from "jquery";
import { eventTracker } from "../../tracker";

export const init400Btn = function () {
  $(document).on("ready", function () {
    const phoneNumBtn = $(".official-400-btn");
    const phoneNumText = $(".official-400-btn >span")

    phoneNumBtn.on("click", async function (e) {
        var phone = $(this).data('phone')
        phoneNumText.text(phone)
        eventTracker("phone-pc", "vad-pc")
    });
  })
}