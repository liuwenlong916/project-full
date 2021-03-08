self.importScripts("spark-md5.min.js");

self.onmessage = e => {
  // 接受主线程传递的数据
  const { chunks } = e.data;

  const spark = new self.SparkMD5.ArrayBuffer();

  let progress = 0;
  let count = 0;
  const loadNext = index => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(chunks[index].file);
    reader.onload = e => {
      count += 1;
      spark.append(e.target.result);
      //上传完成
      if (count == chunks.length) {
        self.postMessage({
          progress: 100,
          hash: spark.end()
        });
      } else {
        progress += 100 / chunks.length;
        self.postMessage({ progress });
        loadNext(count);
      }
    };
  };

  loadNext(0);
};
