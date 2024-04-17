# makesense.ai JavaScript Conversion

This repo is a converted version of [makesense.ai](https://www.makesense.ai), where I automated the conversion from TypeScript to JavaScript.

## Steps to Convert

### 1. Remove TypeScript Packages

First, remove all TypeScript-related packages from `package.json`:

```bash
npm remove typescript
npm remove @types/node
npm remove @types/react
...
```
# Add other packages as necessary
2. Remove TypeScript Configuration File
Remove the tsconfig.json file from your project directory.

3. Use Script to Convert TypeScript to JavaScript
Use the following script to convert TypeScript code to JavaScript. I have used transform tools for this purpose and it worked very well:

```javascript
#!/usr/bin/env node
var dir = require('node-dir');
const fs = require('fs');

async function run() {
  dir.readFiles(__dirname, {
    excludeDir: ['node_modules'],
    match: /\.(ts|tsx)$/,
  }, function(err, content, filename, next) {
    if (err) throw err;

    const response = fetch('https://transform.tools/api/typescript-to-javascript', {
      method: "POST",
      body: content,
    }).then((response) => {
      response.text().then((value) => {
        fs.writeFile(filename, value, err => {
          if (err) {
            console.error(err);
          }
        });
      })
    })

    next();
  }, function(err, files) {
    if (err) throw err;
    console.log('finished reading files:');
  });
}
run();
```
4. Rename Files
Just a bit of bash to change our .ts files to .js and our .tsx to .jsx:

```bash
find ./ -depth -name "*.ts" -exec sh -c 'mv "$1" "${1%.ts}.js"' _ {} \;
```
```bash
find ./ -depth -name "*.tsx" -exec sh -c 'mv "$1" "${1%.tsx}.jsx"' _ {} \;
```bash
```
5. Build and Fix
Run your build step and see what's broken, then fix accordingly.
