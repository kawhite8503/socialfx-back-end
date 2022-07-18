import { Router } from 'express'
import * as eventsCtrl from '../controllers/events.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

/*---------- Public Routes ----------*/


/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)

router.post('/', checkAuth, eventsCtrl.create)
router.get('/', checkAuth, eventsCtrl.index)
// router.post('/:id/details',checkAuth, eventsCtrl.createDetails)
router.get('/:id',eventsCtrl.show)
router.put('/:id/add-photo', checkAuth, eventsCtrl.addPhoto)
router.post('/:id/comments', checkAuth, eventsCtrl.createComment)
router.put('/:id', checkAuth,eventsCtrl.update)
export { router }
