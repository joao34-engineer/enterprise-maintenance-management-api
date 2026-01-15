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
      url: '/api',
      description: 'Default API base path',
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
          name: { type: 'string' },
          belongsToId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      MaintenanceRecord: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          body: { type: 'string' },
          status: {
            type: 'string',
            enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'EMERGENCY_REPAIR'],
          },
          version: { type: 'string', nullable: true },
          assetId: { type: 'string', format: 'uuid' },
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
                type: 'object',
                required: ['name'],
                properties: { name: { type: 'string' } },
              },
            },
          },
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
                type: 'object',
                required: ['title', 'body', 'assetId'],
                properties: {
                  title: { type: 'string' },
                  body: { type: 'string' },
                  assetId: { type: 'string' },
                  status: { type: 'string' },
                  version: { type: 'string' },
                },
              },
            },
          },
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
