import fight from '../../assets/otherAnimations/fight.gif'
import finishHim from '../../assets/otherAnimations/finishHim.gif'
import fatality from '../../assets/otherAnimations/fatality.gif'
import superFight from '../../assets/otherAnimations/superFight.gif'

import s from './Popups.module.scss'

interface Props {
  showPopupsInFight: Boolean[]
}

export default function Popups({ showPopupsInFight }: Props): JSX.Element {
  const [
    isShowFight,
    isShowFinishHim,
    isShowFatality,
    isShowSuper,
  ] = showPopupsInFight

  return (
    <>
      {isShowFight && (
        <div className={s.fight}>
          <img src={fight} alt="fight" />
          <div className={s.pressButton}>press the QWERTY buttons</div>
        </div>
      )}
      {isShowFinishHim && (
        <div className={s.finishHim}>
          <img src={finishHim} alt="finish him" />
        </div>
      )}
      {isShowFatality && (
        <div className={s.fatality}>
          <img src={fatality} alt="fatality?" />
          <span className={s.questionMark}>?</span>
        </div>
      )}
      {isShowSuper && (
        <div className={s.superFight}>
          {<img src={superFight} alt="super fight" />}
        </div>
      )}
    </>
  )
}
