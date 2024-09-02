import {
  amountMostRepeatedArrayElement,
  getKeyByValue,
  getActiveHeroName,
  countComboKeyDown,
  getAllCoordinates,
  showPopups,
  randomInteger,
  randomIcon,
  getRandomArena,
  getNextCoordinates,
} from '../utils/utils'
import { IconType } from '../types/types'
import { Arrows } from '../config/config'

describe('test utils', () => {
  it('function getAllCoordinates', () => {
    expect(getAllCoordinates(7, () => 3, 19)).toStrictEqual({
      0: { x: 0, y: 0 },
      1: { x: 1, y: 0 },
      2: { x: 2, y: 0 },
      3: { x: 3, y: 0 },
      4: { x: 4, y: 0 },
      5: { x: 5, y: 0 },
      6: { x: 6, y: 0 },
      7: { x: 0, y: 1 },
      8: { x: 1, y: 1 },
      9: { x: 2, y: 1 },
      10: { x: 3, y: 1 },
      11: { x: 4, y: 1 },
      12: { x: 5, y: 1 },
      13: { x: 6, y: 1 },
      14: { x: 0, y: 2 },
      15: { x: 1, y: 2 },
      16: { x: 2, y: 2 },
      17: { x: 3, y: 2 },
      18: { x: 4, y: 2 },
      19: { x: 7, y: 0 },
      20: { x: -1, y: 0 },
    })
  })

  it('function getKeyByValue', () => {
    expect(getKeyByValue({ 2: { x: 1, y: 2 } }, { x: 1, y: 2 })).toBe('2')
  })

  it('function getActiveHeroName', () => {
    expect(getActiveHeroName(2, ['baraka', 'kano', 'sindel', 'raiden'])).toBe(
      'sindel',
    )
  })

  it('function amountMostRepeatedArrayElement', () => {
    expect(
      amountMostRepeatedArrayElement(['34', '7', '23', '5', '3', '2', '7', '7', '7', '7']),
    ).toBe(5)
  })

  it('function randomInteger', () => {
    const value = randomInteger(2, 5)

    expect(value).toBeGreaterThan(1)
    expect(value).toBeGreaterThanOrEqual(2)
    expect(value).toBeLessThan(6)
    expect(value).toBeLessThanOrEqual(5)
  })

  it('function getRandomArena', () => {
    const stylesObj = {
      arena1: 'VsScreen_arena1__6NO8s',
      arena2: 'VsScreen_arena2__sK0Gn',
      arena3: 'VsScreen_arena3__kV0V3',
      arena4: 'VsScreen_arena4__1LPfp',
      arena5: 'VsScreen_arena5__7RHka',
      arena6: 'VsScreen_arena6__1D_IW',
      arena7: 'VsScreen_arena7__8TUa6',
      arena8: 'VsScreen_arena8__2BPjv',
      arena9: 'VsScreen_arena9__1uMWW',
      arena10: 'VsScreen_arena10__106E3',
      arena11: 'VsScreen_arena11__2pRI-',
      arena12: 'VsScreen_arena12__c_-pI',
    }

    const randomArea = getRandomArena(['VsScreen_container__OmYr_'], stylesObj)

    expect(randomArea).toEqual(
      expect.arrayContaining([
        stylesObj[getKeyByValue(stylesObj, randomArea[1]) as keyof typeof stylesObj],
      ]),
    )

    expect(randomArea).toEqual(
      expect.arrayContaining(['VsScreen_container__OmYr_']),
    )
  })

  it('function randomIcon', () => {
    expect(
      randomIcon(
        {
          iconName: 'long-arrow-alt-left',
        } as IconType,
        {
          faLongArrowAltDown: { iconName: 'long-arrow-alt-down' } as IconType,
          faLongArrowAltLeft: { iconName: 'long-arrow-alt-left' } as IconType,
          faLongArrowAltRight: { iconName: 'long-arrow-alt-right' } as IconType,
          faLongArrowAltUp: { iconName: 'long-arrow-alt-up' } as IconType,
          faRandom: { iconName: 'random' } as IconType,
          faRecycle: { iconName: 'recycle' } as IconType,
        },
      ),
    ).toEqual(expect.not.objectContaining({ iconName: 'long-arrow-alt-left' }))
  })

  it('function countComboKeyDown', () => {
    expect(
      countComboKeyDown([
        { iconName: 'long-arrow-alt-down' } as IconType,
        { iconName: 'random' } as IconType,
        { iconName: 'random' } as IconType,
        { iconName: 'recycle' } as IconType,
        { iconName: 'long-arrow-alt-left' } as IconType,
        { iconName: 'random' } as IconType,
      ]),
    ).toBe(3)
  })

  describe('getNextCoordinates', () => {
    const allCoordinates = {
      0: { x: 0, y: 0 },
      1: { x: 1, y: 0 },
      2: { x: 2, y: 0 },
      3: { x: 3, y: 0 },
      4: { x: 4, y: 0 },
      5: { x: 5, y: 0 },
      6: { x: 6, y: 0 },
      7: { x: 0, y: 1 },
      8: { x: 1, y: 1 },
      9: { x: 2, y: 1 },
      10: { x: 3, y: 1 },
      11: { x: 4, y: 1 },
      12: { x: 5, y: 1 },
      13: { x: 6, y: 1 },
      14: { x: 0, y: 2 },
      15: { x: 1, y: 2 },
      16: { x: 2, y: 2 },
      17: { x: 3, y: 2 },
      18: { x: 4, y: 2 },
      19: { x: 7, y: 0 },
      20: { x: -1, y: 0 },
    }

    it('ArrowUp', () => {
      expect(
        getNextCoordinates(allCoordinates, 10, 7, 'ArrowUp' as keyof Arrows, () => 3),
      ).toStrictEqual([3, 0])

      expect(
        getNextCoordinates(allCoordinates, 20, 7, 'ArrowUp' as keyof Arrows, () => 3),
      ).toStrictEqual([-1, 0])

      expect(
        getNextCoordinates(allCoordinates, 19, 7, 'ArrowUp' as keyof Arrows, () => 3),
      ).toStrictEqual([7, 0])

      expect(
        getNextCoordinates(allCoordinates, 0, 7, 'ArrowUp' as keyof Arrows, () => 3),
      ).toStrictEqual([0, 2])
    })

    it('ArrowDown', () => {
      expect(
        getNextCoordinates(allCoordinates, 10, 7, 'ArrowDown' as keyof Arrows, () => 3),
      ).toStrictEqual([3, 2])

      expect(
        getNextCoordinates(allCoordinates, 14, 7, 'ArrowDown' as keyof Arrows, () => 3),
      ).toStrictEqual([0, 0])
    })

    it('ArrowLeft', () => {
      expect(
        getNextCoordinates(allCoordinates, 10, 7, 'ArrowLeft' as keyof Arrows, () => 3),
      ).toStrictEqual([2, 1])

      expect(
        getNextCoordinates(allCoordinates, 14, 7, 'ArrowLeft' as keyof Arrows, () => 3),
      ).toStrictEqual([4, 2])
    })

    it('ArrowRight', () => {
      expect(
        getNextCoordinates(allCoordinates, 10, 7, 'ArrowRight' as keyof Arrows, () => 3),
      ).toStrictEqual([4, 1])

      expect(
        getNextCoordinates(allCoordinates, 18, 7, 'ArrowRight' as keyof Arrows, () => 3),
      ).toStrictEqual([0, 2])
    })
  })

  describe('showPopups', () => {
    it('isShowFight equal false', () => {
      expect(
        showPopups(1, [{ iconName: 'recycle' } as IconType, null, null, null, null, null]),
      ).toStrictEqual([false, false, false, false])
    })

    it('isShowFight equal true', () => {
      expect(
        showPopups(0, [null, null, null, null, null, null]),
      ).toStrictEqual([true, false, false, false])
    })

    it('isShowSuper equal false', () => {
      expect(
        showPopups(5, [
          { iconName: 'long-arrow-alt-right' } as IconType,
          { iconName: 'long-arrow-alt-up' } as IconType,
          { iconName: 'long-arrow-alt-left' } as IconType,
          { iconName: 'recycle' } as IconType,
          { iconName: 'recycle' } as IconType,
          null,
        ]),
      ).toStrictEqual([false, true, false, false])
    })

    it('isShowSuper equal true', () => {
      expect(
        showPopups(5, [
          { iconName: 'recycle' } as IconType,
          { iconName: 'long-arrow-alt-left' } as IconType,
          { iconName: 'recycle' } as IconType,
          null,
          { iconName: 'long-arrow-alt-left' } as IconType,
          { iconName: 'recycle' } as IconType,
        ]),
      ).toStrictEqual([false, true, false, true])
    })
  })
})
