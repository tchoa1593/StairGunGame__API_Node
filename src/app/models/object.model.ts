import { Schema, model } from 'mongoose'
import { IObject } from '../typeModels'

const ObjectSchema = new Schema<IObject>(
    {
        name: { type: String, required: true },
        points: [{ x: Number, y: Number }],
        src: { type: String, required: true },
        canBeDestroyed: { type: Boolean, required: false },
    },
    {
        timestamps: true,
    },
)

export default model('objects', ObjectSchema)
