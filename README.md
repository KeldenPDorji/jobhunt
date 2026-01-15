# RealJob - Real Job Listings Application

A modern, beautiful job search application that fetches **real job listings** from APIs. Features include search, filtering, and direct application functionality.

## 🌟 Features

- **Real Job Data**: Integrates with job search APIs (JSearch via RapidAPI or Adzuna)
- **Advanced Search**: Search by job title, keywords, company, and location
- **Smart Filters**: Filter by job type, experience level, and date posted
- **Beautiful UI**: Modern, gradient design with smooth animations
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Apply Functionality**: Direct links to apply on company websites

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the application**:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

**The app works out of the box!** It uses **The Muse API** which is completely free and requires no API key. Real job listings will be fetched automatically.

### Optional: Add More Job Sources

Want even more job listings? Add these **free** API keys:

**Option A: JSearch API (RapidAPI)**
1. Go to [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
2. Sign up for a **free account** (no credit card required)
3. Subscribe to the **free tier** (2,500 requests/month)
4. Copy your API key
5. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
6. Add your key to `.env`:
   ```
   VITE_RAPIDAPI_KEY=your-actual-key-here
   ```

**Option B: Adzuna API**
1. Go to [Adzuna Developer Portal](https://developer.adzuna.com/)
2. Sign up and create an app (free)
3. Copy your App ID and App Key
4. Add to your `.env` file:
   ```
   VITE_ADZUNA_APP_ID=your-app-id
   VITE_ADZUNA_APP_KEY=your-app-key
   ```

**⚠️ Security Note**: Never commit your `.env` file to Git! It's already in `.gitignore`.

## 📖 Usage

1. **Search**: Enter job title/keywords and location in the search bar
2. **Filter**: Use the sidebar to filter by:
   - Job Type (Full-time, Part-time, Contract, Remote)
   - Experience Level (Entry, Mid, Senior)
   - Date Posted (24h, 7d, 30d)
3. **Apply**: Click "Apply Now" on any job card to visit the application page

## 🎨 Project Structure

```
realjob/
├── src/
│   ├── components/
│   │   ├── Header.jsx/css      # App header
│   │   ├── SearchBar.jsx/css   # Search functionality
│   │   ├── Filters.jsx/css     # Filter sidebar
│   │   ├── JobList.jsx/css     # Job listings container
│   │   └── JobCard.jsx/css     # Individual job card
│   ├── api/
│   │   └── jobsApi.js          # API integration
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # App styles
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## 🔧 Configuration

### API Configuration

The app is **ready to use immediately** with The Muse API (no setup needed).

To add more job sources, use environment variables (recommended for security):

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Add your API keys to `.env`:
   ```
   VITE_RAPIDAPI_KEY=your-key-here
   VITE_ADZUNA_APP_ID=your-app-id
   VITE_ADZUNA_APP_KEY=your-app-key
   ```

The app automatically tries multiple sources in order:
1. The Muse API (primary, always available)
2. JSearch API (if `VITE_RAPIDAPI_KEY` provided)
3. Adzuna API (if Adzuna credentials provided)
4. Error message (if all fail)

**🔒 Security**: The `.env` file is in `.gitignore` and will never be committed.

## 🌐 API Sources

### Primary: The Muse API ✅
- **100% Free** - No API key needed!
- **No sign-up required**
- **Real job listings** from 1000+ companies
- Works immediately out of the box

### Optional APIs (for more jobs):

#### JSearch (RapidAPI)
- ✅ Free tier: 2,500 requests/month
- ✅ No credit card required
- ✅ Global job listings with rich data
- ⚠️ Requires free RapidAPI account

#### Adzuna
- ✅ Free tier available
- ✅ Multiple countries supported
- ✅ Salary information included
- ⚠️ Requires app registration

## 📱 Features in Detail

### Search
- Real-time search across job titles, companies, and descriptions
- Location-based filtering
- Debounced API calls for performance

### Filters
- **Job Type**: Full-time, Part-time, Contract, Remote
- **Experience Level**: Entry, Mid-level, Senior
- **Date Posted**: Last 24h, 7d, 30d, All time

### Job Cards
- Company logos
- Salary information (when available)
- Job type and location badges
- Expandable descriptions
- Direct apply links

## 🎨 Customization

### Colors
Edit the gradient in `src/index.css` and `src/App.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Styling
Each component has its own CSS file for easy customization.

## 🚀 Deployment

Build for production:
```bash
npm run build
```

The `dist` folder will contain your production-ready application.

Deploy to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop the `dist` folder
- **GitHub Pages**: Use `gh-pages` package

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using React + Vite**
# jobhunt
