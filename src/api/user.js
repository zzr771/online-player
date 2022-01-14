import ajax from "./ajax"

// 发送验证码短信
export const reqCaptcha = (phone) => ajax("/captcha/sent", { phone: phone })
// 验证验证码是否正确
export const reqCaptchaVerify = ({ phone, captcha }) => ajax("/captcha/verify", { phone, captcha })

// 登录
export const reqLogin = ({ phone, captcha }) => ajax("/login/cellphone", { phone, captcha })
// 退出登录
export const reqLogout = () => ajax("/logout")

// 获取用户歌单
export const reqUserPlaylists = (id) => ajax("/user/playlist", { uid: id })
