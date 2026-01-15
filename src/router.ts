import {Router} from 'express'
import { body } from 'express-validator'
import { handleInputErrors } from './modules/middleware.js'
// GridOps Handlers - Industrial Asset Management
import { getAssets, getOneAsset, createAsset, deleteAsset, updateAsset } from './handlers/asset.js'
import { getMaintenanceRecords, getOneMaintenanceRecord, updateMaintenanceRecord, deleteMaintenanceRecord, createMaintenanceRecord } from './handlers/maintenance.js'
import { getChecklistTasks, getOneChecklistTask, createChecklistTask, updateChecklistTask, deleteChecklistTask } from './handlers/task.js'

const router = Router()

/**
 * ASSET ROUTES
 * Manage physical electrical equipment (generators, transformers, panels)
 */
router.get('/asset', getAssets)

router.get('/asset/:id', getOneAsset)

router.put('/asset/:id',
	body('name').isString(), 
	handleInputErrors, 
	updateAsset)

router.post('/asset', 
	body('name').isString(), 
	handleInputErrors, 
	createAsset)

router.delete('/asset/:id', deleteAsset)

/**
 * MAINTENANCE RECORD ROUTES
 * Track service events, inspections, and repairs
 * Status workflow: SCHEDULED → IN_PROGRESS → COMPLETED (or EMERGENCY_REPAIR)
 */
router.get('/maintenance', getMaintenanceRecords)

router.get('/maintenance/:id', getOneMaintenanceRecord)

router.put('/maintenance/:id',
	body('title').optional().isString(),
	body('body').optional().isString(),
	body('status').isIn(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'EMERGENCY_REPAIR']).optional(),
	body('version').optional().isString(),
	handleInputErrors,
	updateMaintenanceRecord)

router.post('/maintenance',
	body('title').exists().isString(),
	body('body').exists().isString(),
	body('assetId').exists().isString(),  // Changed from productId to assetId
	handleInputErrors,
	createMaintenanceRecord)

router.delete('/maintenance/:id', deleteMaintenanceRecord)

/**
 * CHECKLIST TASK ROUTES
 * Granular maintenance tasks completed during service records
 * Examples: "Voltage Output Checked", "Oil Pressure Test"
 */
router.get('/task', getChecklistTasks)

router.get('/task/:id', getOneChecklistTask)

router.put('/task/:id', 
	body('name').optional().isString().isLength({ max: 255 }),
	body('description').optional().isString(),
	handleInputErrors,
	updateChecklistTask)

router.post('/task', 
	body('name').exists().isString().isLength({ max: 255 }),
	body('description').exists().isString(),
	body('maintenanceRecordId').exists().isString(),  // Changed from updateId
	handleInputErrors,
	createChecklistTask)

router.delete('/task/:id', deleteChecklistTask)

export default router



