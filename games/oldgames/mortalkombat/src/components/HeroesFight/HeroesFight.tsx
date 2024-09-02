import { heroAnimations } from '../../assets/heroAnimations'
import { HeroNames } from '../../config/config'
import { HeroNameType } from '../../types/types'

import s from './HeroesFight.module.scss'

interface Props {
  myHeroName: HeroNameType | ''
  myEnemyName: HeroNameType | ''
}

export default function HeroesFight({ myHeroName, myEnemyName }: Props): JSX.Element {
  return (
    <div className={s.heroes}>
      {myHeroName && <div className={s.heroAnimation}>
        <p className={s.heroName}>{HeroNames[myHeroName]}</p>
        <img
          className={s.img}
          src={heroAnimations[myHeroName]}
          alt={heroAnimations[myHeroName]}
        />
      </div>}
      {myEnemyName && <div className={s.enemyAnimation}>
        <p className={s.heroName}>{HeroNames[myEnemyName]}</p>
        <img
          className={s.img}
          src={heroAnimations[myEnemyName]}
          alt={heroAnimations[myEnemyName]}
        />
      </div>}
    </div>
  )
}
