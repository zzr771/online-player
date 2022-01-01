import ajax from "./ajax"

export const reqMvDetail = (id) => ajax("/mv/detail", { mvid: id })
export const reqMvUrl = (id) => ajax("/mv/url", { id: id })
export const reqSimiMvs = (id) => ajax("/simi/mv", { mvid: id })
export const reqAllMvs = (params) => ajax("/mv/all", params)
