const validPattern = {
    validEName: /^[a-zA-Z_][a-zA-Z0-9_\-]*$/,
    validCName: /^([\\u4e00-\\u9fa5]){2,7}$/,
    validPassWord: /^([0-9]|[a-zA-Z]|[0-9A-Za-z]){6,16}$/, //必须是6-16位字母、数字
    validVcode: /^\d{4}$/, //必须是4位字母和数字
    validMobile: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/, // /^(\\+86|0086)?\\s*(13|15|18)[0-9](\\d{4})(\\d{4})$/,
    validSms: /^\d{6}$/,
    validEmail: /^(\\w)+(\\.\\w+)*@(\\w)+((\\.\\w+)+)$/,
    validIDCard: /(^\\d{15}$)|(^\\d{17})([0-9]|X)$/,
    validMoney: /^[0-9]+(.[0-9]{2})?$/,
    validDate: /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/,
    validDomain: /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})*$/,
    validPath: /^(\/|(\/[_\-a-zA-Z0-9]+)+)$/,
    validUrl: /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/,
    validIP: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    validPort: /^([1-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,  //[1,65535] 闭区间整数
}

export { validPattern }