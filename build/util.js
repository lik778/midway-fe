const glob = require('glob');
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

const getAllSiteTemplateEntry = (templateNum, extraPaths = []) => {
    let entryFile = {}
    DEVICE_TYPE.map(device => {
        const folderName = `../assets/site-template-${templateNum}/${device}`
        const files = glob.sync(`${folderName}/**/index.js`)
        if(files && files.length){
            files.map(file => {
                let name = file.match("/(?<=" + folderName + "\/).*?(?=\/index.js)/")
                entryFile[`site-template-${templateNum}-${name}-${device}`] = [path.resolve(__dirname, '..', `assets/site-template-${templateNum}/${device}/${name}/index.js`), ...extraPaths]
            })
        }
    })
    return entryFile
}

module.exports = { genSiteTemplateEntry, getAllSiteTemplateEntry }
