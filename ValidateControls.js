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
        IdCard: { 'val': /^\d{15}(\d{2}[A-Za-z0-9\*])?$/, 'msg': '只能输入15位或18位的身份证号码' },
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

        Error: { 'msg': '系统异常！' },
        Success: { 'msg': '操作成功！' }
    },
    /*
     *定义全局变量，用来储存页面上所有要验证标签的默认style内的样式
     */
    OldStyleList: {},
    /*
     *定义全局变量，用来储存页面上所有表单对应提示信息的层
     */
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
    /*
     *将当前标签的默认样式储存到全局变量中
     */
    AddStyleValue: function (strFormKey, strTagKey, vStyle) {
        if (this.OldStyleList[strFormKey] && vStyle) {
            this.OldStyleList[strFormKey][strTagKey] = vStyle;
        }
    },
    /*
     **********************************
     *验证表单的主方法，所有要验证的表单必须且只用调用此方法
     *
     *注：options为空则验证整个页面上控件
     *参数格式 {parentID:'',customName,'',errorShowType:''}
     *      formOrDivID：为form的ID或属于表单功能的容器标签的ID
     *      customName：要验证的标签的自定义名称，写法如validate-data-aaa、validate-data-bbb、validate-data-ccc等
     *      errorShowType:错误信息的显示方式，此参数值的格式为以下几种：
     *          default为默认所验证的控件边框变红，errorShowTyoe参数为空则为此方式验证；
     *          msgButton_Prefix为提示错误信息方式，错误信息显示到提交按钮下面。错误信息为验证规则中[]里边的内容加上验证控件中的内容；
     *          msgButton_All为提示错误信息方式，错误信息显示到提交按钮下面。错误信息为验证规则中[]里边的内容；
     *          msgDiv_Prefix(id)为将错误信息提示到指定的标签中方式，括号必须是英文括号。divId为要显示错误信息的标签。
     *              错误信息为验证规则中[]里边的内容加上验证控件中的内容；
     *          msgDiv_All(id)为将错误信息提示到指定的标签中方式，括号必须是英文括号。divId为要显示错误信息的标签。
     *              错误信息为验证规则中[]里边的内容；
     *          alert_Prefix为以弹出框方式提示错误信息，错误信息为验证规则中[]里边的内容加上验证控件中的内容；
     *          alert_All为以弹出框方式提示错误信息，错误信息为验证规则中[]里边的内容。
     **********************************
     */
    ValidateFun: function (options) {
        //定义验证结果的变量，true为验证通过，false为验证失败
        var vValidateResult = true;

        var strFormKey = '';
        //判断并设置当前表单或表单数据的父容器ID
        var vFormItem = {};
        if (options) {
            vFormItem = document.getElementById(options.formOrDivID);
            strFormKey = options.formOrDivID;
        } else {
            options = {};
            vFormItem = document;
            strFormKey = 'document';
        }
        var vFirstSubmit = this.CheckFirstSubmit(strFormKey);
       
        //查找属于当前表单区别中所有input标签
        var vNodes = vFormItem.getElementsByTagName('input');
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
                    //如果是首次提交表单就将标签原有的默认样式存储
                    if (vFirstSubmit) {
                        this.AddStyleValue(strFormKey, strFormKey + vNodeIndex, vNode.getAttribute('style'));
                    }
                    
                    //验证标签值对应标签中的所有验证类型是否合法
                    var vTypeValues = vValidateTypes.toString().split(' ');
                    var vNodeResult = { success: true };
                    for (var vIndex = 0; vIndex < vTypeValues.length; vIndex++) {
                        vNodeResult = this.ValidateByType(vTypeValues[vIndex], vNode, options.errorShowType);
                        if (!vNodeResult.success) {
                            break;
                        }
                    }
                    //给验证结果赋值，使其同步
                    vValidateResult = vNodeResult.success;
                    //显示错误信息时需要的参数
                    var errorParamsItem = { errorShowType: options.errorShowType, currentNode: vNode, strFormKey: strFormKey, strTagKey: strFormKey + vNodeIndex, formItem: vFormItem }
                    //显示错误信息
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
        //判断验证成功且当前提示信息不为默认方式的就显示成功的信息
        if (vValidateResult && options && options.errorShowType && options.errorShowType != 'default') {
            this.ShowMessageInfo(vNodeResult, errorParamsItem);
        }

        return vValidateResult;
    },
    /***************************
     *根据标签中的验证类型，验证当前标签的值是否合法
     *  vValidateType为当前标签的验证类型
     *  vTagObj当前要验证的标签
     *  errorShowType当前表单的错误提示信息格式
     ***************************
     */
    ValidateByType: function (vValidateType, vTagObj, errorShowType) {
        var vJsonResult = { success: true, msg: '' };
        var vSystemError = false;

        if (/^Char(\[.*\])?$/.test(vValidateType)) {
            if (!vTagObj.value.match(this.RegInfos.Char.val)) {
                vJsonResult.msg = this.RegInfos.Char.msg;
                vJsonResult.success = false;
            }
        } else if (/^Chinese(\[.*\])?$/.test(vValidateType)) {
            if (!vTagObj.value.match(this.RegInfos.Chinese.val)) {
                vJsonResult.msg = this.RegInfos.Chinese.msg;
                vJsonResult.success = false;
            }
        } else if (/^English(\[.*\])?$/.test(vValidateType)) {
            if (!vTagObj.value.match(this.RegInfos.English.val)) {
                vJsonResult.msg = this.RegInfos.English.msg;
                vJsonResult.success = false;
            }
        } else if (/^IdCard(\[.*\])?$/.test(vValidateType)) {
            if (!vTagObj.value.match(this.RegInfos.IdCard.val)) {
                vJsonResult.msg = this.RegInfos.IdCard.msg;
                vJsonResult.success = false;
            }
        } else if (/^Money(\[.*\])?$/.test(vValidateType)) {
            if (!vTagObj.value.match(this.RegInfos.Money.val)) {
                vJsonResult.msg = this.RegInfos.Money.msg;
                vJsonResult.success = false;
            }
        } else if (/^Numer(\[.*\])?$/.test(vValidateType)) {
            if (!vTagObj.value.match(this.RegInfos.Numer.val)) {
                vJsonResult.msg = this.RegInfos.Numer.msg;
                vJsonResult.success = false;
            }
        } else if (/^Phone(\[.*\])?$/.test(vValidateType)) {
            if (!vTagObj.value.match(this.RegInfos.Phone.val)) {
                vJsonResult.msg = this.RegInfos.Phone.msg;
                vJsonResult.success = false;
            }
        } else if (/^Mobile(\[.*\])?$/.test(vValidateType)) {
            if (!vTagObj.value.match(this.RegInfos.Mobile.val)) {
                vJsonResult.msg = this.RegInfos.Mobile.msg;
                vJsonResult.success = false;
            }
        } else if (/^Email(\[.*\])?$/.test(vValidateType)) {
            if (!vTagObj.value.match(this.RegInfos.Email.val)) {
                vJsonResult.msg = this.RegInfos.Email.msg;
                vJsonResult.success = false;
            }
        } else if (/^Url(\[.*\])?$/.test(vValidateType)) {
            if (!vTagObj.value.match(this.RegInfos.Url.val)) {
                vJsonResult.msg = this.RegInfos.Url.msg;
                vJsonResult.success = false;
            }
        } else if (/^Zip(\[.*\])?$/.test(vValidateType)) {
            if (!vTagObj.value.match(this.RegInfos.Zip.val)) {
                vJsonResult.msg = this.RegInfos.Zip.msg;
                vJsonResult.success = false;
            }
        } else if (/^Require(\[.*\])?$/.test(vValidateType)) {
            if (!vTagObj.value.match(this.RegInfos.Require.val)) {
                vJsonResult.msg = this.RegInfos.Require.msg;
                vJsonResult.success = false;
            }
        } else if (/^RequireCompact(\[.*\])?$/.test(vValidateType)) {
            if (!vTagObj.value.match(this.RegInfos.RequireCompact.val)) {
                vJsonResult.msg = this.RegInfos.RequireCompact.msg;
                vJsonResult.success = false;
            }
        } else if (/^RequireTrim(\[.*\])?$/.test(vValidateType)) {
            if (!vTagObj.value.match(this.RegInfos.RequireTrim.val)) {
                vJsonResult.msg = this.RegInfos.RequireTrim.msg;
                vJsonResult.success = false;
            }
        } else {
            vJsonResult.msg = this.RegInfos.Error.msg;
            vJsonResult.success = false;
            vSystemError = true;
        }

        if (!vSystemError && !vJsonResult.success) {
            var strText = /\[.*(?=\])/.exec(vValidateType);
            if (errorShowType && errorShowType != 'default') {
                strText = (strText) ? strText.toString().substr(1) : '';
                if (/^\w*_Prefix(\()?/.test(errorShowType)) {
                    vJsonResult.msg = strText + vJsonResult.msg;
                } else if (/^\w*_All(\()?/.test(errorShowType)) {
                    vJsonResult.msg = strText;
                }
            }
        }

        return vJsonResult;
    },
    /***************************
     *显示错误信息的方法
     *  vNodeResult为当前标签的验证结果
     *  paramsInfo的值为如下：
     *       { errorShowType: '', 当前错误提示信息格式
     *         currentNode: object, 当前标签
     *         strFormKey: '',  存储页面上某个表单中标签的默认样式或提示信息层的键值
     *         strTagKey: '',   存储页面上某个标签默认样式的键值
     *        }
     ***************************
     */
    ShowMessageInfo: function (vNodeResult, paramsInfo) {
        if (!paramsInfo.errorShowType || paramsInfo.errorShowType == 'default') {
            if (vNodeResult.success) {
                if (this.OldStyleList[paramsInfo.strFormKey] && this.OldStyleList[paramsInfo.strFormKey][paramsInfo.strTagKey]) {
                    paramsInfo.currentNode.setAttribute('style', this.OldStyleList[paramsInfo.strFormKey][paramsInfo.strTagKey]);
                } else {
                    paramsInfo.currentNode.removeAttribute('style');
                }
            } else {
                paramsInfo.currentNode.style.borderColor = '#FF0000';
            }
        } else if (/^msgButton_(Prefix|All)$/.test(paramsInfo.errorShowType)) {
            if (this.MsgDivs && this.MsgDivs[paramsInfo.strFormKey]) {
                var vDivItem = document.getElementById(this.MsgDivs[paramsInfo.strFormKey]);
                if (vNodeResult.success) {
                    vDivItem.innerHTML = this.RegInfos.Success.msg;
                } else {
                    vDivItem.innerHTML = vNodeResult.msg;
                }
            } else {
                if (!vNodeResult.success) {
                    var vDivItem = document.createElement("div");
                    vDivItem.setAttribute('id', 'div_validate_' + new Date().getTime());
                    vDivItem.setAttribute('style', 'color:red;');
                    vDivItem.innerHTML = vNodeResult.msg;
                    paramsInfo.formItem.appendChild(vDivItem);

                    this.MsgDivs[paramsInfo.strFormKey] = vDivItem.id;
                }
            }
        } else if (/^msgDiv_(Prefix|All)\(\w+\)$/.test(paramsInfo.errorShowType)) {
            var strDivId = /\(\w+(?=\))/.exec(paramsInfo.errorShowType).toString().substr(1);
            var vDivItem = document.getElementById(strDivId);
            vDivItem.style.display = 'block';
            if (vNodeResult.success) {
                vDivItem.innerHTML = this.RegInfos.Success.msg;
            } else {
                vDivItem.innerHTML = vNodeResult.msg;
            }
        } else if (/^alert_(Prefix|All)$/.test(paramsInfo.errorShowType)) {
            if (vNodeResult.success) {
                alert(this.RegInfos.Success.msg);
            } else {
                alert(vNodeResult.msg);
            }
        }
    }
}