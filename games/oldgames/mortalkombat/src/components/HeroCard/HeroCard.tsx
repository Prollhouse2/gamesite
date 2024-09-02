import { HeroNames } from '../../config/config'
import { heroImgs } from '../../assets/heroImgs'
import { HeroNameType } from '../../types/types'

import s from './HeroCard.module.scss'

interface Props {
  hero: HeroNameType
  index: number
  active: boolean
  handleHeroCardClick: (index: number) => void
}

export default function HeroCard({ hero, index, active, handleHeroCardClick }: Props): JSX.Element {
  return (
    <li
      className={active ? s.activeCard : s.card}
      onClick={() => handleHeroCardClick(index)}
    >
      {<img className={s.img} src={heroImgs[hero]} alt={HeroNames[hero]} />}
      <p className={s.name}>{HeroNames[hero]}</p>
    </li>
  )
}
