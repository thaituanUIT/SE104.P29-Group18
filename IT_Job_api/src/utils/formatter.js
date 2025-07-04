/* eslint-disable */
/* Simple method to Convert a String to Slug
    dùng để convert data từ người dùng thành 1 định dạng cố định dùng trên URL
*/
import { pick } from "lodash"
export const slugify = (val) => {
  if (!val) return ''
  return String(val)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // remove consecutive hyphens
}

// Chọn data trả về từ BE trả về cho FE (ko trả về password được hash bên userService)
export const pickDataEmployer = (data) => {
  if(!data)
    return {}
  return pick(data, ['jobCount','_id','email','fullName','phoneNumber', 'position', 'workEmail' ,'companyName', 'companyLocation', 'isActive', 'companyURL', 'companyCountry' ,'createAt', 'updateAt', 'backgroundURL', 'logoURL', 'linkedln', 'industry', 'companySize','companyDescription', 'companyAddress', 'companyTitle', 'overtimeRequired','workDaysEnd', 'workDaysStart', 'companySize'])
}
