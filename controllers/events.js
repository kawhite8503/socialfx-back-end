import { Event } from '../models/event.js'
import { v2 as cloudinary } from 'cloudinary'



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

function addPhoto(req,res) {
  console.log(req.files)
  const imageFile = req.files.photo.path
  Event.findById(req.params.id)
    .then(event => {
      cloudinary.uploader.upload(imageFile, {tags: `${event.name}`})
      .then(image => {
        console.log(image)
        event.photo = image.url
        event.save()
        .then(event => {
          res.status(201).json(event.photo)
        })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json(err)
      })
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
  index,
  addPhoto,
}