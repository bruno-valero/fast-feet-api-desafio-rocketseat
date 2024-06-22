import { ValueObject } from '@/core/entities/value-objects'
import z from 'zod'

// eslint-disable-next-line
export const coordinatesInstanceSchema = z.custom<Coordinates>(
  (data) => data instanceof Coordinates,
  'must be a valide Coordinates',
)

export const latitudeSchema = z.coerce
  .number()
  .refine((lat) => Math.abs(lat) <= 90, 'latitude must be between -90 and 90')

export const longitudeSchema = z.coerce
  .number()
  .refine(
    (lat) => Math.abs(lat) <= 180,
    'longitude must be between -180 and 180',
  )

export const coordinatesSchema = z.object({
  latitude: latitudeSchema,
  longitude: longitudeSchema,
})

export type CoordinatesProps = z.infer<typeof coordinatesSchema>

export class Coordinates extends ValueObject<CoordinatesProps> {
  constructor(props: CoordinatesProps) {
    const validatedProps = coordinatesSchema.parse(props)

    super(validatedProps)
  }

  get latitude() {
    return this.props.latitude
  }

  get longitude() {
    return this.props.longitude
  }

  get raw() {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
    }
  }

  getDistance(coords: Coordinates, scale: 'meter' | 'km' = 'km') {
    const coordinates = coordinatesSchema.parse(coords)

    const from = this.props
    const to = coordinates

    if (from.latitude === to.latitude && from.longitude === to.longitude) {
      return 0
    }

    const fromRadian = (Math.PI * from.latitude) / 180
    const toRadian = (Math.PI * to.latitude) / 180

    const theta = from.longitude - to.longitude
    const radTheta = (Math.PI * theta) / 180

    let dist =
      Math.sin(fromRadian) * Math.sin(toRadian) +
      Math.cos(fromRadian) * Math.cos(toRadian) * Math.cos(radTheta)

    if (dist > 1) {
      dist = 1
    }

    dist = Math.acos(dist)
    dist = (dist * 180) / Math.PI
    dist = dist * 60 * 1.1515
    dist = dist * 1.609344

    return scale === 'km' ? dist : dist * 1000
  }
}
