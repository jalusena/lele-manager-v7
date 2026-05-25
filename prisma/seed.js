const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  await prisma.expense.deleteMany()
  await prisma.harvest.deleteMany()
  await prisma.feed.deleteMany()
  await prisma.seed.deleteMany()
  await prisma.pond.deleteMany()
  await prisma.user.deleteMany()

  // Hash password demo
  const hashedPassword = await bcrypt.hash('demo1234', 12)

  const user = await prisma.user.create({
    data: { id: 'user-demo', name: 'Budi Santoso', email: 'budi@demo.com', password: hashedPassword },
  })

  const kolamA = await prisma.pond.create({
    data: { userId: user.id, name: 'Kolam A', type: 'Terpal', size: 48, startDate: new Date('2025-02-12'), status: 'active', notes: 'Kolam utama produksi' },
  })
  await prisma.seed.create({ data: { pondId: kolamA.id, totalSeed: 10000, seedWeight: 12, seedSize: '5-7 cm', seedOrigin: 'Pak Dwi', seedPrice: 1500000, seedDate: new Date('2025-02-12') } })
  await prisma.feed.createMany({ data: [
    { pondId: kolamA.id, feedName: 'Safir-2', feedWeight: 30, price: 370000, feedDate: new Date('2025-02-20') },
    { pondId: kolamA.id, feedName: 'Pf-1000', feedWeight: 50, price: 620000, feedDate: new Date('2025-03-10') },
    { pondId: kolamA.id, feedName: 'Safir-2', feedWeight: 60, price: 740000, feedDate: new Date('2025-04-05') },
  ]})
  await prisma.harvest.createMany({ data: [
    { pondId: kolamA.id, harvestNumber: 1, grossWeight: 220, refraction: 5, netWeight: 209, pricePerKg: 18300, totalPrice: 3824700, buyer: 'Pak Rahman', harvestDate: new Date('2025-04-15') },
    { pondId: kolamA.id, harvestNumber: 2, grossWeight: 120, refraction: 5, netWeight: 114, pricePerKg: 18300, totalPrice: 2086200, buyer: 'CV Maju Jaya', harvestDate: new Date('2025-05-17') },
  ]})
  await prisma.expense.createMany({ data: [
    { pondId: kolamA.id, category: 'listrik', expenseName: 'Listrik April', nominal: 180000, expenseDate: new Date('2025-04-30') },
    { pondId: kolamA.id, category: 'obat', expenseName: 'Obat + Vitamin', nominal: 95000, expenseDate: new Date('2025-03-15') },
  ]})

  const kolamB = await prisma.pond.create({
    data: { userId: user.id, name: 'Kolam B', type: 'Beton', size: 50, startDate: new Date('2025-03-20'), status: 'active' },
  })
  await prisma.seed.create({ data: { pondId: kolamB.id, totalSeed: 8000, seedWeight: 9.5, seedSize: '5-7 cm', seedOrigin: 'BPBAT', seedPrice: 1200000, seedDate: new Date('2025-03-20') } })
  await prisma.feed.createMany({ data: [
    { pondId: kolamB.id, feedName: 'Pf-1000', feedWeight: 40, price: 496000, feedDate: new Date('2025-04-01') },
    { pondId: kolamB.id, feedName: 'Safir-2', feedWeight: 120, price: 1480000, feedDate: new Date('2025-05-05') },
  ]})
  await prisma.harvest.create({ data: { pondId: kolamB.id, harvestNumber: 1, grossWeight: 220, refraction: 5, netWeight: 209, pricePerKg: 18300, totalPrice: 3824700, buyer: 'Pasar Besar', harvestDate: new Date('2025-05-10') } })

  console.log('✅ Seed selesai!')
  console.log('👤 Login demo: budi@demo.com / demo1234')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
