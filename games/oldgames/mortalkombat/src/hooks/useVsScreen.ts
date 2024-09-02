import { useEffect, useCallback, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { getMyHeroName, getMyEnemyName } from '../redux/selectors'
import { Buttons, ButtonsCyrillic, icons } from '../config/config'
import { randomIcon, getRandomArena, showPopups } from '../utils/utils'
import { Routes } from '../router/routes'
import { ArenaTypes, IconType } from '../types/types'

export const useVsScreen = (vsScreenScss: ArenaTypes) => {
  const history = useHistory()
  const arenaClasses = useMemo(() => [vsScreenScss.container], [
    vsScreenScss.container,
  ])
  const myHeroName = useSelector(getMyHeroName)
  const myEnemyName = useSelector(getMyEnemyName)
  const [iconQ, setIconQ] = useState<IconType>(null)
  const [iconW, setIconW] = useState<IconType>(null)
  const [iconE, setIconE] = useState<IconType>(null)
  const [iconR, setIconR] = useState<IconType>(null)
  const [iconT, setIconT] = useState<IconType>(null)
  const [iconY, setIconY] = useState<IconType>(null)
  const [countKeyDown, setCountKeyDown] = useState(0)

  useEffect(() => {
    if (!myHeroName && !myEnemyName) {
      history.push(Routes.ROOT)
    }
  }, [myHeroName, myEnemyName, history])

  const handleKeyDown = useCallback(
    e => {
      const key = e.key.toLowerCase()
      const isKeyQWERTY = [
        ...Object.values(Buttons),
        ...Object.values(ButtonsCyrillic),
      ].includes(key)

      if (isKeyQWERTY) {
        let qwertyButtons: typeof Buttons | typeof ButtonsCyrillic | undefined
        if (Object.values(Buttons).includes(key)) {
          qwertyButtons = Buttons
        } else if (Object.values(ButtonsCyrillic).includes(key)) {
          qwertyButtons = ButtonsCyrillic
        }
        switch (key) {
          case qwertyButtons!.q:
            setIconQ(randomIcon(iconQ, icons))
            break
          case qwertyButtons!.w:
            setIconW(randomIcon(iconW, icons))
            break
          case qwertyButtons!.e:
            setIconE(randomIcon(iconE, icons))
            break
          case qwertyButtons!.r:
            setIconR(randomIcon(iconR, icons))
            break
          case qwertyButtons!.t:
            setIconT(randomIcon(iconT, icons))
            break
          case qwertyButtons!.y:
            setIconY(randomIcon(iconY, icons))
            break
          default:
            break
        }

        setCountKeyDown(prevState => prevState + 1)
      }
    },
    [iconQ, iconW, iconE, iconR, iconT, iconY],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const arenaClass = useMemo(() => {
    return getRandomArena(arenaClasses, vsScreenScss).join(' ')
  }, [arenaClasses, vsScreenScss])

  const allIcons: IconType[] = [iconQ, iconW, iconE, iconR, iconT, iconY]
  const showPopupsInFight = showPopups(countKeyDown, allIcons)

  return { arenaClass, allIcons, showPopupsInFight, myHeroName, myEnemyName }
}
