import ajax from "./ajax"

export const reqBanners = () => ajax("/banner", { type: 0 })
