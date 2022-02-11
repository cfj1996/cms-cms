const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const distDir = path.join(__dirname, '../dist/');
const outputPath = path.join(__dirname, '../dist.zip');
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 },
});
output.on('close', function () {
  console.log(archive.pointer() + ' total bytes');
});

archive.on('error', function (err) {
  throw err;
});

archive.pipe(output);
archive.directory(distDir, false);
archive.finalize();
