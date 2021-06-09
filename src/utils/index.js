function param(json) {
  if (!json) return ''
  return Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key])
  }).join('&')
}

function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

function param3Obj(body) {
  if (!body) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(body).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

function strAfterCut(strs, point) {
  return strs.substring(strs.indexOf(point) + 1);
}

function isEmptyValue (value) {
  return value === null || value === undefined || value === ''
}

function formatDataTime (t, fmt = 'yyyy-MM-dd hh:mm:ss') {
  let o = {
    'M+': t.getMonth() + 1,
    'd+': t.getDate(),
    'h+': t.getHours(),
    'm+': t.getMinutes(),
    's+': t.getSeconds(),
    'q+': Math.floor((t.getMonth() + 3) / 3),
    'S': t.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (t.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

function downloadElement(blob, filename, reader) {
  let blobURL;
  // 创建a标签，用于跳转至下载链接
  const tempLink = document.createElement('a')
  tempLink.style.display = 'none'

  if (reader) {
    // 生成的base64编码
    blobURL = reader.result
  } else {
    // 创建新的URL并指向File对象或者Blob对象的地址
    blobURL = window.URL.createObjectURL(blob)
  }
  
  tempLink.href = blobURL
  tempLink.setAttribute('download', decodeURI(filename))
  // 兼容：某些浏览器不支持HTML5的download属性
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank')
  }
  // 挂载a标签
  document.body.appendChild(tempLink)
  tempLink.click()
  document.body.removeChild(tempLink)
  if (!reader) {
    // 释放blob URL地址
    window.URL.revokeObjectURL(blobURL)
  }
}

function convertRes2Blob(response, type) {
  // 提取文件名
  // const fileName = response.headers['content-disposition'].match(/filename=(.*)/)[1]
  const fileName = encodeURI(response.config.url.split('/').pop())
  // 将二进制流转为blob
  const streamBlob = new Blob([response.data], { type: 'application/octet-stream' })
  if (type === 'read') {
    let fileReader = new FileReader();
    // const zipBlob = new Blob([response.data], {type: 'application/zip'});
    // 传入被读取的blob对象
    fileReader.readAsDataURL(streamBlob)
    fileReader.onload = function() {
      try {
        let jsonData = JSON.parse(response.data);
        if (jsonData.code) {
          console.log(jsonData.msg)
        }
      } catch (err) {   // 解析成对象失败，说明是正常的文件流
        downloadElement(streamBlob, fileName, fileReader)
      }
    };
    // fileReader.readAsText(streamBlob)
  } else {
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
      window.navigator.msSaveBlob(streamBlob, decodeURI(fileName))
    } else {
      downloadElement(streamBlob, fileName)
    }
  }
}

export { param, param2Obj, param3Obj, strAfterCut, isEmptyValue, formatDataTime, convertRes2Blob }
