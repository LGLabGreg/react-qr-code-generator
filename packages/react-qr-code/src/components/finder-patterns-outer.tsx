import { type ReactNode, useMemo } from 'react'

import {
  FINDER_PATTERN_OUTER_RADIUSES,
  FINDER_PATTERN_OUTER_ROTATIONS,
  FINDER_PATTERN_SIZE,
} from '../constants'
import type { FinderPatternsOuterProps } from '../types/utils'
import {
  finderPatternsOuterInOutPoint,
  finderPatternsOuterLeaf,
  finderPatternsOuterRoundedSquare,
} from '../utils/finder-patterns-outer'
import { sanitizeFinderPatternOuterSettings } from '../utils/settings'

export const FinderPatternsOuter = ({
  modules,
  margin,
  settings,
}: FinderPatternsOuterProps): ReactNode => {
  const { style, color } = useMemo(
    () => sanitizeFinderPatternOuterSettings(settings),
    [settings],
  )

  const ops: Array<string> = []

  const coordinates = useMemo(
    () => [
      { x: margin, y: margin },
      { x: modules.length + margin - FINDER_PATTERN_SIZE, y: margin },
      { x: margin, y: modules.length + margin - FINDER_PATTERN_SIZE },
    ],
    [margin, modules.length],
  )

  console.log('modules.length', modules.length)
  console.log('coordinates', coordinates)

  if (['rounded-sm', 'rounded', 'rounded-lg', 'circle', 'square'].includes(style)) {
    for (const coordinate of coordinates) {
      const { x, y } = coordinate
      if (style === 'rounded-sm' || style === 'rounded' || style === 'rounded-lg') {
        ops.push(
          finderPatternsOuterRoundedSquare({
            x,
            y,
            radius: FINDER_PATTERN_OUTER_RADIUSES[style],
          }),
        )
      } else if (style === 'circle') {
        ops.push(
          `M ${x + FINDER_PATTERN_SIZE / 2} ${y}` +
            `a ${FINDER_PATTERN_SIZE / 2} ${FINDER_PATTERN_SIZE / 2} 0 1 0 0.01 0z` +
            'z' +
            'm 0 1' +
            `a ${FINDER_PATTERN_SIZE / 2 - 1} ${
              FINDER_PATTERN_SIZE / 2 - 1
            } 0 1 1 -0.01 0` +
            'Z',
        )
      } else {
        ops.push(
          `M ${x} ${y}` +
            `v ${FINDER_PATTERN_SIZE}` +
            `h ${FINDER_PATTERN_SIZE}` +
            `v ${-FINDER_PATTERN_SIZE}` +
            'z' +
            `M ${x + 1} ${y + 1}` +
            `h ${FINDER_PATTERN_SIZE - 2 * 1}` +
            `v ${FINDER_PATTERN_SIZE - 2 * 1}` +
            `h ${-FINDER_PATTERN_SIZE + 2 * 1}` +
            'z',
        )
      }
    }
    return <path fill={color} d={ops.join('')} />
  }

  if (
    style === 'inpoint-sm' ||
    style === 'inpoint' ||
    style === 'inpoint-lg' ||
    style === 'outpoint-sm' ||
    style === 'outpoint' ||
    style === 'outpoint-lg' ||
    style === 'leaf-sm' ||
    style === 'leaf' ||
    style === 'leaf-lg'
  ) {
    const pathFn =
      style === 'leaf-sm' || style === 'leaf' || style === 'leaf-lg'
        ? finderPatternsOuterLeaf
        : finderPatternsOuterInOutPoint
    return coordinates
      .map((coordinate, index) => ({
        ...coordinate,
        rotation: FINDER_PATTERN_OUTER_ROTATIONS[style][index],
      }))
      .map(({ x, y, rotation }) => {
        const path = pathFn({
          x,
          y,
          radius: FINDER_PATTERN_OUTER_RADIUSES[style],
        })
        return (
          <path
            key={`finder-patterns-outer-${style}-${x}-${y}`}
            fill={color}
            d={path}
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center',
              transformBox: 'fill-box',
            }}
          />
        )
      })
  }

  return null
}
