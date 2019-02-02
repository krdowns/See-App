const 
  express = require('express'),
  router = express.Router(),
  controllers = require('../controllers')

router.get('/', controllers.user.read)
router.get('/:userId', controllers.user.readOne)
router.get('/:userId/entries', controllers.user.entries)
router.get('/history/:userId', controllers.user.getUserHistory)
router.post('/signup', controllers.user.signup)
router.post('/login', controllers.user.login)
router.delete('/:userId', controllers.user.delete)
router.get('/:userId/contacts', controllers.user.contacts)




module.exports = router;