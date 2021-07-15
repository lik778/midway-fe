// 获取400号码
import $ from "jquery";
export const get400Number = function () {
  return new Promise(function (resolve, reject) {
    const shopName = $('#shop-name').text();
    // TODO;
    $.ajax({
      url: "/site-api/getPhoneNumber400",
      type: 'POST',
      dataType: 'json',
      data: { shopName },
      async: true,
      success: (res) => {
        if (res.success) {
          resolve(res.data)
        } else {
          alert(res.message)
          reject(res)
        }
      },
      error: (res) => {
        alert(res.message || '请稍后再试！')
        reject(res)
      },
    });
  })
}
