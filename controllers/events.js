import { Event } from '../models/event.js'

function create(req, res) {
  req.body.owner = req.user.profile
  Event.create(req.body)
  .then(event => {
    Event.findById(event._id)
    .populate('owner')
    .then(populatedEvent => {
      res.json(populatedEvent)
    })
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
  console.log(req.body)
}
export {
  create
}