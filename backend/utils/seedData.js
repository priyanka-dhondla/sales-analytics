// utils/seedData.js
import { db } from "../config/database.js"; // your database wrapper

const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Books",
  "Health",
  "Automotive",
  "Beauty",
];
const regions = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East",
  "Africa",
];
const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
const customerTypes = ["individual", "business"];
await db.connect(
  "mongodb+srv://sibbalapotheesh:admin888634@cluster1.ezgt7jc.mongodb.net/salesDB?retryWrites=true&w=majority"
); // call this first

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // 1. Seed Products
    console.log("📦 Seeding products...");
    const products = [];
    for (let i = 1; i <= 100; i++) {
      products.push({
        name: `Product ${i}`,
        description: `Description for product ${i}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        price: Math.floor(Math.random() * 500) + 10,
        costPrice: Math.floor(Math.random() * 200) + 5,
        stockQuantity: Math.floor(Math.random() * 1000) + 10,
        sku: `SKU-${String(i).padStart(3, "0")}`,
        brand: `Brand ${Math.ceil(i / 10)}`,
        tags: [`tag${i}`, `category-tag`],
        isActive: Math.random() > 0.1,
      });
    }
    await db.insertMany("products", products);

    // 2. Seed Customers
    console.log("👥 Seeding customers...");
    const customers = [];
    for (let i = 1; i <= 200; i++) {
      customers.push({
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
        phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        address: {
          street: `${Math.floor(Math.random() * 999) + 1} Main St`,
          city: `City ${Math.floor(Math.random() * 50) + 1}`,
          state: `State ${Math.floor(Math.random() * 50) + 1}`,
          zipCode: String(Math.floor(Math.random() * 90000) + 10000),
          country: "USA",
        },
        customerType:
          customerTypes[Math.floor(Math.random() * customerTypes.length)],
        registrationDate: randomDateInLast2Years(),
        totalSpent: 0,
        region: regions[Math.floor(Math.random() * regions.length)],
      });
    }
    const createdCustomers = await db.insertMany("customers", customers);

    // 4. Seed Orders
    console.log("🛒 Seeding orders...");
    const createdProducts = await db.find("products"); // fetch products first
    const orders = [];

    for (let i = 1; i <= 1000; i++) {
      const customer =
        createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
      const orderDate = randomDateInLast2Years();
      const itemCount = Math.floor(Math.random() * 5) + 1;
      const items = [];
      let totalAmount = 0;

      for (let j = 0; j < itemCount; j++) {
        const product =
          createdProducts[Math.floor(Math.random() * createdProducts.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const unitPrice = product.price;
        const totalPrice = quantity * unitPrice;

        items.push({
          productId: product._id,
          quantity,
          unitPrice,
          totalPrice,
        });

        totalAmount += totalPrice;
      }

      orders.push({
        customerId: customer._id,
        orderDate,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        items,
        totalAmount,
        shippingAddress: customer.address,
        region: customer.region,
        paymentMethod: ["credit_card", "paypal", "bank_transfer"][
          Math.floor(Math.random() * 3)
        ],
      });
    }

    await db.insertMany("orders", orders);

    console.log("✅ Database seeding completed successfully!");
    console.log(
      `📊 Seeded: ${products.length} products, ${customers.length} customers, ${orders.length} orders`
    );
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

function randomDateInLast2Years() {
  const now = new Date();
  const twoYearsAgo = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
  return new Date(
    twoYearsAgo.getTime() +
      Math.random() * (now.getTime() - twoYearsAgo.getTime())
  );
}

// Run seeding
seedDatabase();
