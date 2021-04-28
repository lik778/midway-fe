const path = require('path');
const { DEVICE_TYPE } = require('./constant');

const genSiteTemplateEntry = (templateNum, templatePageNames, extraPaths = []) => {
  return templatePageNames.reduce((preValue, pageName) => {
    DEVICE_TYPE.forEach(device => {
      preValue[`site-template-${templateNum}-${pageName}-${device}`] =
      [path.resolve(__dirname, '..', `assets/site-template-${templateNum}/${device}/${pageName}/index.js`), ...extraPaths]
    })
    return preValue
  }, {})


module.exports = { genSiteTemplateEntry }
