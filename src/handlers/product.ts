import prisma from '../db.js'


// Get all products
export const getProducts = async (req, res, next) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.user.id
			},
			include: {
				products: true
			}
		})

		if (!user) {
			res.status(404)
			res.json({message: 'User not found'})
			return
		}

		res.json({data: user.products})
	} catch (e) {
		next(e)
	}
}

// Get one 

export const getOneProduct = async (req, res, next) => {
	try {
		const id = req.params.id

		const product = await prisma.product.findFirst({
			where:{
				id,
				belongsToid: req.user.id
			}
		})

		if (!product) {
			res.status(404)
			res.json({message: 'Product not found'})
			return
		}

		res.json({data: product})
	} catch (e) {
		next(e)
	}
}

export const createProduct = async (req, res, next) => {
	try{
		const product = await prisma.product.create({
		data: {
			name: req.body.name,
			belongsToid: req.user.id			
		}

	})
	res.json({data: product})
	} catch (e){
		next(e)
	}
			
}

export const updateProduct = async (req, res, next) => {
	try {
		const update = await prisma.product.update({
			where: {
				id_belongsToid: {
					id: req.params.id,
					belongsToid: req.user.id
				}
			},
			data: {
				name: req.body.name
			}
		})

		res.json({data: update})
	} catch (e) {
		if (e.code === 'P2025') {
			res.status(404)
			res.json({message: 'Product not found'})
			return
		}
		next(e)
	}
}

export const deleteProduct = async (req, res, next) => {
	try {
		const deleted = await prisma.product.delete({
			where: {
				id_belongsToid: {
					id: req.params.id,
					belongsToid: req.user.id
				}
			}
		})

		res.json({data: deleted})
	} catch (e) {
		if (e.code === 'P2025') {
			res.status(404)
			res.json({message: 'Product not found'})
			return
		}
		next(e)
	}
}
