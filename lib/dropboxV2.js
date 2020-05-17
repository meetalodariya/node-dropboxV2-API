const dropboxV2Api = require("dropbox-v2-api");
const config = require("config");
const consts = require("../lib/configConstants");
const fs = require("fs");
const path = require("path");

const dropbox = dropboxV2Api.authenticate({
  token: config.get(consts.DROPBOX_ACCESS_TOKEN),
});

class DBX {
  static downloadFile(sourcePathInApp, targetPathFromRoot) {
    dropbox(
      {
        resource: consts.dropboxResources.file_download,
        parameters: {
          path: sourcePathInApp,
        },
      },
      (err, result, response) => {
        if (err) {
          return console.log(err);
        }
        return result;
      }
    ).pipe(
      fs.createWriteStream(path.join(__dirname, "../", targetPathFromRoot))
    );
  }

  static uploadFile(targetPathInApp, sourcePathFromRoot) {
    dropbox(
      {
        resource: consts.dropboxResources.file_upload,
        parameters: {
          path: targetPathInApp,
        },
        readStream: fs.createReadStream(
          path.join(__dirname, "../", sourcePathFromRoot)
        ),
      },
      (err, result, response) => {
        return result;
      }
    );
  }

  static combinedStreams(sourceFilePath, targetFilePath) {
    const downloadStream = dropbox({
      resource: consts.dropboxResources.file_download,
      parameters: { path: sourceFilePath },
    });

    const uploadStream = dropbox(
      {
        resource: consts.dropboxResources.file_upload,
        parameters: { path: targetFilePath },
      },
      (err, result, response) => {}
    );
    downloadStream.pipe(uploadStream);
  }
}

module.exports = DBX;
