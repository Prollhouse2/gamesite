import { myHeroAction, myEnemyAction } from './actions'
import { AppStateType } from './store'
import { HeroNameType } from '../types/types'

export const getMyHeroName = (state: AppStateType): HeroNameType | '' => state.heroes[myHeroAction.type]
export const getMyEnemyName = (state: AppStateType): HeroNameType | '' => state.heroes[myEnemyAction.type]
