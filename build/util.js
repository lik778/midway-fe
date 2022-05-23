
const fs = require('fs');
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
}

const getAllSiteTemplateEntry = (templateNum) => {
    let entryFile = {}
    DEVICE_TYPE.forEach(device => {
        const files = fs.readdirSync(`assets/site-template-${templateNum}/${device}`)
        if(files && files.length){
            files.forEach(file => {
                let stat = fs.lstatSync(`assets/site-template-${templateNum}/${device}/${file}`)
                if (stat.isDirectory() === true) { 
                    entryFile[`site-template-${templateNum}-${file}-${device}`] = path.join(__dirname, `../assets/site-template-${templateNum}/${device}/${file}/index.js`)
                }
            })
        }
    })
    return entryFile
}

module.exports = { genSiteTemplateEntry, getAllSiteTemplateEntry }
