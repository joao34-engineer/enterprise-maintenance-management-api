import prisma from '../db.js'

/**
 * Asset Handler - GridOps Industrial Asset Management
 * Manages CRUD operations for physical electrical equipment (generators, transformers, panels)
 */

// Get all assets for the authenticated user
export const getAssets = async (req, res, next) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.user.id
			},
			include: {
				assets: true  // Get all industrial equipment owned by this user
			}
		})

		if (!user) {
			res.status(404)
			res.json({message: 'User not found'})
			return
		}

		res.json({data: user.assets})
	} catch (e) {
		next(e)
	}
}

// Get one specific asset by ID
export const getOneAsset = async (req, res, next) => {
	try {
		const id = req.params.id

		const asset = await prisma.asset.findFirst({
			where:{
				id,
				belongsToId: req.user.id  // Fixed typo: belongsToid -> belongsToId
			}
		})

		if (!asset) {
			res.status(404)
			res.json({message: 'Asset not found'})
			return
		}

		res.json({data: asset})
	} catch (e) {
		next(e)
	}
}

// Create a new asset (equipment registration)
export const createAsset = async (req, res, next) => {
	try{
		const asset = await prisma.asset.create({
		data: {
			name: req.body.name,  // Equipment ID (e.g., "Turbine-TR-505")
			belongsToId: req.user.id  // Fixed typo: belongsToid -> belongsToId
		}

	})
	res.json({data: asset})
	} catch (e){
		next(e)
	}
			
}

// Update an existing asset
export const updateAsset = async (req, res, next) => {
	try {
		const updated = await prisma.asset.update({
			where: {
				id_belongsToId: {  // Fixed typo: belongsToid -> belongsToId
					id: req.params.id,
					belongsToId: req.user.id
				}
			},
			data: {
				name: req.body.name
			}
		})

		res.json({data: updated})
	} catch (e) {
		if (e.code === 'P2025') {
			res.status(404)
			res.json({message: 'Asset not found'})
			return
		}
		next(e)
	}
}

// Delete an asset
export const deleteAsset = async (req, res, next) => {
	try {
		const deleted = await prisma.asset.delete({
			where: {
				id_belongsToId: {  // Fixed typo: belongsToid -> belongsToId
					id: req.params.id,
					belongsToId: req.user.id
				}
			}
		})

		res.json({data: deleted})
	} catch (e) {
		if (e.code === 'P2025') {
			res.status(404)
			res.json({message: 'Asset not found'})
			return
		}
		next(e)
	}
}
