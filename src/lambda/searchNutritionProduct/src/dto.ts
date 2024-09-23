import { Transform, Readable, Writable } from 'stream'
import { pipeline } from 'stream/promises'
import { logger} from './logging'
import { NutritionProduct } from './types'
import { get } from 'lodash'

const parallelTransform = new Transform({
  objectMode: true,
  async transform(chunk, encoding, callback) {
    const nutritionProduct: Partial<NutritionProduct> = {
      resourceType: "NutritionProduct",
      id: get(chunk, 'id', ''),
    }

    logger.info('Parallel Transformation', { data: { nutritionProduct } })

    callback(null, nutritionProduct)
  }
})

export const mapItPipe = async (data: Record<string, any>[]): Promise<any> => {
  const result: any[] = []

  const writable = new Writable({
    objectMode: true,
    write(chunk, encoding, callback) {
      result.push(chunk)
      callback()
    }
  })

  await pipeline(
    Readable.from(data),
    parallelTransform,
    writable
  )

  logger.info('MapItPipe Result', { data: { result } })

  return result
}
