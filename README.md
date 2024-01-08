# Business Card Creator

![Live Demo](https://img.shields.io/github/license/bradgarropy/business-card-creator?style=flat-square)

This project is a web application that allows users to create custom business
cards with text and images.

## Features

- **Canvas Interaction:** Users can drag and drop text and image elements onto a
  canvas to create their business card.
- **Text Editing:** Text elements are editable and can be customized by the
  user.
- **Image Upload:** Users can upload images from their devices to add to the
  business card.
- **Undo/Redo:** The application supports undo and redo functionalities for
  editing actions.
- **Local Storage:** Business card data is saved in the browser's local storage
  for persistence.

## Technologies Used

- **React**: Frontend framework for building the user interface.
- **TypeScript**: Provides static typing to JavaScript for improved development
  experience.
- **React DND**: Used for drag and drop functionality.
- **Cloudinary API**: Handles image uploads and storage.
- **localStorage**: Used for storing and retrieving data locally in the browser.

## Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies with `npm install`.
4. Start the development server with `npm run dev`.
5. For the image upload feature, you will need to create a free Cloudinary
   account and run `cp .env.example .env` and add your Cloudinary API key and
   secret to the `.env` file.

## Usage

- Upon starting the application, users land on a homepage where they can create
  a new business card.
- Drag and drop text or image elements onto the canvas.
- Edit text elements by clicking on them.
- Upload images by clicking on the image upload button.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a new Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).
