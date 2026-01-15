import prisma from '../db.js'

export const getOneUpdate = async (req, res, next) => {
  try {
    const update = await prisma.update.findFirst({
      where: {
        id: req.params.id,
        product: {
          belongsToid: req.user.id
        }
      },
      include: {
        product: true
      }
    })

    if (!update) {
      res.status(404)
      res.json({message: 'Update not found'})
      return
    }

    res.json({data: update})
  } catch (e) {
    next(e)
  }
}
export const getUpdates = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        belongsToid: req.user.id
      },
      include: {
        updates: true
      }
    })
    const updates = products.reduce((allUpdates, product) => {
      return [...allUpdates, ...product.updates]
    }, [])
    res.json({data: updates})
  } catch (e) {
    next(e)
  }
}
export const createUpdate = async (req, res, next) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: req.body.productId,
        belongsToid: req.user.id
      }
    })

    if (!product) {
      res.status(404)
      res.json({message: 'Product not found'})
      return
    }

    const update = await prisma.update.create({
      data: {
        title: req.body.title,
        body: req.body.body,
        product: {connect: {id: product.id}}
      }
    })

    res.json({data: update})
  } catch (e) {
    next(e)
  }
}
export const updateUpdate = async (req, res, next) => {
  try {
    const updateUpdate = await prisma.update.update({
      where: {
        id: req.params.id,
        product: {
          belongsToid: req.user.id
        }
      },
      data: req.body
    })

    res.json({data: updateUpdate})
  } catch (e) {
    if (e.code === 'P2025') {
      res.status(404)
      res.json({message: 'Update not found'})
      return
    }
    next(e)
  }
}
export const deleteUpdate = async (req, res, next) => {
  try {
    const deleted = await prisma.update.delete({
      where: {
        id: req.params.id,
        product: {
          belongsToid: req.user.id
        }
      }
    })
    res.json({data: deleted})
  } catch (e) {
    if (e.code === 'P2025') {
      res.status(404)
      res.json({message: 'Update not found'})
      return
    }
    next(e)
  }
}