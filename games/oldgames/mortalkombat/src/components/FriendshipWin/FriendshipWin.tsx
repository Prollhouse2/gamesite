import friendship from '../../assets/otherAnimations/frienship.gif'
import win from '../../assets/otherAnimations/win.gif'
import { useFriendshipWin } from '../../hooks/useFriendshipWin'

import s from './FriendshipWin.module.scss'

export default function FriendshipWin(): JSX.Element {
  const historyToRoot = useFriendshipWin()

  return (
    <div className={s.container}>
      <img className={s.friendship} src={friendship} alt="friendship" />
      <img className={s.win} src={win} alt="win" />
      <button onClick={historyToRoot} className={s.button} type="button">
        Start new game
      </button>
    </div>
  )
}
