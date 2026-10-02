import { demo01 } from './demo-01'
import { demo02 } from './demo-02'
import { demo03 } from './demo-03'
import { demo04 } from './demo-04'
import { demo05 } from './demo-05'
import { demo06 } from './demo-06'
import { demo07 } from './demo-07'
import { demo08 } from './demo-08'
import { demo09 } from './demo-09'
import { demo10 } from './demo-10'
import { demo11 } from './demo-11'
import { demo12 } from './demo-12'
import { demo13 } from './demo-13'
import { demo14 } from './demo-14'
import { demo15 } from './demo-15'
import { demo16 } from './demo-16'
import { demo17 } from './demo-17'
import { demo18 } from './demo-18'
import { demo19 } from './demo-19'
import { demo999 } from './demo-999'
import type { DemoConfig } from './types'

export const demoConfigs: Record<number, DemoConfig> = {
  1: demo01,
  2: demo02,
  3: demo03,
  4: demo04,
  5: demo05,
  6: demo06,
  7: demo07,
  8: demo08,
  9: demo09,
  10: demo10,
  11: demo11,
  12: demo12,
  13: demo13,
  14: demo14,
  15: demo15,
  16: demo16,
  17: demo17,
  18: demo18,
  19: demo19,
  999: demo999,
}
