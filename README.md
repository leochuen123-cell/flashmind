# FlashMind - Smart Flashcards

A beautiful, feature-rich flashcard app with spaced repetition, multi-tag support, and image capabilities.

![FlashMind Screenshot](https://via.placeholder.com/800x400/8b5cf6/ffffff?text=FlashMind)

## ✨ Features

- 🧠 **Spaced Repetition** - SM-2 algorithm for optimal learning
- 🏷️ **Multi-Tag System** - Cards can belong to multiple tags
- 🖼️ **Image Support** - Add images to both sides of cards
- 🔍 **Search & Filter** - Find cards quickly
- 📊 **Progress Tracking** - Visual statistics dashboard
- 💾 **Export/Import** - Backup and restore your data
- 📱 **Responsive Design** - Works on all devices

## 🚀 Getting Started

### Option 1: Use the Live App
Simply visit: [https://5o5j6ne3czsyg.ok.kimi.link](https://5o5j6ne3czsyg.ok.kimi.link)

### Option 2: Host on GitHub Pages (Free!)

Follow these step-by-step instructions to host your own copy:

#### Step 1: Create a GitHub Account
1. Go to [github.com](https://github.com)
2. Click "Sign up" and create a free account
3. Verify your email address

#### Step 2: Create a New Repository
1. Click the **+** button in the top right corner
2. Select **"New repository"**
3. Name it `flashmind` (or any name you like)
4. Make sure it's set to **Public**
5. Click **"Create repository"**

#### Step 3: Upload the Files
1. Download this project as a ZIP file (or get the files from your developer)
2. Extract the ZIP file on your computer
3. On your GitHub repository page, click **"uploading an existing file"**
4. Drag and drop all the files from the extracted folder
5. Click **"Commit changes"**

#### Step 4: Enable GitHub Pages
1. In your repository, click **"Settings"** (tab at the top)
2. Scroll down to the **"Pages"** section in the left sidebar
3. Under **"Source"**, select **"GitHub Actions"**
4. The workflow file is already included - it will automatically deploy!

#### Step 5: Wait for Deployment
1. Go to the **"Actions"** tab at the top of your repository
2. You'll see a workflow running (yellow dot)
3. Wait for it to turn green (about 2-3 minutes)
4. Once complete, your app will be live at:
   - `https://YOUR_USERNAME.github.io/flashmind`

#### Step 6: (Optional) Use a Custom Domain
1. In Settings > Pages, under "Custom domain", enter your domain
2. Follow GitHub's instructions to configure DNS
3. Your app will be available at your custom domain!

## 📖 How to Use

### Creating Cards
1. Click **"New Card"** button
2. Enter the question/prompt on the **Front** side
3. Enter the answer on the **Back** side
4. (Optional) Add images by clicking the upload area
5. Select tags or create new ones
6. Click **"Save"**

### Organizing with Tags
1. Go to **"Tags"** from the sidebar
2. Click **"New Tag"** to create a tag
3. Assign multiple tags to cards when creating/editing
4. Click any tag in the sidebar to filter cards

### Studying
1. Click **"Study Now"** when you have cards due
2. Read the question and click the card to flip
3. Rate how well you knew the answer:
   - **Again** - Didn't know it (review in < 1 minute)
   - **Hard** - Knew it with difficulty (review in 2 days)
   - **Good** - Knew it well (review in 4 days)
   - **Easy** - Knew it perfectly (review in 7 days)
4. Use keyboard shortcuts: Space to flip, 1-4 to rate

### Exporting Your Data
1. Click **"Data"** in the sidebar
2. Click **"Export to JSON"**
3. Save the file as a backup

### Importing Data
1. Click **"Data"** in the sidebar
2. Click **"Import from JSON"**
3. Select your backup file
4. Confirm the import (this replaces all current data)

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` or `Enter` | Flip card |
| `1` | Rate: Again |
| `2` | Rate: Hard |
| `3` | Rate: Good |
| `4` | Rate: Easy |

## 🔒 Privacy

All your data is stored locally in your browser. Nothing is sent to any server. Your flashcards are private to you.

## 🛠️ Technical Details

- Built with React + TypeScript + Vite
- Uses the SM-2 spaced repetition algorithm
- Stores data in browser's localStorage
- Responsive design with Tailwind CSS

## 📝 License

This project is open source and free to use.

## 🆘 Need Help?

If you have any issues:
1. Check the browser console for errors (F12 > Console)
2. Make sure you're using a modern browser (Chrome, Firefox, Safari, Edge)
3. Clear your browser cache and reload
4. Export your data as a backup before making major changes

---

Made with ❤️ for learners everywhere!
