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

## Scripts

The following scripts are available. They can be run with `npm run <script>`.

- `build`: Build the site with production settings.
- `dev`: Combination of `serve` and `watch` for convenience.
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
