import { faLongArrowAltDown } from '@fortawesome/free-solid-svg-icons'
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons'
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons'
import { faLongArrowAltUp } from '@fortawesome/free-solid-svg-icons'
import { faRandom } from '@fortawesome/free-solid-svg-icons'
import { faRecycle } from '@fortawesome/free-solid-svg-icons'

import { randomInteger } from '../utils/utils'

export enum HeroNames {
  baraka = 'Baraka',
  jade = 'Jade',
  jaxBriggs = 'Jax Briggs',
  johnnyCage = 'Johnny Cage',
  kabal = 'Kabal',
  kano = 'Kano',
  kitana = 'Kitana',
  kungLao = 'Kung Lao',
  liuKang = 'Liu Kang',
  mileena = 'Mileena',
  nightwolf = 'Nightwolf',
  noobSaibot = 'Noob Saibot',
  raiden = 'Raiden',
  rain = 'Rain',
  scorpion = 'Scorpion',
  shangTsung = 'Shang Tsung',
  shaoKahn = 'Shao Kahn',
  sheeva = 'Sheeva',
  sindel = 'Sindel',
  sonyaBlade = 'Sonya Blade',
  subZero = 'Sub Zero',
}

export const startActiveHeroIndex = (): number => {
  return randomInteger(0, Object.keys(HeroNames).length - 1)
}

export enum Buttons { q = 'q', w = 'w', e = 'e', r = 'r', t = 't', y = 'y' }
export enum ButtonsCyrillic {
  q = 'й',
  w = 'ц',
  e = 'у',
  r = 'к',
  t = 'е',
  y = 'н',
}

export enum Arrows {
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
}

export const buttonEnter = 'Enter'

export const icons = {
  faLongArrowAltDown,
  faLongArrowAltLeft,
  faLongArrowAltRight,
  faLongArrowAltUp,
  faRandom,
  faRecycle,
}

export const heroCardWidth = 136
export const fightTimeInSeconds = 10
