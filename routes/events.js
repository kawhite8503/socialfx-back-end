import { Router } from 'express'
import * as eventsCtrl from '../controllers/events.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

/*---------- Public Routes ----------*/


/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)

router.get('/', checkAuth, eventsCtrl.index)
router.get('/:id/comments', checkAuth, eventsCtrl.getAllComments)
router.get('/:id',eventsCtrl.show)

router.post('/', checkAuth, eventsCtrl.create)
router.post('/:id/comments', checkAuth, eventsCtrl.createComment)
router.post('/:id/add-item', checkAuth, eventsCtrl.createItem)
router.post('/:id/:resource',checkAuth, eventsCtrl.addActOrItem)

router.put('/:id/add-photo', checkAuth, eventsCtrl.addPhoto)
router.put('/:id', checkAuth, eventsCtrl.update)

router.delete('/:id/deleteItem', checkAuth, eventsCtrl.deleteItem)
router.delete('/:id', checkAuth, eventsCtrl.delete)
router.delete('/:id/comments/:commentId', checkAuth, eventsCtrl.deleteComment)


export { router }
