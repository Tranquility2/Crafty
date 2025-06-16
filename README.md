![Crafty Recipe Example](assets/new.jpg)

# Crafty

Crafty is a simple web application that allows users to create and visualize Factorio-like recipes.

## How to Use

Open `index.html` in your web browser to use the application.

- **Adding/Removing Icons:** Use the `+` and `-` buttons next to the input and output areas to add or remove icons.
- **Updating Icons:** Click on an existing icon to open an edit frame. Here you can:
    - Provide an image URL or upload an image file to change the icon's appearance. 🖼️
    - Adjust the count displayed on the icon. 🔢
    - Click "Update" to apply your changes.
- **Generating Image:** Click the "Generate Image" button to create a static image of the current recipe build area. 📷 (Note: May encounter issues with images from external URLs due to cross-origin restrictions. This feature uses the `dom-to-image` library.)
