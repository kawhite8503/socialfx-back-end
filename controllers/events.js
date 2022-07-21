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
      .populate('guestList')
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

function addActOrItem(req, res) {
  req.body.owner = req.user.profile._id
  Event.findById(req.params.id)
  .then(event=> {
    event[req.params.resource].push(req.body)
    event.save()
    .then(updatedEvent => {
      updatedEvent.populate([
        {path:'owner'},
        {path:'activities',
          populate:{path: 'supplier'}}
      ])
      .then(populatedEvent => {
        res.json(populatedEvent)
      })
    })
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
}

function show(req, res){
  Event.findById(req.params.id)
  .populate([
    {path:'owner'},
    {path:'guestList'},
    {path:'comments',
      populate:{path: 'author'}}
    ])
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
  req.body.author = req.user.profile
  Event.findById(req.params.id)
  .then(event=> {
    event.comments.push(req.body)
    event.save()
    .then(upEvent => {
      upEvent.populate([
        {path:'owner'},
        {path:'comments',
          populate:{path: 'author'}}
      ])
      .then(popEvent => {
        res.json(popEvent)
      })
    })
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
}

// function createAddItem(req, res) {
//   req.body.owner = req.user.profile._id
//   Event.findByIdAndUpdate(req.params.id, req.body.items)
//   .then(event=> {
//     event.items.push(req.body)
//     event.save()
//     .then(eventItem => {
//       res.json(eventItem)
//     })
//   })
//   .catch(err => {
//     console.log(err)
//     res.status(500).json({err: err.errmsg})
//   })
// }

// function createAddAct(req, res) {
//   req.body.owner = req.user.profile._id
//   Event.findByIdAndUpdate(req.params.id, req.body.activities)
//   .then(event=> {
//     event.activities.push(req.body)
//     event.save()
//     .then(eventAct => {
//       res.json(eventAct)
//     })
//   })
//   .catch(err => {
//     console.log(err)
//     res.status(500).json({err: err.errmsg})
//   })
// }

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
  .populate([
    {path:'owner'},
    {path:'comments',
      populate:{path: 'author'}}
  ])
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

function deleteComment(req, res) {
  Event.findById(req.params.id)
  .populate([
    {path:'owner'},
    {path:'comments',
      populate:{path: 'author'}}
  ])
  .then(event => {
    const comment = event.comments.id(req.params.commentId)
    if (comment.author._id.equals(req.user.profile)) {
    event.comments.remove({_id: req.params.commentId})
    event.save()
    .then(savedEvent => {
      res.json(savedEvent)
    })
  } else {
    res.status(401).json({err:"Not Auth!"})
  }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
}

function deleteActivity(req, res) {
  Event.findById(req.params.id)
  .populate([
    {path:'owner'},
    {path:'activities',
      populate:{path: 'supplier'}}
  ])
  .then(event => {
      event.activities.remove({_id: req.params.activityId})
      event.save()
    .then(savedEvent => {
      res.json(savedEvent)
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
      event.items.remove(req.params.itemId) 
      event.save()
      .then(savedEvent => {
        res.json(savedEvent)
      })
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
  // createAddItem,
  // createAddAct,
  createItem,
  deleteItem,
  deleteEvent as delete,
  getAllComments,
  edit,
  deleteComment,
  addActOrItem,
  deleteActivity,
}