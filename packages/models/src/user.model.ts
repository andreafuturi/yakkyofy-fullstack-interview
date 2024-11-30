import { Schema, model } from 'mongoose'

import { IUser } from '@interview/types/models/user'

const userSchema = new Schema<IUser>(
  {
    // TODO: define the user schema
  },
  { timestamps: true }
)

// 3. Create a Model.
export default model<IUser>('User', userSchema)
