import { createReducer, combineReducers } from '@reduxjs/toolkit'

import { myHeroAction, myEnemyAction } from './actions'
import { HeroNameType } from '../types/types'

interface HeroState {
  myHero: HeroNameType | ''
  myEnemy: HeroNameType | ''
}

const initialState: HeroState = {
  myHero: '',
  myEnemy: '',
}

export const heroesReducer = createReducer(
  initialState, builder =>
  builder
    .addCase(myHeroAction, (state, action) => ({
      ...state,
      [myHeroAction.type]: action.payload,
    }))
    .addCase(myEnemyAction, (state, action) => ({
      ...state,
      [myEnemyAction.type]: action.payload,
    }))
)

export default combineReducers({
  heroes: heroesReducer,
})
