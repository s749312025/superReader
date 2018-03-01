import * as types from './actionsTypes'

import {api, Request} from '../../config/api'

export const getLatest = (data) => {
  return {
    type: types.GETLATEST,
    data: data
  }
}

export const getHot = (data) => {
  return {
    type: types.GETHOT,
    data: data
  }
}