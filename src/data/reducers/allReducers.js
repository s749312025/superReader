import { combineReducers } from 'redux';
import { NewShowList } from './noteList/noteList'
import { PersonInfor } from './personInfor/personInfor'


export const allReducers = combineReducers({
  NewShowList,
  PersonInfor
})