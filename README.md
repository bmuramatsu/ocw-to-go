# MIT OpenCourseWare To Go

## Development

### Dependencies
Install Node.js version 22 or later using your preferred method. You can use
your system package manager, install from the official site, or use a version
manager like asdf.

Run `npm install` to install dependencies.

### Building

Run `npm run build` to build the site. The output will be in the `dist` folder.

### Server

OCW To Go is a static site. There is a script included that will use
[serve](https://www.npmjs.com/package/serve) to serve the site on port 8088.
You may choose to use another file server or reverse proxy if you prefer.

### HTTPS

Service workers require a secure (HTTPS) connection. An exception is made for
localhost, so if you only care about testing on your computer, you can find the
site at http://localhost:8088.

If you want to test from a mobile device, you will need a domain name and a
valid certificate. Using a service like Cloudflare Tunnels or ngrok is
recommended. These provide the secure connection, and facilitate connecting to
the server without needing to configure local networking or DNS.

Once you have installed a tunneling service, configure it to forward requests
to your server on port 8088.

Run `npm start` to start the development server.

The site needs to be accessed over HTTPS for the service worker to function.
You can use cloudflare tunnels, ngrok, or another service to set up a secure
tunnel to your local server. This also makes it easy to test on mobile devices.

### Re-building

To rebuild the site when changes are made automatically, run `npm run watch`.
For convenience, the command `npm run dev` will run both `serve` and `watch`
together.

### Code formatting

We use Prettier to format source code. This provides a consistent style and
saves time manually formatting code. You can run prettier using provided
scripts, call it manually, or integrate it with your editor.

### Browsers

Google Chrome is recommended for development. It seems to have the best support
for PWAs. In the developer console, in the Application tab, you can easily stop
the service worker, clear all storage, or force the app to reset every page
load. Without that setting, you will see an old cached version of both the app
and worker scripts.

With a tunneling service like cloudflare tunnels, you can also test from mobile
devices, or with iOS simulator and Android Studio, you can test with various
emulated mobile devices. With a bit of configuration, you can attach a desktop
browser to these devices to open a developer console and debug. The specific
steps will vary depending on the host and target operating systems and browsers.

## Scripts

The following scripts are available. They can be run with `npm run <script>`.

- `build`: Build the site with production settings.
- `dev`: Combination of `serve` and `watch` for convenience.
- `formatcheck`: Checks code formatting with prettier.
- `formatfix`: Runs the formatter on all files in src. Be careful with it!
- `lint`: Run ESLint on the project.
- `serve`: Serve the site on port 8088.
- `test`: Run the test suite.
- `typecheck`: Run TypeScript type checking. The build tool, esbuild, builds typescript,
    but disregards type errors.
- `watch`: Watch the project for changes and rebuild automatically.

## Deployment

The site is deployed to Cloudflare Pages. This is done automatically when
changes are merged to the `main` branch.

Depending on the Pages configuration, other branches may be deployed as well.
They will use randomly generated subdomains that are available on the github
pull request page.

## Courses

Course zip files are stored in a cloudflare R2 bucket (similar to AWS S3).
This is currently done manually. After uploaded, the course can be added to the
file `src/app/initial_course_list.ts`. This process is likely to change in the
near future.

## Architecture

OCW To Go is a progressive web app that is intended to work offline. Upon first
load, the application assets are stored in a cache. A service worker script
intercepts incoming requests and serves them from the cache instead of the
network. When courses are downloaded, a ZIP file is unpacked, and each asset
is cached, unmodified. When the user loads the course, we load the root
index.html file in an iframe and inject some items into it to enhance the
experience. Because all paths in the zip are relative, they will pull from the
cache, so navigation and asset loading will work seamlessly.

These are the major components in the app:

- src/app.tsx: This is a small React application that renders the main UI and
    handles navigation and state management
- src/worker.ts: This is the service worker script. It caches the app assets and
    intercepts web requests so the app can function offline.
- src/course.ts: The script that is injected into the course iframe. It handles
    DOM modifications like rendering PDFs, and playing local videos.
