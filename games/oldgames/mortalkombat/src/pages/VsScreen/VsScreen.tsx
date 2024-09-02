import { Buttons, fightTimeInSeconds } from '../../config/config'
import { useTimer } from '../../hooks/useTimer'
import { useVsScreen } from '../../hooks/useVsScreen'
import Button from '../../components/Button/Button'
import Popups from '../../components/Popups/Popups'
import HeroesFight from '../../components/HeroesFight/HeroesFight'
import FriendshipWin from '../../components/FriendshipWin/FriendshipWin'

import s from './VsScreen.module.scss'

export default function VsScreen() {
  const seconds = useTimer(fightTimeInSeconds)
  const {
    arenaClass,
    allIcons,
    showPopupsInFight,
    myHeroName,
    myEnemyName,
  } = useVsScreen(s)

  return (
    <>
      {seconds === 0 ? (
        <FriendshipWin />
      ) : (
          <div className={arenaClass}>
            <div className={s.seconds}>{seconds}</div>
            <div className={s.buttons}>
              {Object.values(Buttons).map((buttonName, index) => {
                return (
                  <Button
                    key={buttonName}
                    icon={allIcons[index]}
                  />
                )
              })}
            </div>
            <Popups showPopupsInFight={showPopupsInFight} />
            <HeroesFight myHeroName={myHeroName} myEnemyName={myEnemyName} />
          </div>
        )}
    </>
  )
}
