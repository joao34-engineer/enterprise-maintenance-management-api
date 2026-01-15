import prisma from './db';

async function main() {

  // Create a user
  const uniqueUsername = `seeduser_${Date.now()}`;
  const user = await prisma.user.create({
    data: {
      username: uniqueUsername,
      password: 'seedpassword', // In production, hash this!
    },
  });

  // Create an asset belonging to the user (only fields in schema)
  const asset = await prisma.asset.create({
    data: {
      name: 'Test Motor',
      description: 'Main production motor',
      type: 'machine',
      serialNumber: 'SN-12345',
      location: 'Plant 1',
      manufacturer: 'Siemens',
      model: 'X200',
      purchaseDate: new Date('2022-01-15'),
      warrantyExpiration: new Date('2027-01-15'),
      status: 'active',
      assignedTo: 'maintenance_team',
      value: 15000.00,
      belongsToId: user.id,
    },
  });

  // Create a maintenance record for the asset (only fields in schema)
  const maintenance = await prisma.maintenanceRecord.create({
    data: {
      title: 'Quarterly Inspection',
      body: 'Routine quarterly inspection and lubrication.',
      status: 'SCHEDULED',
      version: '1.0',
      assetId: asset.id,
    },
  });

  // Create a checklist task for the maintenance record
  await prisma.checklistTask.create({
    data: {
      name: 'Lubricate bearings',
      description: 'Apply grease to all bearings as per manual.',
      maintenanceRecordId: maintenance.id,
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
