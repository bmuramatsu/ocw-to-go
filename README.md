# MIT OpenCourseWare To Go

# About
MIT OpenCourseWare To Go is an experiment in offering selected <a href="https://ocw.mit.edu/">MIT 
OpenCourseWare</a> materials optimized for offline use in Google Chrome on Android and iOS devices.

If you have questions, please contact us at <a href="mailtoo:ocwtogo-help@mit.edu">ocwtogo-help@mit.edu</a>.

## Development

### Dependencies
Install Node.js version 22 or later using your preferred method. You can use
your system package manager, install from the official site, or use a version
manager like asdf.

Run `npm install` to install dependencies.

### Running

Run `npm run dev` to build and serve the app. There are alternative ways
to run described below, but this is the easiest way to get started.
Once it is running, open your browser and navigate to `http://localhost:8088`
to view the app.

### HTTPS

Browser standards require that service workers can't run on any given site. The
must run either over HTTPS, or on localhost. Localhost is included for
convenience during development. So you may use service workers on a valid HTTPS
site or at http://localhost:[port], but not over a IP or http domain, like
http://192.[address-of-host-machine] or http://[custom-domain-name].

So you may start development within your browser over localhost, but in order
to test from a mobile device, you will need a domain name and a valid
certificate. Using a service like Cloudflare Tunnels or ngrok is recommended.
These provide the secure connection, and facilitate connecting to the server
without needing to configure local networking or DNS.

Once you have installed a tunneling service, configure it to forward requests
to your server on port 8088.

Run `npm run dev` to start the development server.

The site needs to be accessed over HTTPS for the service worker to function.
You can use Cloudflare tunnels, ngrok, or another service to set up a secure
tunnel to your local server. This also makes it easy to test on mobile devices.

### Code formatting

We use Prettier to format source code. This provides a consistent style and
saves time manually formatting code. You can run prettier using provided
scripts, call it manually, or integrate it with your editor.

### Browsers

Google Chrome is recommended for development. It seems to have the best support
for PWAs. 

In the developer console, in the Application tab, you can easily stop
the service worker, clear all storage, or force the app to reset every page
load. Without that setting, you will see an old cached version of both the app
and worker scripts.

With a tunneling service like Cloudflare tunnels, you can also test from mobile
devices, or with iOS simulator and Android Studio, you can test with various
emulated mobile devices. With a bit of configuration, you can attach a desktop
browser to these devices to open a developer console and debug. The specific
steps will vary depending on the host and target operating systems and browsers.

## Scripts

The following scripts are available. They can be run with `npm run <script>`.

- `add_course`: Add a new course JSON file. Described in more detail below.
- `build`: Build the site with production settings.
- `dev`: Combination of `serve` and `watch` for convenience.
- `formatcheck`: Checks code formatting with prettier.
- `formatfix`: Runs the formatter on all files in src. Be careful with it!
- `lint`: Run ESLint on the project.
- `make_course_list`: Generates the list of courses based on the index.txt file.
   Described in more detail below.
- `serve`: Serve the site on port 8088.
- `test`: Run the test suite.
- `typecheck`: Run TypeScript type checking. The build tool, esbuild, builds typescript,
    but disregards type errors.
- `watch`: Watch the project for changes and rebuild automatically.

## Deployment

The site is deployed to Cloudflare Pages. This is done automatically when
changes are merged to the `main` branch.

Depending on the Pages configuration, other branches may be deployed as well.
The other branches will use randomly generated subdomains that are available on the github
pull request page.

## Adding Courses

To add a course, currently you will need to upload the course zip file and then run 
a scripts in your local development copy.

Course zip files are stored in a Cloudflare R2 bucket (similar to AWS S3).  They
are currently uploaded manually in the Cloudflare dashboard. We recommend uploading 
the course zip using the original filename as downloaded from the MIT OCW website, this 
filename is also the course_name.

After uploading, click on the object and locate the URL. Copy that URL and run the 
following task replacing object_url:

```bash
npm run add_course [object_url]
```

This will analyze the zip file and any videos identified in the course and
output a JSON file located at `src/courses/[course-name].json`. Review the
contents of the JSON file. The script attempts to place the videos into
reasonable groups and order them, but this requires metadata that isn't always
present, so you may want to re-organize them.

The script will then automatically import the new course into the project,
This is explained in more detail in the next section.

The course has now been added to your local copy. You can review the newly added 
course using `npm run dev` and loading OCW To Go in your browser. To deploy 
the newly added course(s), merge changes into `main` on Github and Cloudflare 
Pages will automatically update.

## Course List Management

In order to make adding courses and otherwise modifying the course list simple,
we use a small amount of code generation.

Course definitions are stored in .json files in src/courses. The master list of
courses is in src/courses/index.txt. This list is used to generate src/courses/index.ts.

The generation is done by running:

```bash
npm run make_course_list
```

When you add a new course, the file is generated automatically, so you won't
need to run the make_course_list script.  If you wish to remove or re-order
courses, you would edit index.txt and then run make_course_list.

The motivation behind this process is to make managing the course list simple,
while still providing type safety. When the files are imported into index.ts,
they are assigned a type. If there's something wrong with the JSON file, the
compiler or the type checker will detect that, which will prevent application
errors.

## Architecture

OCW To Go is a progressive web app that is intended to work offline. Upon first
load, the application assets are stored in a cache. A service worker script
intercepts incoming requests and serves them from the cache instead of the
network. When courses are downloaded, a zip file is unpacked, and each asset
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

## Development Notes

OCW To Go uses the course downloads directly from the MIT OpenCourseWare website. As we await bug fixes in the Course Downloads, we have applied the following rewrites in OCW To Go:

- ocw-to-go/src/course/fix_file_downloads.ts to fix any level of bad ./static_resources links
- ocw-to-go/src/course/fix_trailing_slashes.ts to adjust the path of the See All links from the Browse Resources (download/index.html) page.
- ocw-to-go/src/course/hide_learning_resource_types.ts to suppress the display of the learning resource type "buttons" as their styling confuses the learner.
- ocw-to-go/src/course/fix_bad_links.ts fix some known bad links
- ocw-to-go/src/course/fix_trailing_slashes.ts fix links from ZIP files to append 'index.html'. for those links that end with [path]/ rather than [path]/index.html 
- ocw-to-go/src/course/auto_expand_resource_list.ts to expand all resource lists and not the somewhat random function across courses

If the browser doesn't support native PDF display, OCW To Go converts PDFs to PNG images for display:
- ocw-to-go/src/course/render_pdfs.ts

OCW To Go makes sitewide UX adjustments to improve mobile usability:
- ocw-to-go/src/course/inject_course_menu_button.ts change styles and text of table of contents button to improve visibility
- ocw-to-go/src/course/make_outside_links_open_in_new_tab.ts target only links without img or similar children to open in a new tab, add icon to orient the user as new tabs on mobile are less obvious than on dektop
- ocw-to-go/src/course/change_course_menu_text.ts replace course menu text to better direct learner action
