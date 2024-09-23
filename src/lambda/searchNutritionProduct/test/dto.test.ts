import { ok } from 'node:assert'
import { describe, it } from 'node:test'
import { mapItPipe } from '../src/dto'

describe('dto tests', () => {
  describe('mapItPipe function', () => {
    it('should transform data to NutritionProduct', async () => {
      const inputData: Record<string, any>[] = [{ id: 'item1' }, { id: 'item2' }, { id: 'item3' }, { id: 'item4' }]

      const result = await mapItPipe(inputData)

      ok(inputData.length === result.length)
    })
  })
})
