# Sales Analytics Dashboard

A comprehensive full-stack analytics dashboard built with React, Node.js, Express, and MongoDB. This application demonstrates advanced MongoDB aggregation pipelines, real-time data visualization, and modern web development practices.

## 🚀 Features

### Backend Features

- **MongoDB Aggregation Pipelines**: Complex data processing and analytics
- **RESTful API**: Clean and well-structured API endpoints
- **Date Range Filtering**: Flexible date-based data filtering
- **Data Seeding**: Automated sample data generation spanning 2 years
- **Error Handling**: Comprehensive validation and error management
- **Performance Optimized**: Efficient database queries and caching

### Frontend Features

- **Interactive Dashboard**: Real-time analytics with beautiful visualizations
- **Date Range Picker**: Intuitive date selection for custom reporting periods
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Data Visualization**: Advanced charts using Apache ECharts
- **Loading States**: Smooth user experience with proper loading indicators
- **Reports History**: Track and view previously generated analytics reports

### Analytics Capabilities

- Revenue tracking and trends analysis
- Top-selling products identification
- Customer value analysis
- Region-wise sales statistics
- Category-wise performance metrics
- Average order value calculations

## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database with Mongoose ODM
- **Moment.js & date-fns** - Date manipulation libraries

### Frontend

- **React 18** - Frontend library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Apache ECharts** - Data visualization library
- **React DatePicker** - Date selection component
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Development Tools

- **ESLint** - Code linting
- **Concurrently** - Run multiple commands
- **Morgan** - HTTP request logger
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/priyanka-dhondla/sales-analytics.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

````env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sales-analytics
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sales-analytics

# Server Configuration
PORT=5000
NODE_ENV=development



### 4. Seed the Database

```bash
npm run seed
````

### 5. Start Development Servers

```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 5173).

## 📁 Project Structure

```
sales-analytics-dashboard/
├── backend/
│   ├── controllers/          # Route controllers
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   ├── utils/               # Utility functions & seeding
│   └── server.js            # Express server entry point
├── frontend/
│   └── src/
│       ├── components/      # React components
│       ├── pages/           # Page components
│       ├── services/        # API services
│       ├── hooks/           # Custom React hooks
│       ├── utils/           # Utility functions
│       └── App.jsx          # Main App component
├── public/                  # Static assets
├── .env.example            # Environment variables template
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## 🎯 Available Scripts

| Script                 | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Start both backend and frontend in development mode |
| `npm run dev:backend`  | Start only the backend server                       |
| `npm run dev:frontend` | Start only the frontend development server          |
| `npm run build`        | Build the frontend for production                   |
| `npm start`            | Start the production server                         |
| `npm run seed`         | Populate the database with sample data              |
| `npm run lint`         | Run ESLint for code quality checks                  |

## 🗄️ Database Schema

### Collections

#### Orders Collection

```javascript
{
  _id: ObjectId,
  orderId: String,
  customerId: ObjectId,
  products: [
    {
      productId: ObjectId,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  orderDate: Date,
  status: String,
  region: String
}
```

#### Customers Collection

```javascript
{
  _id: ObjectId,
  customerId: String,
  name: String,
  email: String,
  phone: String,
  address: String,
  region: String,
  customerType: String,
  registrationDate: Date
}
```

#### Products Collection

```javascript
{
  _id: ObjectId,
  productId: String,
  name: String,
  category: String,
  price: Number,
  description: String,
  inStock: Boolean
}
```

#### Analytics Reports Collection

```javascript
{
  _id: ObjectId,
  reportDate: Date,
  startDate: Date,
  endDate: Date,
  totalOrders: Number,
  totalRevenue: Number,
  avgOrderValue: Number,
  topProducts: Array,
  topCustomers: Array,
  regionWiseStats: Object,
  categoryWiseStats: Object,
  createdAt: Date
}
```

## 🔌 API Endpoints

### Analytics Routes

- `GET /api/analytics/dashboard` - Get dashboard summary
- `POST /api/analytics/generate` - Generate analytics report for date range
- `GET /api/analytics/reports` - Get all previous reports
- `GET /api/analytics/reports/:id` - Get specific report by ID

### Data Routes

- `GET /api/orders` - Get orders with optional filters
- `GET /api/customers` - Get customers data
- `GET /api/products` - Get products data

### Query Parameters

- `startDate` - Filter start date (YYYY-MM-DD)
- `endDate` - Filter end date (YYYY-MM-DD)
- `region` - Filter by region
- `category` - Filter by product category

## 📊 MongoDB Aggregation Pipelines

The application uses sophisticated aggregation pipelines for:

1. **Revenue Analysis** - Calculate total revenue, trends, and growth
2. **Product Performance** - Identify top-selling products and categories
3. **Customer Insights** - Find most valuable customers and segments
4. **Regional Analysis** - Compare performance across different regions
5. **Time-based Analytics** - Analyze trends over different time periods

Example aggregation for revenue analysis:

```javascript
[
  {
    $match: {
      orderDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    },
  },
  {
    $group: {
      _id: null,
      totalRevenue: { $sum: "$totalAmount" },
      totalOrders: { $sum: 1 },
      avgOrderValue: { $avg: "$totalAmount" },
    },
  },
];
```

## 🎨 UI Components

### Dashboard Components

- **MetricsCards** - Display key performance indicators
- **DateRangePicker** - Custom date selection component
- **ChartsContainer** - Wrapper for ECharts visualizations
- **ReportsTable** - Display historical reports
- **LoadingSpinner** - Loading state indicator

### Charts Available

- Revenue trends (Line Chart)
- Product performance (Bar Chart)
- Regional distribution (Pie Chart)
- Category analysis (Doughnut Chart)

### Environment Variables for Production

```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
NODE_ENV=production
```

## 🧪 Testing

Run tests with:

```bash
npm test
```
