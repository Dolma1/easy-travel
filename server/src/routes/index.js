import {Router} from 'express'
import userRouter from './userRoutes.js'
import journalRouter from './journalRoutes.js'
import travelGroupRouter from './travelgroupRoutes.js'
import expenseRouter from './expenseRoutes.js'
const router = Router()

// * ROUTES FOR THE USER 
router.use('/api/v1/user',userRouter)

// * ROUTES FOR THE JOURNAL
router.use('/api/v1/journal',journalRouter)

// * ROUTES FOR THE TRAVEL GROUP
router.use('/api/v1/group', travelGroupRouter)

// * ROUTES FOR THE Expenses
router.use('/api/v1/expense', expenseRouter)

// * ROUTES FOR THE SETTLEMENT

// * ROUTES FOR THE NOTIFICATION



export default router