const User = require('../models/User')
const Category = require('../models/Category')
const Course = require('../models/Course')

const bcrypt = require('bcrypt')

// auth
exports.createUser = async (req, res, next) => {
	try {
		const user = await User.create(req.body)
		res.status(201).redirect('/login')
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			error
		})
	}
}

exports.loginUser = async (req, res, next) => {
	try {
		const { email, password } = req.body

		const user = await User.findOne({ email })
		if (!user) {
			return res.status(400).json({
				status: 'fail',
				message: 'User not found'
			})
		}

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res.status(400).json({
				status: 'fail',
				message: 'Invalid credentials'
			})
		}

		req.session.userID = user._id

		res.status(200).redirect('/users/dashboard')
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			error
		})
	}
}

exports.logoutUser = async (req, res, next) => {
	try {
		req.session.destroy(() => {
			res.redirect('/')
		})
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			error
		})
	}
}

// dashboard
exports.getDashboardPage = async (req, res, next) => {
	const user = await User.findById({ _id: req.session.userID }).populate('courses')
	const categories = await Category.find()
	const courses = await Course.find({
		user: req.session.userID
	})

	res.status(200).render('dashboard', {
		page_name: 'dashboard',
		user,
		categories,
		courses
	})
}
