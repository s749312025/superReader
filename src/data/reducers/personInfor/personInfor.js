import * as types from '../../actions/actionsTypes'

export const PersonInfor = (state = {}, action) => {
  switch (action.type) {
    case types.GETPERSON:
      return {
        ...state,
        person: action.data
      }
    default:
      return {
        ...state
      }
  }
}