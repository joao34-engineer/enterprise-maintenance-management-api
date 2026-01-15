import prisma from '../db.js'

/**
 * ChecklistTask Handler - GridOps Industrial Asset Management
 * Manages granular maintenance checklist items completed during service records
 * 
 * ChecklistTask fields:
 * - name: Task Name (e.g., "Voltage Output Checked")
 * - description: Result (e.g., "Output stable at 240V")
 * - maintenanceRecordId: Parent service record
 */

// Get all checklist tasks for a specific maintenance record or all user's tasks
export const getChecklistTasks = async (req, res, next) => {
  try {
    // If maintenanceRecordId provided in query, filter by that record
    const maintenanceRecordId = req.query.maintenanceRecordId

    if (maintenanceRecordId) {
      // Get tasks for specific maintenance record, verify ownership
      const record = await prisma.maintenanceRecord.findFirst({
        where: {
          id: maintenanceRecordId as string,
          assetRecord: {
            belongsToId: req.user.id
          }
        },
        include: {
          checklistTasks: true
        }
      })

      if (!record) {
        res.status(404)
        res.json({message: 'Maintenance record not found'})
        return
      }

      res.json({data: record.checklistTasks})
    } else {
      // Get all tasks across all user's maintenance records
      const assets = await prisma.asset.findMany({
        where: {
          belongsToId: req.user.id
        },
        include: {
          maintenanceRecords: {
            include: {
              checklistTasks: true
            }
          }
        }
      })

      // Flatten all tasks from all maintenance records
      const tasks = assets.reduce((allTasks, asset) => {
        const recordTasks = asset.maintenanceRecords.reduce((tasks, record) => {
          return [...tasks, ...record.checklistTasks]
        }, [])
        return [...allTasks, ...recordTasks]
      }, [])

      res.json({data: tasks})
    }
  } catch (e) {
    next(e)
  }
}

// Get one specific checklist task by ID
export const getOneChecklistTask = async (req, res, next) => {
  try {
    const task = await prisma.checklistTask.findFirst({
      where: {
        id: req.params.id,
        maintenanceRecord: {
          assetRecord: {
            belongsToId: req.user.id
          }
        }
      },
      include: {
        maintenanceRecord: {
          include: {
            assetRecord: true
          }
        }
      }
    })

    if (!task) {
      res.status(404)
      res.json({message: 'Checklist task not found'})
      return
    }

    res.json({data: task})
  } catch (e) {
    next(e)
  }
}

// Create a new checklist task for a maintenance record
export const createChecklistTask = async (req, res, next) => {
  try {
    // Verify maintenance record exists and belongs to user's asset
    const record = await prisma.maintenanceRecord.findFirst({
      where: {
        id: req.body.maintenanceRecordId,
        assetRecord: {
          belongsToId: req.user.id
        }
      }
    })

    if (!record) {
      res.status(404)
      res.json({message: 'Maintenance record not found'})
      return
    }

    // Create checklist task
    const task = await prisma.checklistTask.create({
      data: {
        name: req.body.name,  // Task name (e.g., "Voltage Output Checked")
        description: req.body.description,  // Result (e.g., "Output stable at 240V")
        maintenanceRecord: {connect: {id: record.id}}
      }
    })

    res.json({data: task})
  } catch (e) {
    next(e)
  }
}

// Update an existing checklist task
export const updateChecklistTask = async (req, res, next) => {
  try {
    // Verify ownership through the relation chain
    const existing = await prisma.checklistTask.findFirst({
      where: {
        id: req.params.id,
        maintenanceRecord: {
          assetRecord: {
            belongsToId: req.user.id
          }
        }
      }
    })

    if (!existing) {
      res.status(404)
      res.json({message: 'Checklist task not found'})
      return
    }

    // Update the task
    const updated = await prisma.checklistTask.update({
      where: {
        id: req.params.id
      },
      data: {
        name: req.body.name,
        description: req.body.description
      }
    })

    res.json({data: updated})
  } catch (e) {
    if (e.code === 'P2025') {
      res.status(404)
      res.json({message: 'Checklist task not found'})
      return
    }
    next(e)
  }
}

// Delete a checklist task
export const deleteChecklistTask = async (req, res, next) => {
  try {
    // Verify ownership before deletion
    const existing = await prisma.checklistTask.findFirst({
      where: {
        id: req.params.id,
        maintenanceRecord: {
          assetRecord: {
            belongsToId: req.user.id
          }
        }
      }
    })

    if (!existing) {
      res.status(404)
      res.json({message: 'Checklist task not found'})
      return
    }

    // Delete the task
    const deleted = await prisma.checklistTask.delete({
      where: {
        id: req.params.id
      }
    })

    res.json({data: deleted})
  } catch (e) {
    if (e.code === 'P2025') {
      res.status(404)
      res.json({message: 'Checklist task not found'})
      return
    }
    next(e)
  }
}
