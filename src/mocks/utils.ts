export async function fetchAsBytes(url: string): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    console.log("utils.fetchAsBytes", url);
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "arraybuffer";
    xhr.onload = () => {
      const status = xhr.status;
      if (status === 200) {
        resolve(new Uint8Array(xhr.response as ArrayBuffer));
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
}
