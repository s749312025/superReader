import * as types from '../../actions/actionsTypes'

export const NewShowList = (state = {}, action) => {
  switch (action.type) {
    case types.GETLATEST:
      return {
        ...state,
        lastList: action.data
      }
    case types.GETHOT:
      return {
        ...state,
        hotList: action.data
      }
    case types.GETNODELIST:
      return {
        ...state,
        nodeList: action.data
      }
    default:
      return {
        ...state
      }
  }
}