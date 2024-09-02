### Deploy on https://ivankozhyn.github.io/infotech-mortal-kombat

# Task

Разработать приложение, для демонстрации 2х интерактивных экранов из игры
MortalCombat mc_choose_hero: при загрузке страницы, показывается экран - выбор
бойца arrowKeys

- подтверждение enter + переход на 2ой экран (mc_vs_screen) mc_vs_screen: после
  подтверждения выбранного героя нужно показывать этот экран на 10sec
- 6 иконок внизу страницы являются интерактивными, должны меняться по нажатию на
  QWERTY
- в качестве иконок использовать fontIcon (напр.,
  https://fontawesome.com/icons/fonticons)

### доп. уровни сложности (не обязательно):

- список героев на сервере
- ws: синхронизация игровых экранов у 2х игроков
- mc_vs_screen: определенные комбинации должны выкидывать popup'ы со смешными
  фразами
- тесты:
- выбор героев через arrowKeys, выход за пределы
- отрисовка списка героев, если ничего не пришло techstack:
- react / react-router
- racer (https://github.com/derbyjs/racer)
- jest / mocha

### условия приема:

- задание разместить на github'e
- наличие рабочего приложения
- readme с пояснением, как запустить локально

# Запустить локально

- Необходим Node.js v14.
- Склонировать репозиторий https://github.com/ivankozhyn/infotech-mortal-kombat.
- Установить зависимости `npm install` или `yarn install`.
- Запустить проект `npm start` или `yarn start`.

# Реализовано

- основное задание
- мобильная адаптация для девайсов от ширины экрана 408px(Iphone 6/7/8 Plus)
- работает логика выбора персонажа и выхода стрелками за пределы экрана для всех
  экранов(сетка выбора персонажа меняет структуру на разном размере экрана)
- написаны тесты для utils
- при старте битвы показывается надпись 'FIGHT' до момента нажатия на любую
  QWERTY кнопку
  <img src="https://raw.githubusercontent.com/ivankozhyn/infotech-mortal-kombat/master/src/assets/otherAnimations/fight.gif" width="70" />
- если нажать кнопки QWERTY от 3 до 5 раз(работает рандом) появляется надпись
  'FINISH HIM'
  <img src="https://raw.githubusercontent.com/ivankozhyn/infotech-mortal-kombat/master/src/assets/otherAnimations/finishHim.gif" width="150" />
- если нажать кнопки QWERTY от 6 до 8 раз(работает рандом) и более появляется
  вопрос 'FATALITY ?'
  <img src="https://raw.githubusercontent.com/ivankozhyn/infotech-mortal-kombat/master/src/assets/otherAnimations/fatality.gif" width="100" />
- если иконки QWERTY содержат 3 одинаковые, то появляется надпись 'SUPER'
  <img src="https://raw.githubusercontent.com/ivankozhyn/infotech-mortal-kombat/master/src/assets/otherAnimations/superFight.gif" width="80" />
- при загрузке страницы с выбором персонажа, начальный персонаж выбирается
  рандомно
- QWERTY клавиши работают в EN-UA-RU раскладке, есть поддержка и включенного
  CAPS LOCK
- бой всегда заканчивается победой дружбы

# Использовано

- react / react-router / redux / typescript
- react-tsparticles для анимации интерактивного фона
- jest/enzyme для тестов
- хуки: useRef, useEffect, useState, useCallback, useMemo, useHistory,
  useDispatch, useSelector, useReducer
- разделение логики и view с помощью кастомных hooks
- использовалась рекурсия для генерации иконок при нажатии QWERTY(чтоб следующая
  иконка точно не была такая как предыдущая, генерация следующей иконки
  рамдомная)
