# MarsFood Protocol 🚀

Welcome to the MarsFood Protocol application, a vital tool for managing nutrition for the colonists on Mars. This application is built with a React frontend and a powerful, auto-generated Manifest backend.

## Features

- **User Authentication**: Secure signup and login for all personnel.
- **Role-Based Access**: 
    - **Scientists**: Can design and add new meal formulas to the system.
    - **Colonists**: Can view available meals and log their daily consumption.
- **Meal Catalog**: A visual gallery of all available meals, including photos, descriptions, and nutritional information.
- **Consumption Logging**: Colonists can easily log the meals they consume, helping track nutritional intake across the colony.
- **Dynamic UI**: The interface adapts based on the user's role, providing the right tools for the right person.
- **Image Uploads**: Scientists can upload photos for each meal they create.

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root of the project and add your Manifest backend URL:
    ```
    VITE_BACKEND_URL=https://your-manifest-backend-url.mnfst.cloud
    ```

4.  **Run the application:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Admin Panel

Access the full-featured admin panel to manage users, meals, and logs directly:

- **URL**: `VITE_BACKEND_URL/admin`
- **Default Login**: `admin@manifest.build` / `admin`
