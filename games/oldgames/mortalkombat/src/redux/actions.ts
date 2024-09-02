import { createAction } from '@reduxjs/toolkit'
import { HeroNameType } from '../types/types'

export const myHeroAction = createAction<HeroNameType, 'myHero'>('myHero')
export const myEnemyAction = createAction<HeroNameType, 'myEnemy'>('myEnemy')
