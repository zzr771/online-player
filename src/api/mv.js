import ajax from "./ajax"

// MV详情页
export const reqMvDetail = (id) => ajax("/mv/detail", { mvid: id }, 1)
export const reqMvUrl = (id) => ajax("/mv/url", { id: id })
export const reqSimiMvs = (id) => ajax("/simi/mv", { mvid: id })

// "最新MV"页
export const reqAllMvs = (params) => ajax("/mv/all", params, 1)
