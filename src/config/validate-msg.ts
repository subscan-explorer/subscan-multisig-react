/* eslint-disable no-template-curly-in-string */
const typeTemplateEn = '${name} is not a valid ${type}';
const typeTemplateZh = '${label}不是合法的 ${type}';
/* eslint-disable */
const en = {
  default: 'Validation error on field ${name}',
  required: '${name} is required',
  enum: '${name} must be one of [${enum}]',
  whitespace: '${name} cannot be empty',
  date: {
    format: '${name} is invalid for format date',
    parse: '${name} could not be parsed as date',
    invalid: '${name} is invalid date',
  },
  types: {
    string: typeTemplateEn,
    method: typeTemplateEn,
    array: typeTemplateEn,
    object: typeTemplateEn,
    number: typeTemplateEn,
    date: typeTemplateEn,
    boolean: typeTemplateEn,
    integer: typeTemplateEn,
    float: typeTemplateEn,
    regexp: typeTemplateEn,
    email: typeTemplateEn,
    url: typeTemplateEn,
    hex: typeTemplateEn,
  },
  string: {
    len: '${name} must be exactly ${len} characters',
    min: '${name} must be at least ${min} characters',
    max: '${name} cannot be longer than ${max} characters',
    range: '${name} must be between ${min} and ${max} characters',
  },
  number: {
    len: '${name} must equal ${len}',
    min: '${name} cannot be less than ${min}',
    max: '${name} cannot be greater than ${max}',
    range: '${name} must be between ${min} and ${max}',
  },
  array: {
    len: '${name} must be exactly ${len} in length',
    min: '${name} cannot be less than ${min} in length',
    max: '${name} cannot be greater than ${max} in length',
    range: '${name} must be between ${min} and ${max} in length',
  },
  pattern: {
    mismatch: '${name} format is invalid',
  },
};

const zh = {
  default: '验证失败 ${name}',
  required: '${label}是必填项',
  enum: '${name} 必须是 [${enum}] 中的一个值',
  whitespace: '${name} 不能为空',
  date: {
    format: '${name} 不符合日期格式',
    parse: '${name} 不能转换为日期',
    invalid: '${name} 是非法日期',
  },
  types: {
    string: typeTemplateZh,
    method: typeTemplateZh,
    array: typeTemplateZh,
    object: typeTemplateZh,
    number: typeTemplateZh,
    date: typeTemplateZh,
    boolean: typeTemplateZh,
    integer: typeTemplateZh,
    float: typeTemplateZh,
    regexp: typeTemplateZh,
    email: typeTemplateZh,
    url: typeTemplateZh,
    hex: typeTemplateZh,
  },
  string: {
    len: '${name} 必须等于 ${len} 个字符',
    min: '${name} 不能少于 ${min} 个字符',
    max: '${name} 不能多于 ${max} 个字符',
    range: '${name} 必须大于 ${min} 并且小于 ${max} 个字符',
  },
  number: {
    len: '${name} 必须等于 ${len}',
    min: '${name} 必须小于 ${min}',
    max: '${name} 不能大于 ${max}',
    range: '${name} 必须介于 ${min} 和 ${max} 之间',
  },
  array: {
    len: '${name} 的长度必须等于 ${len}',
    min: '${name} 的长度必须小于 ${min}',
    max: '${name} 的长度不能大于 ${max}',
    range: '${name} 的长度必须介于 ${min} 和 ${max} 之间',
  },
  pattern: {
    mismatch: '${label}格式不匹配',
  },
};
/* eslint-enable */

export const validateMessages = {
  en,
  zh,
  'zh-CN': zh,
};
