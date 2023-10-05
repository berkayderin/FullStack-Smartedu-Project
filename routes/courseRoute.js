const express = require('express')
const router = express.Router()

const courseController = require('../controllers/courseController')
const roleMiddleware = require('../middlewares/roleMiddleware')

router.post('/', roleMiddleware(['teacher', 'admin']), courseController.createCourse)

router.get('/', courseController.getAllCourses)
router.get('/:slug', courseController.getCourse)

router.post('/enroll', courseController.enrollCourse)
router.post('/release', courseController.releaseCourse)

module.exports = router
