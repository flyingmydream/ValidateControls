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
        RequireTrim: { 'val': /(^[^\s]{1}(.+)?[^\s]{1}$)|(^[^\s]{1}$)/, 'msg': '必填(无前后空格)' },

        Success: { 'msg': '操作成功！' }
    },
    /*
     *定义全局变量，用来储存页面上所有标签的默认style内的样式
     */
    OldStyleList: {},
    MsgDivs: {},
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

        if (!this.MsgDivs) {
            this.MsgDivs = new Array();
        }
        return vResult;
    },
    AddStyleValue: function (strFormKey, strTagKey, vStyle) {
        if (this.OldStyleList[strFormKey] && vStyle) {
            this.OldStyleList[strFormKey][strTagKey] = vStyle;
        }
    },
    /*
     **********************************
     *注：options为空则验证整个页面上控件
     *
     *参数格式 {parentID:'',customName,'',submitBtn:object,errorShowType:''}
     *
     *      parentID：为form的ID或属于表单功能的容器标签的ID
     *      customName：要验证的标签的自定义名称，写法如validate-data-aaa、validate-data-bbb、validate-data-ccc等
     *      submitBtn:表示当前用来提交表彰的按钮,为Object类型
     *      errorShowType:错误信息的显示方式，此参数值的格式为以下几种：
     *          default为默认所验证的控件边框变红，errorShowTyoe参数为空则为此方式验证；
     *          msgButton为提示错误信息方式，错误信息显示到提交按钮上面；
     *          msgDiv(id)为将错误信息提示到指定的标签中方式，括号必须是英文括号。divId为要显示错误信息的标签；
     *          alert为以弹出框方式提示错误信息。
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
                //获得当前标签要验证的类型
                var vValidateTypes = vNode.getAttribute(vElementTypeName);
                if (vValidateTypes) {
                    //如果是首次提交表单就将，标签原有的默认样式存储
                    if (vFirstSubmit) {
                        this.AddStyleValue(strFormKey, strFormKey + vNodeIndex, vNode.getAttribute('style'));
                    }

                    var vTypeValues = vValidateTypes.toString().split(' ');
                    var vNodeResult = { success: true };
                    for (var vIndex = 0; vIndex < vTypeValues.length; vIndex++) {
                        vNodeResult = this.ValidateByType(vTypeValues[vIndex], vNode);
                        if (!vNodeResult.success) {
                            break;
                        }
                    }
                    vValidateResult = vNodeResult.success;
                    var errorParamsItem = { errorShowType: options.errorShowType, currentNode: vNode, strFormKey: strFormKey, strTagKey: strFormKey + vNodeIndex, submitBtn: options.submitBtn }

                    if (!options || !options.errorShowType || options.errorShowType == 'default') {
                        this.ShowMessageInfo(vNodeResult, errorParamsItem);
                    } else {
                        if (!vNodeResult.success) {
                            this.ShowMessageInfo(vNodeResult, errorParamsItem);
                            break;
                        }
                    }
                }
            }
        }
        if (vValidateResult && options && options.errorShowType && options.errorShowType != 'default') {
            this.ShowMessageInfo(vNodeResult, errorParamsItem);
        }

        return vValidateResult;
    },
    ValidateByType: function (vValidateType, vTagObj) {
        var vJsonResult = { success: true, msg: '' };
        switch (vValidateType) {
            case 'Char':
                if (!vTagObj.value.match(this.RegInfos.Char.val)) {
                    vJsonResult.msg = this.RegInfos.Char.msg;
                    vJsonResult.success = false;
                }
                break;
            case 'Chinese':
                if (!vTagObj.value.match(this.RegInfos.Chinese.val)) {
                    vJsonResult.msg = this.RegInfos.Chinese.msg;
                    vJsonResult.success = false;
                }
                break;
            case 'English':
                if (!vTagObj.value.match(this.RegInfos.English.val)) {
                    vJsonResult.msg = this.RegInfos.English.msg;
                    vJsonResult.success = false;
                }
                break;
            case 'IdCard':
                if (!vTagObj.value.match(this.RegInfos.IdCard.val)) {
                    vJsonResult.msg = this.RegInfos.IdCard.msg;
                    vJsonResult.success = false;
                }
                break;
            case 'Money':
                if (!vTagObj.value.match(this.RegInfos.Money.val)) {
                    vJsonResult.msg = this.RegInfos.Money.msg;
                    vJsonResult.success = false;
                }
            case 'Numer':
                if (!vTagObj.value.match(this.RegInfos.Numer.val)) {
                    vJsonResult.msg = this.RegInfos.Numer.msg;
                    vJsonResult.success = false;
                }
                break;
            case 'Phone':
                if (!vTagObj.value.match(this.RegInfos.Phone.val)) {
                    vJsonResult.msg = this.RegInfos.Phone.msg;
                    vJsonResult.success = false;
                }
                break;
            case 'Mobile':
                if (!vTagObj.value.match(this.RegInfos.Mobile.val)) {
                    vJsonResult.msg = this.RegInfos.Mobile.msg;
                    vJsonResult.success = false;
                }
                break;
            case 'Email':
                if (!vTagObj.value.match(this.RegInfos.Email.val)) {
                    vJsonResult.msg = this.RegInfos.Email.msg;
                    vJsonResult.success = false;
                }
                break;
            case 'Url':
                if (!vTagObj.value.match(this.RegInfos.Url.val)) {
                    vJsonResult.msg = this.RegInfos.Url.msg;
                    vJsonResult.success = false;
                }
                break;
            case 'Zip':
                if (!vTagObj.value.match(this.RegInfos.Zip.val)) {
                    vJsonResult.msg = this.RegInfos.Zip.msg;
                    vJsonResult.success = false;
                }
                break;
            case 'Require':
                if (!vTagObj.value.match(this.RegInfos.Require.val)) {
                    vJsonResult.msg = this.RegInfos.Require.msg;
                    vJsonResult.success = false;
                }
                break;
            case 'RequireCompact':
                if (!vTagObj.value.match(this.RegInfos.RequireCompact.val)) {
                    vJsonResult.msg = this.RegInfos.RequireCompact.msg;
                    vJsonResult.success = false;
                }
                break;
            case 'RequireTrim':
                if (!vTagObj.value.match(this.RegInfos.RequireTrim.val)) {
                    vJsonResult.msg = this.RegInfos.RequireTrim.msg;
                    vJsonResult.success = false;
                }
                break;
        }

        return vJsonResult;
    },
    ShowMessageInfo: function (vNodeResult, paramsInfo) {
        if (vNodeResult.success) {
            if (!paramsInfo.errorShowType || paramsInfo.errorShowType == 'default') {
                if (this.OldStyleList[paramsInfo.strFormKey]) {
                    if (this.OldStyleList[paramsInfo.strFormKey][paramsInfo.strTagKey]) {
                        paramsInfo.currentNode.setAttribute('style', this.OldStyleList[paramsInfo.strFormKey][paramsInfo.strTagKey]);
                    } else {
                        paramsInfo.currentNode.removeAttribute('style');
                    }
                }
            } else if (paramsInfo.errorShowType == 'msgButton') {
                if (this.MsgDivs && this.MsgDivs[paramsInfo.strFormKey]) {
                    var vDivItem = paramsInfo.submitBtn.parentNode.querySelector('#' + this.MsgDivs[paramsInfo.strFormKey]);
                    vDivItem.innerHTML = this.RegInfos.Success.msg;
                }
            } else if (paramsInfo.errorShowType.match('/^msgDiv\(.+\)$/')) {
                var strDivId = paramsInfo.errorShowType.substring(paramsInfo.errorShowType.indexOf('(') + 1, paramsInfo.errorShowType.lastIndexOf(')'));
                document.querySelector('#' + strDivId).innerHTML = this.RegInfos.Success.msg;
            } else if (paramsInfo.errorShowType == 'alert') {
                alert(this.RegInfos.Success.msg);
            }
        } else {
            console.log(paramsInfo.errorShowType);
            if (!paramsInfo.errorShowType || paramsInfo.errorShowType == 'default') {
                paramsInfo.currentNode.style.borderColor = '#FF0000';
            } else if (paramsInfo.errorShowType == 'msgButton') {
                if (this.MsgDivs && this.MsgDivs[paramsInfo.strFormKey]) {
                    var vDivItem = paramsInfo.submitBtn.parentNode.querySelector('#' + this.MsgDivs[paramsInfo.strFormKey]);
                    vDivItem.innerHTML = vNodeResult.msg;
                } else {
                    var vDivItem = document.createElement("div");
                    vDivItem.setAttribute('id', 'div_validate_' + new Date().getTime());
                    vDivItem.setAttribute('style', 'color:red;');
                    vDivItem.innerHTML = vNodeResult.msg;
                    paramsInfo.submitBtn.parentNode.appendChild(vDivItem);

                    this.MsgDivs[paramsInfo.strFormKey] = vDivItem.id;
                }
            } else if (paramsInfo.errorShowType.match('^msgDiv\(.+\)$')) {
                var strDivId = paramsInfo.errorShowType.substring(paramsInfo.errorShowType.indexOf('(')+1, paramsInfo.errorShowType.lastIndexOf(')'));
                document.querySelector('#' + strDivId).innerHTML = vNodeResult.msg;
                
            } else if (paramsInfo.errorShowType == 'alert') {
                alert(vNodeResult.msg);
            }
        }
    }
}