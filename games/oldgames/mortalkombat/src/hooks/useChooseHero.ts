import { useRef, useEffect, useCallback, useMemo, useReducer } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import {
  HeroNames,
  heroCardWidth,
  startActiveHeroIndex,
  Arrows,
  buttonEnter,
} from '../config/config'
import {
  getAllCoordinates,
  getKeyByValue,
  getNextCoordinates,
  getActiveHeroName,
} from '../utils/utils'
import { HeroNameType, ChooseHeroActions, AllCoordinatesType } from '../types/types'

import { Routes } from '../router/routes'
import { myHeroAction, myEnemyAction } from '../redux/actions'

interface ChooseHeroState {
  myHeroName: HeroNameType | ''
  myEnemyName: HeroNameType | ''
  myChosenHeroName: HeroNameType | ''
  myChosenEnemyName: HeroNameType | ''
  countHeroesInRow: number,
  activeHeroIndex: number,
}

const initialChooseHeroState: ChooseHeroState = {
  myHeroName: '',
  myEnemyName: '',
  myChosenHeroName: '',
  myChosenEnemyName: '',
  countHeroesInRow: 0,
  activeHeroIndex: 0,
}

export enum ChooseHeroType {
  MyHeroName = 'MyHeroName',
  MyEnemyName = 'MyEnemyName',
  MyChosenHeroName = 'MyChosenHeroName',
  MyChosenEnemyName = 'MyChosenEnemyName',
  CountHeroesInRow = 'CountHeroesInRow',
  ActiveHeroIndex = 'ActiveHeroIndex',
}

const chooseHeroReducer = (state: ChooseHeroState, action: ChooseHeroActions) => {
  switch (action.type) {
    case ChooseHeroType.MyHeroName:
      return { ...state, myHeroName: action.payload }
    case ChooseHeroType.MyEnemyName:
      return { ...state, myEnemyName: action.payload }
    case ChooseHeroType.MyChosenHeroName:
      return { ...state, myChosenHeroName: action.payload }
    case ChooseHeroType.MyChosenEnemyName:
      return { ...state, myChosenEnemyName: action.payload }
    case ChooseHeroType.CountHeroesInRow:
      return { ...state, countHeroesInRow: action.payload }
    case ChooseHeroType.ActiveHeroIndex:
      return { ...state, activeHeroIndex: action.payload }
    default:
      return state
  }
}

export const useChooseHero = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const listEl = useRef<HTMLUListElement>(null)
  const [chooseHeroState, chooseHeroDispatch] = useReducer(
    chooseHeroReducer,
    initialChooseHeroState,
  )

  const allHeroNames: HeroNameType[] = useMemo(() => Object.keys(HeroNames), []) as HeroNameType[]
  const countAllHero = allHeroNames.length
  const {
    myHeroName,
    myEnemyName,
    myChosenHeroName,
    countHeroesInRow,
    activeHeroIndex,
  } = chooseHeroState

  useEffect(() => {
    if (listEl.current) {
      chooseHeroDispatch({
        type: ChooseHeroType.CountHeroesInRow,
        payload: Math.floor(listEl.current.offsetWidth / heroCardWidth),
      })
    }
    chooseHeroDispatch({
      type: ChooseHeroType.ActiveHeroIndex,
      payload: startActiveHeroIndex(),
    })
  }, [])

  useEffect(() => {
    chooseHeroDispatch({
      type: ChooseHeroType.MyHeroName,
      payload: getActiveHeroName(activeHeroIndex, allHeroNames),
    })
  }, [allHeroNames, activeHeroIndex])

  const countHeroesInColumn: () => number = useCallback(() => {
    if (countHeroesInRow) {
      return Math.ceil((countAllHero - 2) / countHeroesInRow)
    }
    return 0
  }, [countAllHero, countHeroesInRow])

  const handleKeyDown = useCallback(
    e => {
      const allCoordinates: AllCoordinatesType = getAllCoordinates(
        countHeroesInRow,
        countHeroesInColumn,
        countAllHero - 2,
      )

      if (e.key === buttonEnter) {
        const activeHeroName = getActiveHeroName(activeHeroIndex, allHeroNames)
        if (!myChosenHeroName) {
          chooseHeroDispatch({
            type: ChooseHeroType.MyChosenHeroName,
            payload: activeHeroName,
          })
          chooseHeroDispatch({
            type: ChooseHeroType.MyEnemyName,
            payload: activeHeroName,
          })
          dispatch(myHeroAction(activeHeroName))
        } else {
          chooseHeroDispatch({
            type: ChooseHeroType.MyChosenEnemyName,
            payload: activeHeroName,
          })
          dispatch(myEnemyAction(activeHeroName))
          history.push(Routes.VSSCREEN)
        }
      } else if (Object.values(Arrows).includes(e.key)) {
        const [x, y] = getNextCoordinates(
          allCoordinates,
          activeHeroIndex,
          countHeroesInRow,
          e.key,
          countHeroesInColumn,
        )

        const index = Number(getKeyByValue(allCoordinates, { x, y }))

        chooseHeroDispatch({
          type: ChooseHeroType.ActiveHeroIndex,
          payload: index,
        })

        if (myChosenHeroName) {
          chooseHeroDispatch({
            type: ChooseHeroType.MyEnemyName,
            payload: getActiveHeroName(index, allHeroNames),
          })
        } else {
          chooseHeroDispatch({
            type: ChooseHeroType.MyHeroName,
            payload: getActiveHeroName(index, allHeroNames),
          })
        }
      }
    },
    [
      activeHeroIndex,
      countHeroesInRow,
      countHeroesInColumn,
      history,
      myChosenHeroName,
      countAllHero,
      allHeroNames,
      dispatch,
    ],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const handleResize = () => {
    if (listEl.current) {
      chooseHeroDispatch({
        type: ChooseHeroType.CountHeroesInRow,
        payload: Math.floor(listEl.current.offsetWidth / heroCardWidth),
      })
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleHeroCardClick = (index: number): void => {
    chooseHeroDispatch({
      type: ChooseHeroType.ActiveHeroIndex,
      payload: index,
    })
    if (myChosenHeroName) {
      chooseHeroDispatch({
        type: ChooseHeroType.MyEnemyName,
        payload: getActiveHeroName(index, allHeroNames),
      })
    } else {
      chooseHeroDispatch({
        type: ChooseHeroType.MyHeroName,
        payload: getActiveHeroName(index, allHeroNames),
      })
    }
  }

  return {
    myChosenHeroName,
    allHeroNames,
    countAllHero,
    activeHeroIndex,
    myHeroName,
    listEl,
    myEnemyName,
    handleHeroCardClick,
  }
}
