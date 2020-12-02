import * as pug from 'pug'

export const  setPugViewEngineHeplers = (helpers: any) => {
  pug.filters = helpers;
  Object.keys(helpers).forEach(helperName => {
    global[helperName] = helpers[helperName]
  })
}
