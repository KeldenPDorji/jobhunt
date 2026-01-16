<div align="center">

# 🎯 RealJob

### Modern Job Search Application with Real-Time Listings

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Demo](#) · [Features](#-features) · [Quick Start](#-quick-start) · [Documentation](#-api-integration)

</div>

---

## 📋 Overview

**RealJob** is a modern, production-ready job search application that aggregates real-time job listings from multiple APIs. Built with React and Vite, it features a beautiful gradient UI, advanced filtering capabilities, and seamless job application workflows.

### ✨ Key Highlights

- 🚀 **Zero Configuration** - Works immediately with The Muse API (no API key required)
- 🔍 **Smart Search** - Real-time search across titles, companies, and descriptions
- 🎨 **Modern UI/UX** - Beautiful gradient design with smooth animations
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- 🔐 **Secure** - Environment variables for API keys with proper `.gitignore` setup
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development and builds

---

## 🌟 Features

| Feature | Description |
|---------|-------------|
| **Real Job Data** | Integrates with The Muse, JSearch (RapidAPI), and Adzuna APIs |
| **Advanced Search** | Search by job title, keywords, company name, and location |
| **Smart Filters** | Filter by job type, experience level, and posting date |
| **Direct Application** | One-click access to company application pages |
| **Expandable Cards** | View full job descriptions with smooth animations |
| **Loading States** | Professional loading indicators and error handling |
| **API Fallback** | Automatic fallback between multiple job data sources |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v14 or higher
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/realjob.git
   cd realjob
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   Navigate to http://localhost:5173
   ```

**That's it!** The application is ready to use with The Muse API (no configuration needed).

---

## 🔧 API Integration

### Default: The Muse API ✅

The app works **out of the box** with The Muse API:
- ✅ 100% Free - No API key required
- ✅ No sign-up necessary
- ✅ 1000+ real companies
- ✅ Updated daily

### Optional: Additional Job Sources

Expand your job listings by adding these free API keys:

#### Option 1: JSearch (RapidAPI)

1. Visit [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
2. Sign up for a free account (no credit card)
3. Subscribe to the free tier (2,500 requests/month)
4. Copy your API key

#### Option 2: Adzuna API

1. Visit [Adzuna Developer Portal](https://developer.adzuna.com/)
2. Create a free account and register an app
3. Copy your App ID and App Key

### Configuration

1. **Create environment file**
   ```bash
   cp .env.example .env
   ```

2. **Add your API keys to `.env`**
   ```env
   # Optional: JSearch API
   VITE_RAPIDAPI_KEY=your_rapidapi_key_here
   
   # Optional: Adzuna API
   VITE_ADZUNA_APP_ID=your_app_id_here
   VITE_ADZUNA_APP_KEY=your_app_key_here
   ```

3. **Restart the development server**

> **🔒 Security Note**: The `.env` file is automatically excluded from Git commits via `.gitignore`. Never commit API keys to version control.

---

## 📖 Usage Guide

### Search Jobs

1. **Enter search terms** in the search bar (e.g., "Software Engineer", "React Developer")
2. **Add location** (optional) to filter by geographic area
3. **Click "Search Jobs"** or press Enter

### Apply Filters

Use the sidebar to refine results:

- **Job Type**: Full-time, Part-time, Contract, Remote
- **Experience Level**: Entry, Mid-level, Senior
- **Date Posted**: Last 24 hours, 7 days, 30 days, All time

### Apply to Jobs

1. Click on a job card to expand the full description
2. Review the job details, requirements, and salary (if available)
3. Click **"Apply Now"** to visit the company's application page

---

## �️ Project Structure

```
realjob/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation header
│   │   ├── Header.css
│   │   ├── SearchBar.jsx       # Search input component
│   │   ├── SearchBar.css
│   │   ├── Filters.jsx         # Filter sidebar
│   │   ├── Filters.css
│   │   ├── JobList.jsx         # Job listings container
│   │   ├── JobList.css
│   │   ├── JobCard.jsx         # Individual job card
│   │   ├── JobCard.css
│   │   ├── InfoBanner.jsx      # Information banner
│   │   └── InfoBanner.css
│   ├── api/
│   │   └── jobsApi.js          # API integration logic
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Application styles
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite configuration
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

---

## 🎨 Customization

### Theme Colors

Edit the gradient in `src/index.css`:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Component Styling

Each component has its own CSS file for easy customization:
- Modify colors, spacing, and layouts independently
- Follow the existing naming conventions
- Use CSS variables for consistent theming

### API Priority

Modify the fallback order in `src/api/jobsApi.js`:

```javascript
// Default order: The Muse → JSearch → Adzuna
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Hosting Platforms

#### Vercel
```bash
vercel --prod
```

#### Netlify
1. Build the project: `npm run build`
2. Drag & drop the `dist/` folder to Netlify

#### GitHub Pages
1. Install `gh-pages`: `npm install -D gh-pages`
2. Add to `package.json`:
   ```json
   "scripts": {
     "deploy": "vite build && gh-pages -d dist"
   }
   ```
3. Deploy: `npm run deploy`

> **Environment Variables**: Remember to add your API keys to your hosting platform's environment variable settings.

---

## 🛠️ Tech Stack

- **Frontend**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **HTTP Client**: Axios 1.6.0
- **Icons**: Lucide React 0.294.0
- **Styling**: Pure CSS with modern features

---

## 📊 API Sources Comparison

| API | Free Tier | API Key Required | Job Count | Special Features |
|-----|-----------|------------------|-----------|------------------|
| **The Muse** | ✅ Unlimited | ❌ No | 1000+ companies | Default source, always available |
| **JSearch** | 2,500/month | ✅ Yes (Free) | Global listings | Rich data, salary info |
| **Adzuna** | Limited | ✅ Yes (Free) | Multi-country | Salary statistics included |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Website: [yourwebsite.com](https://yourwebsite.com)

---

## � Acknowledgments

- [The Muse API](https://www.themuse.com/developers/api/v2) for free job listings
- [RapidAPI](https://rapidapi.com/) for JSearch API access
- [Adzuna](https://developer.adzuna.com/) for additional job data
- [Lucide](https://lucide.dev/) for beautiful icons

---

<div align="center">

**Built with ❤️ using React + Vite**

⭐ Star this repo if you find it helpful!

</div>
