/*
 |-----------------------------------
 |  Dependencies
 |-----------------------------------
 */

const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const Event = require('./models/Event');
const Rsvp = require('./models/Rsvp');

/*
  |----------------------------------
  |  Authentication Middleware
  |----------------------------------
  */

module.exports = function (app, config) {
  // Authentication middleware
  const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${config.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    audience: config.AUTH0_API_AUDIENCE,
    issuer: `https://${config.AUTH0_DOMAIN}/`,
    algorithm: 'RS256'
  });

  // check for an authenticated admin user
  const adminCheck = (req, res, next) => {
    const roles = req.user[config.NAMESPACE] || [];
    if (roles.indexOf('admin') > -1) {
      next();
    }
    else {
      res.status(401)
        .send({
          message: 'Not authorized for admin access'
        });
    }
  }

  /*
  |--------------------------------------
  | API Routes
  |--------------------------------------
  */

  const _eventListProjection = 'title startDatetime endDatetime viewPublic';

  // GET API root
  app.get('/api/', (req, res) => {
    res.send('API works');
  });

  // GET list of public events starting in the future

  app.get('/api/events', (req, res) => {
    Event.find({
      viewPublic: true,
      startDatetime: {
        $gte: new Date()
      }
    }, _eventListProjection, (err, events) => {
      let eventsArr = [];
      if (err) {
        return res.status(500)
          .send({
            message: err.message
          });
      }
      if (events) {
        events.forEach(event => {
          eventsArr.push(event);
        })
      }
      res.send(eventsArr);
    })
  })

  // GET lsit of all events, public and private (admin only)
  app.get('/api/events/admin', jwtCheck, adminCheck, (req, res) => {
    Event.find({}, _eventListProjection, (err, events) => {
      let eventsArr = [];
      if (err) {
        return res.status(500)
          .send({
            message: err.message
          });
      }
      if (events) {
        events.forEach(event => {
          eventsArr.push(event);
        })
      }
      res.send(eventsArr);
    })
  })

  // GET event detail by event ID
  app.get('/api/event/:id', jwtCheck, (req, res) => {
    Event.findById(req.params.id, (err, event) => {
      if (err) {
        return res.status(500)
          .send({
            message: err.message
          });
      }
      if (!event) {
        return res.status(400)
          .send({
            message: 'Event not found.'
          });
      }
      res.send(event);
    })
  })

  // GET RSVPs by event ID
  app.get('/api/event/:eventId/rsvps', jwtCheck, (req, res) => {
    Rsvp.find({
      eventId: req.params.eventId
    }, (err, rsvps) => {
      let resvpsArr = [];
      if (err) {
        return res.status(500)
          .send({
            message: err.message
          });
      }
      if (rsvps) {
        rsvps.forEach(rsvp => {
          resvpsArr.push(rsvp);
        })
      }
      res.send(resvpsArr);
    })
  })

  // POST a newe RSVP
  app.post('/api/rsvp/new', jwtCheck, (req, res) => {
    Rsvp.findOne({
      eventId: req.body.eventId,
      userid: req.body.userId
    }, (err, existingRsvp) => {
      if (err) {
        return res.status(500)
          .send({ message: err.message })
      }
      if (existingRsvp) {
        return res.status(409)
          .send({ message: 'You have already RSVPed to this event.' })
      }

      const rsvp = new Rsvp({
        userId: req.body.userId,
        name: req.body.name,
        eventId: req.body.eventId,
        attending: req.body.attending,
        guests: req.body.guests,
        comments: req.body.comments
      });
      rsvp.save((err) => {
        if (err) {
          return res.status(500)
            .send({ message: err.message })
        }
        res.send(rsvp);
      })
    })
  })

  //PUT (edit) an existing RSVP
  app.put('/api/rsvp/:id', jwtCheck, (req, res) => {
    Rsvp.findById(req.params.id, (err, rsvp) => {
      if (err) {
        return res.status(500)
          .send({ message: err.message })
      }
      if (!rsvp) {
        return res.status(404)
          .send({ message: 'RSVP not found' })
      }
      if (rsvp.userId !== req.user.sub) {
        return res.status(401)
          .send({ message: 'You cannot edit someone else\' RSVP' })
      }
      rsvp.name = req.body.name;
      rsvp.attending = req.body.attending;
      rsvp.guests = req.body.guests;
      rsvp.comments = req.body.comments;

      rsvp.save(err => {
        if (err) {
          return res.status(500)
            .send({ message: err.message })
        }
        res.send(rsvp);
      })
    })
  })

};
