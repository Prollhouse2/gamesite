import { HeroNames } from '../../config/config'
import { heroAnimations } from '../../assets/heroAnimations'
import HeroCard from '../../components/HeroCard/HeroCard'
import { useChooseHero } from '../../hooks/useChooseHero'

import s from './ChooseHero.module.scss'

export default function ChooseHero() {
  const {
    myChosenHeroName,
    allHeroNames,
    countAllHero,
    activeHeroIndex,
    myHeroName,
    listEl,
    myEnemyName,
    handleHeroCardClick,
  } = useChooseHero()

  return (
    <>
      <div className={s.container}>
        <p className={s.title}>
          {myChosenHeroName ? (
            <span className={s.enemy}>Choose Your Enemy</span>
          ) : (
            'Choose Your Hero'
          )}
        </p>
        <div className={s.main}>
          <div className={s.listWrapper}>
            <div className={s.myHero}>
              <HeroCard
                key={allHeroNames[countAllHero - 1]}
                hero={allHeroNames[countAllHero - 1]}
                index={countAllHero - 1}
                active={countAllHero - 1 === activeHeroIndex}
                handleHeroCardClick={handleHeroCardClick}
              />
              {myHeroName && (
                <div className={s.heroAnimation}>
                  <img
                    className={s.img}
                    src={
                      myChosenHeroName
                        ? heroAnimations[myChosenHeroName]
                        : heroAnimations[myHeroName]
                    }
                    alt={HeroNames[myHeroName]}
                  />
                  <p className={s.heroName}>
                    {myChosenHeroName
                      ? HeroNames[myChosenHeroName]
                      : HeroNames[myHeroName]}
                  </p>
                </div>
              )}
            </div>
            <ul className={s.list} ref={listEl}>
              {allHeroNames.slice(0, -2).map((hero, index) => {
                return (
                  <HeroCard
                    key={hero}
                    hero={hero}
                    index={index}
                    active={index === activeHeroIndex}
                    handleHeroCardClick={handleHeroCardClick}
                  />
                )
              })}
            </ul>
            <div className={s.myEnemy}>
              <HeroCard
                key={allHeroNames[countAllHero - 2]}
                hero={allHeroNames[countAllHero - 2]}
                index={countAllHero - 2}
                active={countAllHero - 2 === activeHeroIndex}
                handleHeroCardClick={handleHeroCardClick}
              />
              {myEnemyName && (
                <div className={s.heroAnimation}>
                  <img
                    className={s.img}
                    src={heroAnimations[myEnemyName]}
                    alt={heroAnimations[myEnemyName]}
                  />
                  <p className={s.heroName}>{HeroNames[myEnemyName]}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
