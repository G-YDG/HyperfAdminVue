export async function blobToFile(
  Blobs = [],
  fileName = 'test.zip',
  fileType = 'application/zip'
) {
  return new File(Blobs, fileName, {
    type: fileType,
  });
}

export function downloadByBlob(
  data: BlobPart,
  filename?: string,
  mime?: string,
  bom?: BlobPart
) {
  const blobData = typeof bom !== 'undefined' ? [bom, data] : [data];
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' });

  const blobURL = window.URL.createObjectURL(blob);
  const downloadElement = document.createElement('a');
  downloadElement.style.display = 'none';
  downloadElement.href = blobURL;
  downloadElement.setAttribute('download', filename || 'file');
  if (typeof downloadElement.download === 'undefined') {
    downloadElement.setAttribute('target', '_blank');
  }
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(blobURL);
}

export function downloadByBlobResponse(
  response: any,
  filename?: string,
  mime?: string
) {
  if (!filename) {
    const matches = response.headers['content-disposition'].match(
      /filename\*=UTF-8''(.+)/gi
    );
    filename = matches ? matches[0].replace(/filename\*=UTF-8''/gi, '') : null;
    if (filename) {
      filename = decodeURIComponent(filename);
    }
  }
  if (!mime) {
    mime = response.headers['content-type'].replace(';charset=utf8', '');
  }
  downloadByBlob(response.data, filename, mime);
}
