# Factory Street Records

A modern vinyl record store web application built with React, TypeScript, and Tailwind CSS.

## Features

- Browse vinyl records with detailed product information
- Audio sample player for preview tracks
- Shopping cart functionality
- Wishlist management
- Admin panel for uploading product catalogs via Excel
- Responsive design with beautiful UI
- Condition grading guide for collectors

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SccottyOh/FactoryStreetRecords.git
cd FactoryStreetRecords
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

This will generate optimized files in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Deployment

The application is ready to be deployed to any static hosting service. The production files are in the `dist/` directory after running `npm run build`.

### Deployment Options

#### 1. Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

#### 2. Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

Or drag and drop the `dist/` folder to Netlify's web interface.

#### 3. GitHub Pages

Add to `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/FactoryStreetRecords"
}
```

Then install and use gh-pages:
```bash
npm install --save-dev gh-pages
npm run build
npx gh-pages -d dist
```

#### 4. Any Static Host

Simply upload the contents of the `dist/` folder to any static hosting service:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Firebase Hosting
- Cloudflare Pages

## Admin Access

To access the admin panel for uploading records:
- Navigate to the admin login from the store page
- Default credentials: `admin` / `vinyl2025`
- Upload an Excel file with product data

## Project Structure

```
FactoryStreetRecords/
├── dist/               # Production build output
├── src/
│   ├── App.tsx        # Main application component
│   ├── main.tsx       # Application entry point
│   └── index.css      # Global styles with Tailwind
├── index.html         # HTML template
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite build configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **XLSX** - Excel file processing

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

## License

MIT
