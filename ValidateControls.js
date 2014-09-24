/*
 ****************************
 *所有要验证的标签上必须添加属性validate-data或validate-data-开头的属性，
 *属性的值为ValidateControl.RegInfos中的值区分大小写。
 ****************************
 */

ValidateControl = {
    /*
     **********************************
     *控件中用到的所有正则表达式
     **********************************
     */
    RegInfos: {
        //英文字母、数字、下卉线验证
        Char: { 'val': /^[A-Za-z0-9_]+$/, 'msg': '允许英文字母、数字、下划线' },
        //纯中文验证
        Chinese: { 'val': /^[\u4e00-\u9fa5]+$/, 'msg': '只允许中文' },
        //纯英文字母验证
        English: { 'val': /^[A-Za-z]+$/, 'msg': '只允许英文字母' },

        //身份证号验证
        IdCard: { 'val': /^\d{15}(\d{2}[A-Za-z0-9\*])?$/, 'msg': '只能输入18位的身份证号码' },
        //金钱格式验证
        Money: { 'val': /^(([1-9](\d+)?)|0)(\.\d+)?$/, 'msg': '请输入金额' },
        //纯数字验证
        Numer: { 'val': /^\d+$/, 'msg': '请输入数字' },
        //固定电话验证
        Phone: { 'val': /^((0\d{2,3})|(\(0\d{2,3}\)))?(-)?[1-9]\d{6,7}(([\-0-9]+)?[^\D]{1})?$/, 'msg': '请输入电话号码' },
        //手机号验证
        Mobile: { 'val': /^((0\d{2,3}\d{6,15})|(1[358]{1}\d{9}))$/, 'msg': '请输入手机号码(纯数字)' },
        //Email格式验证
        Email: { 'val': /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, 'msg': '格式错误,如test@test.com' },
        //验证URL地址
        Url: { 'val': /^http(s)?:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\'\'])*$/, 'msg': '格式错误,如http:\/\/127.0.0.1:80' },
        //验证邮编
        Zip: { 'val': /^[1-9]\d{5}$/, 'msg': '邮政编码不存在' },

        //必填
        Require: { 'val': /\S+/, 'msg': '必填' },
        //必填且不能有空格
        RequireCompact: { 'val': /^\S+$/, 'msg': '必填(无空格)' },
        //前后不能有空格
        RequireTrim: { 'val': /(^[^\s]{1}(.+)?[^\s]{1}$)|(^[^\s]{1}$)/, 'msg': '必填(无前后空格)' }
    },
    /*
     *定义全局变量，用来储存页面上所有标签的默认style内的样式
     */
    OldStyleList: {},
    /*
     **********************************
     *判断用户是否为第一次验证
     *此方法为了添加页面上默认样式用
     **********************************
     */
    CheckFirstSubmit: function (strFormKey) {
        var vResult = false;
        if (!this.OldStyleList) {
            this.OldStyleList = new Array();
            this.OldStyleList[strFormKey] = new Array();
            vResult = true;
        } else {
            if (!this.OldStyleList[strFormKey]) {
                this.OldStyleList[strFormKey] = new Array();
                vResult = true;
            }
        }
        return vResult;
    },
    AddStyleValue: function (strFormKey, strTagKey, vStyle) {
        if (this.OldStyleList[strFormKey]) {
            this.OldStyleList[strFormKey][strTagKey] = vStyle;
        }
    },
    /*
     **********************************
     *注：options为空则验证整个页面上控件
     *
     *参数格式 {'parentID':'','customName',''}
     *
     *      parentID：为form的ID或属于表单功能的容器标签的ID；
     *      customName：要验证的标签的自定义名称，写法如validate-data-aaa、validate-data-bbb、validate-data-ccc等
     *     
     **********************************
     */
    ValidateFun: function (options) {
        //定义验证结果的变量，true为验证通过，false为验证失败
        var vValidateResult = true;

        var strFormKey = '';
        //判断并设置当前表单或表单数据的父容器ID
        var vParent = {};
        if (options) {
            vParent = document.getElementById(options.parentID);
            strFormKey = options.parentID;
        } else {
            vParent = document;
            strFormKey = 'document';
        }
        var vFirstSubmit = this.CheckFirstSubmit(strFormKey);

        //查找属于当前表单区别中所有input标签
        var vNodes = vParent.getElementsByTagName('input');
        for (var vNodeIndex = 0; vNodeIndex < vNodes.length; vNodeIndex++) {
            var vNode = vNodes[vNodeIndex];
            if (vNode) {
                var vElementTypeName = 'validate-data';
                if (options && options.customName) {
                    vElementTypeName += '-' + options.customName;
                }
                //获得当前标签
                var vValidateTypes = vNode.getAttribute(vElementTypeName);
                if (vValidateTypes) {
                    if (vFirstSubmit) {
                        this.AddStyleValue(strFormKey, strFormKey + vNodeIndex, vNode.getAttribute('style'));
                    }

                    var vTypeValues = vValidateTypes.toString().split(' ');
                    var vResult = true;
                    for (var vIndex = 0; vIndex < vTypeValues.length; vIndex++) {
                        if (!this.ValidateByType(vTypeValues[vIndex], vNode)) {
                            vResult = false;
                        }
                    }

                    if (vResult) {
                        if (this.OldStyleList[strFormKey]) {
                            if (this.OldStyleList[strFormKey][strFormKey + vNodeIndex]) {
                                vNode.setAttribute('style', this.OldStyleList[strFormKey][strFormKey + vNodeIndex]);
                            } else {
                                vNode.removeAttribute('style');
                            }
                        }
                    } else {
                        vNode.style.borderColor = '#FF0000';
                        vValidateResult = false;
                    }
                }
            }
        }

        return vValidateResult;
    },
    ValidateByType: function (vValidateType, vTagObj) {
        var vResult = true;
        switch (vValidateType) {
            case 'Char':
                if (!vTagObj.value.match(this.RegInfos.Char.val)) {
                    vResult = false;
                }
                break;
            case 'Chinese':
                if (!vTagObj.value.match(this.RegInfos.Chinese.val)) {
                    vResult = false;
                }
                break;
            case 'English':
                if (!vTagObj.value.match(this.RegInfos.English.val)) {
                    vResult = false;
                }
                break;
            case 'IdCard':
                if (!vTagObj.value.match(this.RegInfos.IdCard.val)) {
                    vResult = false;
                }
                break;
            case 'Money':
                if (!vTagObj.value.match(this.RegInfos.Money.val)) {
                    vResult = false;
                }
            case 'Numer':
                if (!vTagObj.value.match(this.RegInfos.Numer.val)) {
                    vResult = false;
                }
                break;
            case 'Phone':
                if (!vTagObj.value.match(this.RegInfos.Phone.val)) {
                    vResult = false;
                }
                break;
            case 'Mobile':
                if (!vTagObj.value.match(this.RegInfos.Mobile.val)) {
                    vResult = false;
                }
                break;
            case 'Email':
                if (!vTagObj.value.match(this.RegInfos.Email.val)) {
                    vResult = false;
                }
                break;
            case 'Url':
                if (!vTagObj.value.match(this.RegInfos.Url.val)) {
                    vResult = false;
                }
                break;
            case 'Zip':
                if (!vTagObj.value.match(this.RegInfos.Zip.val)) {
                    vResult = false;
                }
                break;
            case 'Require':
                if (!vTagObj.value.match(this.RegInfos.Require.val)) {
                    vResult = false;
                }
                break;
            case 'RequireCompact':
                if (!vTagObj.value.match(this.RegInfos.RequireCompact.val)) {
                    vResult = false;
                }
                break;
            case 'RequireTrim':
                if (!vTagObj.value.match(this.RegInfos.RequireTrim.val)) {
                    vResult = false;
                }
                break;
        }

        return vResult;
    }
}