import prisma from '../db.js'

/**
 * Maintenance Handler - GridOps Industrial Asset Management
 * Manages CRUD operations for maintenance records (service events and inspections)
 * 
 * MaintenanceRecord fields:
 * - title: Service Type (e.g., "Annual Safety Inspection")
 * - body: Technician Notes
 * - status: SCHEDULED, IN_PROGRESS, COMPLETED, EMERGENCY_REPAIR
 * - version: Firmware Version (if applicable)
 */

// Get one specific maintenance record by ID
export const getOneMaintenanceRecord = async (req, res, next) => {
  try {
    const record = await prisma.maintenanceRecord.findFirst({
      where: {
        id: req.params.id,
        assetRecord: {  // Changed from product to assetRecord
          belongsToId: req.user.id  // Fixed typo: belongsToid -> belongsToId
        }
      },
      include: {
        assetRecord: true  // Changed from product to assetRecord
      }
    })

    if (!record) {
      res.status(404)
      res.json({message: 'Maintenance record not found'})
      return
    }

    res.json({data: record})
  } catch (e) {
    next(e)
  }
}

// Get all maintenance records for the authenticated user
export const getMaintenanceRecords = async (req, res, next) => {
  try {
    const assets = await prisma.asset.findMany({  // Changed from product to asset
      where: {
        belongsToId: req.user.id  // Fixed typo: belongsToid -> belongsToId
      },
      include: {
        maintenanceRecords: true  // Changed from updates to maintenanceRecords
      }
    })
    
    // Flatten all maintenance records from all assets
    const records = assets.reduce((allRecords, asset) => {
      return [...allRecords, ...asset.maintenanceRecords]
    }, [])
    
    res.json({data: records})
  } catch (e) {
    next(e)
  }
}

// Create a new maintenance record for an asset
export const createMaintenanceRecord = async (req, res, next) => {
  try {
    // Verify asset exists and belongs to user
    const asset = await prisma.asset.findFirst({  // Changed from product to asset
      where: {
        id: req.body.assetId,  // Changed from productId to assetId
        belongsToId: req.user.id  // Fixed typo: belongsToid -> belongsToId
      }
    })

    if (!asset) {
      res.status(404)
      res.json({message: 'Asset not found'})
      return
    }

    // Create maintenance record
    const record = await prisma.maintenanceRecord.create({  // Changed from update to maintenanceRecord
      data: {
        title: req.body.title,  // Service Type
        body: req.body.body,    // Technician Notes
        assetRecord: {connect: {id: asset.id}}  // Changed from product to assetRecord
      }
    })

    res.json({data: record})
  } catch (e) {
    next(e)
  }
}

// Update an existing maintenance record
export const updateMaintenanceRecord = async (req, res, next) => {
  try {
    const updated = await prisma.maintenanceRecord.update({  // Changed from update to maintenanceRecord
      where: {
        id: req.params.id,
        assetRecord: {  // Changed from product to assetRecord
          belongsToId: req.user.id  // Fixed typo: belongsToid -> belongsToId
        }
      },
      data: req.body  // Can include: title, body, status, version
    })

    res.json({data: updated})
  } catch (e) {
    if (e.code === 'P2025') {
      res.status(404)
      res.json({message: 'Maintenance record not found'})
      return
    }
    next(e)
  }
}

// Delete a maintenance record
export const deleteMaintenanceRecord = async (req, res, next) => {
  try {
    const deleted = await prisma.maintenanceRecord.delete({  // Changed from update to maintenanceRecord
      where: {
        id: req.params.id,
        assetRecord: {  // Changed from product to assetRecord
          belongsToId: req.user.id  // Fixed typo: belongsToid -> belongsToId
        }
      }
    })
    
    res.json({data: deleted})
  } catch (e) {
    if (e.code === 'P2025') {
      res.status(404)
      res.json({message: 'Maintenance record not found'})
      return
    }
    next(e)
  }
}
