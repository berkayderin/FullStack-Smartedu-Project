const mongoose = require('mongoose')
const Schema = mongoose.Schema
const slugify = require('slugify')

const CourseSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true,
		trim: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	slug: {
		type: String,
		required: true,
		unique: true
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
		required: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
})

CourseSchema.pre('validate', function (next) {
	this.slug = slugify(this.name, {
		lower: true,
		strict: true
	})
	next()
})

const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema)

module.exports = Course
