import { Request, Response } from 'express'

import { IUser } from '@interview/types/models/user'
import Joi from 'joi'
import { User } from '@interview/models'
import config from '../config'

const login = async (req: Request, res: Response) => {
  res.sendStatus(200)
}

const signup = async (req: Request, res: Response) => {
  res.sendStatus(200)
}

const refresh = async (req: Request, res: Response) => {
  res.sendStatus(200)
}

// TODO: ... more?

// this one should be protected
const getUser = async (req: Request, res: Response) => {
  res.sendStatus(200)
}

export default {
  login,
  signup
}
