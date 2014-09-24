
ValidateCommon = {
    /*
     **********************************
     *控件中用到的所有正则表达式
     **********************************
     */
    RegInfos: function () {
        //英文字母、数字、下卉线验证
        this.Char = { 'value': /^[A-Za-z0-9_]+$/, 'msg': '允许英文字母、数字、下划线' },
        //纯中文验证
        this.Chinese = { 'value': /^[\u4e00-\u9fa5]+$/, 'msg': '只允许中文' },
        //纯英文字母验证
        this.English = { 'value': /^[A-Za-z]+$/, 'msg': '只允许英文字母' },

        //身份证号验证
        this.IdCard = { 'value': /^\d{15}(\d{2}[A-Za-z0-9\*])?$/, 'msg': '只能输入18位的身份证号码' },
        //金钱格式验证
        this.Money = { 'value': /^(([1-9](\d+)?)|0)(\.\d+)?$/, 'msg': '请输入金额' },
        //纯数字验证
        this.Numer = { 'value': /^\d+$/, 'msg': '请输入数字' },
        //固定电话验证
        this.Phone = { 'value': /^((0\d{2,3})|(\(0\d{2,3}\)))?(-)?[1-9]\d{6,7}(([\-0-9]+)?[^\D]{1})?$/, 'msg': '请输入电话号码' },
        //手机号验证
        this.Mobile = { 'value': /^((0\d{2,3}\d{6,15})|(1[358]{1}\d{9}))$/, 'msg': '请输入手机号码(纯数字)' },
        //Email格式验证
        this.Email = { 'value': /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, 'msg': '格式错误,如test@test.com' },
        //验证URL地址
        this.Url = { 'value': /^http(s)?:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\'\'])*$/, 'msg': '格式错误,如http:\/\/127.0.0.1:80' },
        //验证邮编
        this.Zip = { 'value': /^[1-9]\d{5}$/, 'msg': '邮政编码不存在' },

        //必填
        this.Require = { 'value': /\S+/, 'msg': '必填' },
        //必填且不能有空格
        this.RequireCompact = { 'value': /^\S+$/, 'msg': '必填(无空格)' },
        //前后不能有空格
        this.RequireTrim = { 'value': /(^[^\s]{1}(.+)?[^\s]{1}$)|(^[^\s]{1}$)/, 'msg': '必填(无前后空格)' }
    },
    Messages: function () {
        alert('dddd');
    }
}
