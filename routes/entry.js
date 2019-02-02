const 
  express = require('express'),
  router = express.Router(),
  controllers = require('../controllers')

router.get('/', controllers.entry.read)
router.delete('/:entryId', controllers.entry.delete)
router.get('/:entryId', controllers.entry.filter)



module.exports = router;