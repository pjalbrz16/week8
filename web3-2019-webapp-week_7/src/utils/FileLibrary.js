const { ipcRenderer } = window.require('electron')
const IPC_MAIN_UPLOAD_PROGRESS_BAR = "GalleryUploadProgressBar"

export const extractFileContent = (event, MAX_SIZE = 1048576, fileType) => {
  return new Promise((resolve, reject) => {
    const fileToExtract = event.target.files[0];
    let regex;
    if (fileType !== undefined) {
      regex = new RegExp("^(" + fileType + ")", "i");      
    }
    if ((regex && fileToExtract.type.match(regex)) || fileType === undefined) {
      var reader = new FileReader();

      if (fileToExtract.size <= MAX_SIZE) {        
        reader.onerror = () => {
          ipcRenderer.send(IPC_MAIN_UPLOAD_PROGRESS_BAR, -1)
          reader.abort();
          reject(new Error("Problem parsing input file."));
        };

        reader.onloadstart = () => {
          ipcRenderer.send(IPC_MAIN_UPLOAD_PROGRESS_BAR, 0)
        }

        reader.onload = (e) => {
          resolve(e.target.result);
        };

        reader.onprogress = (e) => {
          ipcRenderer.send(IPC_MAIN_UPLOAD_PROGRESS_BAR, e.loaded/e.total)
        }

        reader.onloadend = (e) => {
          ipcRenderer.send(IPC_MAIN_UPLOAD_PROGRESS_BAR, -1)
        }

        reader.readAsDataURL(fileToExtract);

      } else {
        reject(
          new Error(
            "Your file is too large (" +
              fileToExtract.size / MAX_SIZE +
              " MB). Please upload a file < " + MAX_SIZE 
          )
        );
      }
    } else {
      reject(
        new Error("Your file type is not the right one (" + fileType + ").")
      );
    }
  });
};
