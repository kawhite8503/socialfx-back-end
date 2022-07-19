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

function update(req, res) {
  Event.findById(req.params.id)
  .then(event => {
    if (event.owner._id.equals(req.user.profile)){
      Event.findByIdAndUpdate(req.params.id, req.body, {new: true})
      .populate('owner')
      .then(updatedEvent => {
        res.json(updatedEvent)
      })
    } else {
      res.status(401).json({err: "Not authorized"})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
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
      cloudinary.uploader.upload(imageFile, {tags: `${event.eventName}`})
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

function createComment(req, res) {
  req.body.owner = req.user.profile._id
  Event.findByIdAndUpdate(req.params.id, req.body.comments, {new: true})
  .then(event=> {
    event.comments.push(req.body)
    event.save()
    .then(eventComment => {
      res.json(eventComment)
    })
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
}

function createAddItem(req, res) {
  req.body.owner = req.user.profile._id
  Event.findByIdAndUpdate(req.params.id, req.body.items)
  .then(event=> {
    event.items.push(req.body)
    event.save()
    .then(eventItem => {
      res.json(eventItem)
    })
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
}

function createAddAct(req, res) {
  req.body.owner = req.user.profile._id
  Event.findByIdAndUpdate(req.params.id, req.body.activities)
  .then(event=> {
    event.activities.push(req.body)
    event.save()
    .then(eventAct => {
      res.json(eventAct)
    })
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
}

function createItem(req, res) {
  req.body.owner = req.user.profile._id
  Event.findById(req.params.id)
  .then(event => {
    event.items.push(req.body)
    event.save()
    .then(item => {
      res.json(item)
    })
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
}

function deleteItem(req, res) {
  Event.findById(req.params.id)
  .then(event => {
    if (event.owner._id.equals(req.user.profile)){
      event.items.remove(req.params.itemId)  //id may not be correct (._id) or (.id)
      event.save()
      .then(deletedItem => {
        res.json(deletedItem)
      })
    } else {
      res.status(401).json({err: "Not authorized"})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
}

function deleteEvent(req,res) {
  Event.findByIdAndDelete(req.params.id)
  .then(deletedEvent => {
    res.json(deletedEvent)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
}

function getAllComments(req, res) {
  Event.findById(red.params.id)
  .populate('owner')
  .then(event => {
    Comment.findById(req.params.commentId)
    .then(comment => {
      res.json(eventComment)
    })
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
}

function edit(req,res){
  Event.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .populate('owner')
  .then(editedEvent => {
    res.json(editedEvent)
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
  createComment,
  update,
  createAddItem,
  createAddAct,
  createItem,
  deleteItem,
  deleteEvent as delete,
  getAllComments,
  edit,
}