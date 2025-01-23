import {Router} from 'express'
import userRouter from './userRoutes.js'
import journalRouter from './journalRoutes.js'
const router = Router()

// * ROUTES FOR THE USER 
router.use('/api/v1/user',userRouter)

// * ROUTES FOR THE JOURNAL
router.use('/api/v1/journal',journalRouter)

// * ROUTES FOR THE TRAVEL GROUP

// * ROUTES FOR THE Expenses

// * ROUTES FOR THE SETTLEMENT

// * ROUTES FOR THE NOTIFICATION



export default router