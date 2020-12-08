import * as pug from 'pug'

//高光时刻@wulei.受pug的filter在模板层只能传静态，只能后端或服务层处理。这里是通过global全局变量来达到，模板层也可以。
export const  setPugViewEngineHeplers = (helpers: any) => {
  pug.filters = helpers;
  Object.keys(helpers).forEach(helperName => {
    global[helperName] = helpers[helperName]
  })
}
