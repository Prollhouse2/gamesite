import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { IconType } from '../../types/types'

import s from './Button.module.scss'

interface Props {
  icon: IconType
}

export default function Button({ icon }: Props): JSX.Element {
  const className = [icon ? s.buttonWithoutBG : s.button].join(' ')

  return (
    <div className={s.container}>
      {icon && <FontAwesomeIcon className={s.icon} icon={icon} />}
      <button type="button" className={className}></button>
    </div>
  )
}
