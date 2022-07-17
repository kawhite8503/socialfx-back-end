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
// function createDetails(req, res) {
//   Event.findById(req.params.id)
//     .then(event =>{
//       event.guestList.push(req.body)
//       event.activities.push(req.body)
//       event.items.push(req.body)
//       event.save()
//       .then(() => {
//         console.log(event.comments)
//         console.log(event.activities)
//         console.log(event.items)
//       })
//     })
//     .then(populatedEvent => {
//       res.json(populatedEvent)
//     })
//   })
// }
function show(req, res){
  Event.findById(req.params.id)
  .populate('owner')
  .then(event => {
    res.json(event)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
}

function index(req,res){
  Event.find({})
  .populate('owner')
  .then(events => {
    res.json(events)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
}

export {
  create,
  show,
  index
}