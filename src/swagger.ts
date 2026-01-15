import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Enterprise Maintenance Management API',
    version: '1.0.0',
    description:
      'Industrial asset lifecycle management API for tracking assets, maintenance records, and checklist tasks.',
  },
  servers: [
    {
      url: '/',
      description: 'Root for login/register',
    },
    {
      url: '/api',
      description: 'API base path for protected routes',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Asset: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', description: 'Asset name' },
          description: { type: 'string', description: 'Detailed description of the asset' },
          type: { type: 'string', description: 'Type of asset (e.g., machine, vehicle, building)' },
          serialNumber: { type: 'string', description: 'Serial number or asset tag' },
          location: { type: 'string', description: 'Physical location of the asset' },
          manufacturer: { type: 'string', description: 'Manufacturer of the asset' },
          model: { type: 'string', description: 'Model of the asset' },
          purchaseDate: { type: 'string', format: 'date', description: 'Date of purchase' },
          warrantyExpiration: { type: 'string', format: 'date', description: 'Warranty expiration date' },
          status: { type: 'string', enum: ['active', 'retired', 'under_maintenance'], description: 'Current status of the asset' },
          assignedTo: { type: 'string', description: 'User or department responsible for the asset' },
          value: { type: 'number', format: 'float', description: 'Asset value or cost' },
          belongsToId: { type: 'string', format: 'uuid', description: 'Parent asset or group (if any)' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      MaintenanceRecord: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string', description: 'Short description of the maintenance task' },
          body: { type: 'string', description: 'Detailed description or notes' },
          assetId: { type: 'string', format: 'uuid', description: 'ID of the asset being maintained' },
          status: {
            type: 'string',
            enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'EMERGENCY_REPAIR'],
            description: 'Status of the maintenance task'
          },
          version: { type: 'string', nullable: true, description: 'Version or revision of the record' },
          scheduledDate: { type: 'string', format: 'date-time', description: 'When the maintenance is planned' },
          completedDate: { type: 'string', format: 'date-time', description: 'When the maintenance was completed' },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], description: 'Priority level' },
          assignedTo: { type: 'string', description: 'User or team responsible' },
          cost: { type: 'number', format: 'float', description: 'Estimated or actual cost' },
          attachments: { type: 'array', items: { type: 'string', format: 'uri' }, description: 'Links to documents or files' },
          createdBy: { type: 'string', description: 'User who created the record' },
          updatedBy: { type: 'string', description: 'User who last updated the record' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ChecklistTask: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' },
          maintenanceRecordId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/user': {
      post: {
        summary: 'Register a new user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string', format: 'password' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'JWT token for the new user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { token: { type: 'string' } }
                }
              }
            }
          }
        }
      }
    },
    '/signin': {
      post: {
        summary: 'Login and get JWT token',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string', format: 'password' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'JWT token for the user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { token: { type: 'string' } }
                }
              }
            }
          },
          401: {
            description: 'Invalid username or password',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } }
                }
              }
            }
          }
        }
      }
    },
    '/asset': {
      get: {
        summary: 'List assets',
        tags: ['Assets'],
        responses: { 200: { description: 'List of assets' } },
      },
      post: {
        summary: 'Create asset',
        tags: ['Assets'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Asset'
              }
            }
          }
        },
        responses: { 200: { description: 'Asset created' } },
      },
    },
    '/asset/{id}': {
      get: {
        summary: 'Get asset by id',
        tags: ['Assets'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Asset details' } },
      },
      put: {
        summary: 'Update asset',
        tags: ['Assets'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', properties: { name: { type: 'string' } } },
            },
          },
        },
        responses: { 200: { description: 'Asset updated' } },
      },
      delete: {
        summary: 'Delete asset',
        tags: ['Assets'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Asset deleted' } },
      },
    },
    '/maintenance': {
      get: {
        summary: 'List maintenance records',
        tags: ['Maintenance'],
        responses: { 200: { description: 'List of maintenance records' } },
      },
      post: {
        summary: 'Create maintenance record',
        tags: ['Maintenance'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MaintenanceRecord'
              }
            }
          }
        },
        responses: { 200: { description: 'Maintenance record created' } },
      },
    },
    '/maintenance/{id}': {
      get: {
        summary: 'Get maintenance record by id',
        tags: ['Maintenance'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Maintenance record details' } },
      },
      put: {
        summary: 'Update maintenance record',
        tags: ['Maintenance'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  body: { type: 'string' },
                  status: { type: 'string' },
                  version: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Maintenance record updated' } },
      },
      delete: {
        summary: 'Delete maintenance record',
        tags: ['Maintenance'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Maintenance record deleted' } },
      },
    },
    '/task': {
      get: {
        summary: 'List checklist tasks',
        tags: ['ChecklistTasks'],
        responses: { 200: { description: 'List of checklist tasks' } },
      },
      post: {
        summary: 'Create checklist task',
        tags: ['ChecklistTasks'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'description', 'maintenanceRecordId'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  maintenanceRecordId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Checklist task created' } },
      },
    },
    '/task/{id}': {
      get: {
        summary: 'Get checklist task by id',
        tags: ['ChecklistTasks'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Checklist task details' } },
      },
      put: {
        summary: 'Update checklist task',
        tags: ['ChecklistTasks'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Checklist task updated' } },
      },
      delete: {
        summary: 'Delete checklist task',
        tags: ['ChecklistTasks'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Checklist task deleted' } },
      },
    },
  },
}

const options = {
  definition: swaggerDefinition,
  apis: [],
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec
