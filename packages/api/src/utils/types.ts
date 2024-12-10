export type Primitive = string | number | boolean | Date | undefined

export type Serializable = Primitive | { [x: string]: Serializable } | Serializable[] | object
