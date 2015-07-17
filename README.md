# News App Plugin 
> A chrome browser plugin proof-of-concept for News App CMS Editors

![Screenshot](http://i.imgur.com/PGXLJgv.png)

## Jump to Section

* [Getting Started](#getting-started)
* [Installation](#installation)
* [Usage](#usage)

## Getting Started

News editors are frequently tracking stories in multiple tabs and browser windows. This browser extension streamlines the process of capturing content by placing a module editing form on the current tab and supports live editing. 
	
### Installation

- Please either clone this repository or download as a ZIP file.
- Extract the contents into your preferred working directory.
- IMPORTANT: Replace {{SERVER_URL}} with the live server URLs in js/content.js and js/background.js files.
- Open your Google Chrome browser.
- Enter `chrome://extensions/` into the address bar.
- Ensure "Developer Mode" is ticked/enabled in the top right.
- Click on "Load unpacked extension...".
- Navigate to your extracted directory, and click "OK".
- Your basic extension template should now be alongside your address bar, showing the News App logo.

## Important Notes

This extension is only a proof of concept and some features may be pending completion.

## Usage

To activate the editor click on the News App logo to the right of address bar.

> Module editor actions (from left to right)

- Live Edit: highlight content areas on the page and edit them in real-time.
- Module Type: url is only support for now.
- Input Selection: choose "content", "image" or "meta" to display different fields.
- Content Fields: Headline and DEK/Body.
- Image Fields: Image preview, Image caption and Image credit.
- Meta Field: Timestamp, Anchor and Tags inputs.
- Post: Open CMS in new tab and restore module data.
- Reload: reload the module from the server, your changes will be lost.
- Close: remove editor from page.

> Select a piece of text on the page, right click, choose "News App", then the module property you wish to update.
> Right click an image, choose "News App", then the "Module: Image" to select a new headline image.


### Files to edit

The main files you will need to edit are:

> js/content.js

- Replace {{SERVER_URL}} with the live server URL.

> js/background.js

- Replace {{SERVER_URL}} with the live server URL.