import { Route, Switch, Redirect } from 'react-router-dom'
import Particles from "react-tsparticles"

import ChooseHero from '../../pages/ChooseHero/ChooseHero'
import VsScreen from '../../pages/VsScreen/VsScreen'
import { Routes } from '../../router/routes'
import particlesJsJsonConfig from '../../config/particlesjsConfig.json'

import s from './App.module.scss'

export default function App(): JSX.Element {
  return (
    <>
      <div className={s.smallScreen}>
        Requires a device with a wider screen.
      </div>
      <div className={s.app}>
        <Particles className={s.particles} params={particlesJsJsonConfig} />
        <Switch>
          <Route path={Routes.ROOT}>
            <ChooseHero />
          </Route>
          <Route path={Routes.VSSCREEN}>
            <VsScreen />
          </Route>
          <Redirect to={Routes.ROOT} />
        </Switch>
      </div>
    </>
  )
}
