# My React Exam Tracking Application

This project is a React application designed to manage and track exam registrations for students. It provides functionalities for viewing, taking, and canceling exams, as well as displaying detailed information about each registration.

## Project Structure

The project is organized as follows:

```
my-react-trac-nghiem
├── src
│   ├── components
│   │   ├── studenExam
│   │   │   ├── StudentExamPage.jsx        # Main page for displaying exam registrations
│   │   │   ├── StudentExamList.jsx        # Component for fetching and displaying exam registrations
│   │   │   ├── StudentExamListItem.jsx    # Component for rendering a table of exam registrations
│   │   │   ├── CancelExamModal.jsx        # Modal for canceling an exam registration
│   │   │   └── StudentExamDetail.jsx      # Component for displaying detailed information about an exam registration
│   │   └── common
│   │       └── CellDisplay.jsx             # Component for displaying specific data from related tables
│   ├── pages
│   │   └── StudentExamDetailPage.jsx      # Page component for displaying detailed information about an exam registration
│   ├── services
│   │   ├── service.hamChung.js            # Service functions for handling API calls related to exam registrations
│   │   └── service.hamChiTiet.js          # Service functions for fetching detailed user information
│   ├── redux
│   │   └── actions
│   │       └── factoryActions.js          # Functions for creating Redux actions
│   ├── globals
│   │   └── globals.js                      # Global utility functions
│   ├── App.jsx                             # Main application component
│   └── index.jsx                          # Entry point of the application
├── public
│   └── index.html                          # Main HTML file for the application
├── package.json                            # Configuration file for npm
├── .eslintrc.json                         # ESLint configuration file
└── README.md                               # Documentation for the project
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd my-react-trac-nghiem
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run:
```
npm start
```
This will launch the application in your default web browser.

## Features

- View exam registrations categorized by status (e.g., "Chưa làm", "Đã làm", "Tất cả").
- Take exams directly from the registration list.
- Cancel exam registrations with a reason.
- View detailed information about each exam registration.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License.