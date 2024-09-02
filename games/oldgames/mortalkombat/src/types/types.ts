import { IconDefinition, IconLookup } from '@fortawesome/fontawesome-common-types'

import { myHeroAction, myEnemyAction } from '../redux/actions'
import { HeroNames } from '../config/config'
import { ChooseHeroType } from '../hooks/useChooseHero'

export type HeroNameType = keyof typeof HeroNames

interface MyHero {
  type: typeof myHeroAction
  payload: HeroNameType
}

interface MyEnemy {
  type: typeof myEnemyAction
  payload: HeroNameType
}

export type HeroActionTypes = MyHero | MyEnemy

interface MyHeroNameAction {
  type: ChooseHeroType.MyHeroName
  payload: HeroNameType
}

interface MyEnemyNameAction {
  type: ChooseHeroType.MyEnemyName
  payload: HeroNameType
}

interface MyChosenHeroNameAction {
  type: ChooseHeroType.MyChosenHeroName
  payload: HeroNameType
}

interface MyChosenEnemyNameAction {
  type: ChooseHeroType.MyChosenEnemyName
  payload: HeroNameType
}

interface CountHeroesInRowAction {
  type: ChooseHeroType.CountHeroesInRow
  payload: number
}

interface ActiveHeroIndexAction {
  type: ChooseHeroType.ActiveHeroIndex
  payload: number
}

export type ChooseHeroActions =
  MyHeroNameAction |
  MyEnemyNameAction |
  MyChosenHeroNameAction |
  MyChosenEnemyNameAction |
  CountHeroesInRowAction |
  ActiveHeroIndexAction

export type IconType = null | IconDefinition & IconLookup

export interface FullIconsType {
  [key: string]: IconType
}

export interface AllCoordinatesType {
  [key: number]: { x: number, y: number }
}

export interface ArenaTypes {
  [key: string]: string
}

export interface AmountMostRepeatedArrayElementType {
  [key: string]: number
}
