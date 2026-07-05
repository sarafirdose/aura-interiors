import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

const CATEGORIES = [
  'Living Room', 'Bedroom', 'Dining', 'Office', 'Outdoor',
  'Kitchen', 'Kids', 'Lighting', 'Decor', 'Rugs',
  'Mirrors', 'Plants', 'Storage'
]

const COLLECTIONS = [
  { name: 'Luxury Collection', description: 'The pinnacle of interior design.' },
  { name: 'Modern Collection', description: 'Sleek, minimalist, and forward-thinking.' },
  { name: 'Scandinavian Collection', description: 'Warm woods and natural textures.' },
]

const MATERIALS = ['Italian Leather', 'Solid Oak', 'Walnut', 'Velvet', 'Marble', 'Brass', 'Matte Steel']
const COLORS = [
  { name: 'Charcoal', hex: '#333333' },
  { name: 'Ivory', hex: '#FFFFF0' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Forest Green', hex: '#228B22' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Terracotta', hex: '#E2725B' }
]

const FURNITURE_NOUNS = ['Sofa', 'Lounge Chair', 'Dining Table', 'Bed Frame', 'Bookshelf', 'Cabinet', 'Coffee Table', 'Sideboard', 'Pendant Light', 'Armchair']

async function main() {
  console.log('Seeding database with 300+ realistic products...')

  // Clear existing
  await prisma.productVariant.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.review.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.collection.deleteMany()

  // Create Categories
  const categoryMap = new Map()
  for (const catName of CATEGORIES) {
    const cat = await prisma.category.create({
      data: {
        name: catName,
        slug: faker.helpers.slugify(catName).toLowerCase()
      }
    })
    categoryMap.set(catName, cat.id)
  }

  // Create Collections
  const collectionMap = new Map()
  for (const coll of COLLECTIONS) {
    const collection = await prisma.collection.create({
      data: {
        name: coll.name,
        slug: faker.helpers.slugify(coll.name).toLowerCase(),
        description: coll.description
      }
    })
    collectionMap.set(coll.name, collection.id)
  }

  // Maintain category-specific counter for sequential image cycling without collisions
  const categoryCounter = new Map<string, number>();
  for (const catName of CATEGORIES) {
    categoryCounter.set(catName, 0);
  }

  // Generate 300 Products
  for (let i = 0; i < 300; i++) {
    const categoryName = faker.helpers.arrayElement(CATEGORIES)
    const categoryId = categoryMap.get(categoryName)
    const collectionId = Math.random() > 0.5 ? collectionMap.get(faker.helpers.arrayElement(COLLECTIONS).name) : null
    
    const material = faker.helpers.arrayElement(MATERIALS)
    const noun = faker.helpers.arrayElement(FURNITURE_NOUNS)
    const adjective = faker.commerce.productAdjective()
    
    // Realistic Indian Pricing
    const basePrice = faker.number.int({ min: 5000, max: 150000 })
    const hasDiscount = Math.random() > 0.6
    const discount = hasDiscount ? faker.number.int({ min: 10, max: 40 }) : 0
    const salePrice = hasDiscount ? Math.floor(basePrice * (1 - discount / 100)) : null

    const hasAR = Math.random() > 0.5;
    let glbModelUrl = null;
    
    if (hasAR) {
      if (noun.toLowerCase().includes('sofa') || noun.toLowerCase().includes('couch')) {
        glbModelUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenWoodLeatherSofa/glTF-Binary/SheenWoodLeatherSofa.glb';
      } else if (noun.toLowerCase().includes('lamp') || noun.toLowerCase().includes('light') || categoryName.toLowerCase().includes('lighting')) {
        glbModelUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/IridescenceLamp/glTF-Binary/IridescenceLamp.glb';
      } else if (categoryName.toLowerCase().includes('plant')) {
        glbModelUrl = 'https://raw.githubusercontent.com/microsoft/experimental-pcf-control-assets/master/flf_orange.glb';
      } else if (noun.toLowerCase().includes('chair') || noun.toLowerCase().includes('armchair') || noun.toLowerCase().includes('stool')) {
        glbModelUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb';
      } else {
        glbModelUrl = 'https://raw.githubusercontent.com/microsoft/experimental-pcf-control-assets/master/chair.glb';
      }
    }

    const heroImage = `/images/products/product-${(i % 30) + 1}.jpg`;

    const product = await prisma.product.create({
      data: {
        sku: `AURA-${faker.string.alphanumeric(6).toUpperCase()}`,
        name: `${adjective} ${material} ${noun}`,
        brand: Math.random() > 0.7 ? 'AURA' : faker.company.name(),
        categoryId,
        collectionId,
        heroImage,
        glbModelUrl,
        usdzModelUrl: null,
        price: basePrice,
        salePrice,
        discount,
        rating: faker.number.float({ min: 3.8, max: 5.0, multipleOf: 0.1 }),
        reviewCount: faker.number.int({ min: 5, max: 350 }),
        material,
        finish: faker.helpers.arrayElement(['Matte', 'Glossy', 'Natural', 'Brushed']),
        room: categoryName,
        dimensions: `${faker.number.int({min: 40, max: 200})}W x ${faker.number.int({min: 40, max: 100})}D x ${faker.number.int({min: 40, max: 100})}H cm`,
        weight: `${faker.number.int({ min: 5, max: 100 })} kg`,
        assemblyRequired: Math.random() > 0.5,
        warranty: `${faker.number.int({ min: 1, max: 10 })} Years`,
        deliveryTime: `${faker.number.int({ min: 2, max: 14 })} Days`,
        stockStatus: faker.helpers.arrayElement(['IN_STOCK', 'IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK']),
        description: `Experience the epitome of luxury with this ${adjective.toLowerCase()} ${noun.toLowerCase()}. Crafted from premium ${material.toLowerCase()}, this piece is designed to elevate your ${categoryName.toLowerCase()} aesthetics.`,
        features: JSON.stringify([
          'Premium build quality',
          'Sustainable sourcing',
          'Ergonomic comfort design',
          'Easy maintenance'
        ]),
        careInstructions: 'Wipe clean with a damp cloth. Avoid harsh chemical cleaners to preserve the finish.',
      }
    })

    // Create 1-3 color variants per product
    const numVariants = faker.number.int({ min: 1, max: 3 })
    const selectedColors = faker.helpers.arrayElements(COLORS, numVariants)
    
    for (const color of selectedColors) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          color: color.name,
          hex: color.hex,
          sku: `${product.sku}-${color.name.substring(0,3).toUpperCase()}`
        }
      })
    }
  }

  console.log('✅ Seeding complete! 300 products generated.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
