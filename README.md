# Group79 - Food Gourmet

Food Gourmet is a web project that showcases various cuisines from around the world. The site includes individual pages for dimmfferent countries, featuring food descriptions, locations, and visually appealing layouts. This project is designed to provide an immersive experience for users interested in global culinary arts.

## Features

- **Home Page**: A global overview of different cuisines, with navigation to individual country pages.
- **Country-Specific Pages**: Detailed pages for countries such as Vietnam, Thailand, and China, each with a focus on traditional dishes and culinary locations.
- **Scrollable Cards**: Implemented in a half-circle layout, these cards allow for touch scrolling on mobile and drag scrolling on desktops. Cards disappear when they exceed the window size.
- **Responsive Design**: Optimized for various screen sizes using HTML, CSS, and JavaScript.
- **Alternating Content Layout**: Each section alternates between image-left and image-right layouts for a visually engaging experience.

## Technologies Used

- **HTML**: For structuring the content on the pages.
- **CSS**: For styling the website, including responsive design elements and custom layouts.
- **JavaScript**: For interactive elements and dynamic content handling.

## Setup Instructions

1. Clone the repository to your local machine.
2. Open the `index.html` file in your browser to view the website.
3. To make changes, edit the relevant `.html`, `.css`, or `.js` files and refresh your browser to see the updates.

## How to Use

- **Navigation**: Use the top navigation bar to move between different pages. Each page is dedicated to a specific country.
- **Interactive Elements**: Interact with the scrollable cards to explore different dishes.

## File Structure

- `index.html` - Main landing page with an overview of the site.
- `vietnam.html`, `thailand.html`, `china.html` - Individual country pages.
- `scripts.js` - JavaScript file for interactivity and dynamic elements.
- `styles.css` - Custom CSS for styling.
- `images/` - Directory containing images used on the website.

## Contributing to Explore Culinary

We welcome contributions to improve and expand the Food Gourmet website! Whether you're adding new content, fixing bugs, or improving the design, your contributions are appreciated. Here's how you can get started:

### Fork the Repository

1. Navigate to the repository on GitHub.
2. Click on the **Fork** button in the upper-right corner of the repository page. This will create a copy of the repository under your GitHub account.

### Clone the Forked Repository

1. Go to your GitHub profile and find the forked repository.
2. Click on the **Code** button and copy the HTTPS or SSH URL.
3. Open your terminal and run the following command to clone the repository to your local machine:
   ```bash
   git clone https://github.com/BLTC-520/UCCD2323_Group79_FoodGourmet
   ```
4. Navigate to the project directory:
   ```bash
   cd explore-culinary
   ```

### Create a New Branch

1. Before making any changes, create a new branch to work on:
   ```bash
   git checkout -b your-feature-branch
   ```
   Replace `your-feature-branch` with a descriptive name for your branch, like `add-new-country-page` or `fix-responsive-design`.

### Make Your Changes

1. Make the necessary changes to the codebase.
2. Test your changes to ensure everything works as expected.

### Commit Your Changes

1. After making and testing your changes, stage the changes:
   ```bash
   git add .
   ```
2. Commit the changes with a meaningful commit message:
   ```bash
   git commit -m "Add new country page for Japan"
   ```

### Push to GitHub

1. Push your changes to your forked repository on GitHub:
   ```bash
   git push origin your-feature-branch
   ```

### Create a Pull Request

1. Go to your forked repository on GitHub.
2. Click on the **Compare & pull request** button.
3. Add a descriptive title and detailed description of your changes.
4. Submit the pull request.

### Code Review

1. Your pull request will be reviewed by the repository maintainers.
2. If any changes are requested, make the necessary updates in your local branch, commit them, and push them to GitHub. The pull request will be automatically updated.

### Merge

1. Once your pull request is approved, it will be merged into the main branch.
2. You can then pull the latest changes from the main repository to your local branch:
   ```bash
   git pull upstream main
   ```

### Keeping Your Fork Updated

1. To keep your forked repository in sync with the main repository, add the original repository as an upstream remote:
   ```bash
   git remote add upstream https://github.com/original-owner/explore-culinary.git
   ```
2. Fetch the latest changes:
   ```bash
   git fetch upstream
   ```
3. Merge the changes into your main branch:
   ```bash
   git checkout main
   git merge upstream/main
   ```
4. Push the updated main branch to your fork:
   ```bash
   git push origin main
   ```

## Future Enhancements

- **More Country Pages**: Expanding the website to include more countries and cuisines.
- **Interactive Maps**: Adding maps to show the locations of famous food spots in each country.
- **User Contributions**: Allowing users to submit their own recipes and food experiences.

## Author

Created by Har Sze Hao, Lee Ding Shen, Pang Zhan Huang.
