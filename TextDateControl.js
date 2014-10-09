

window.onload = function () { TextDate.ResetStyle() };

TextDate = {
    ResetStyle: function () {
        var vItems = document.getElementsByTagName('input');
        if (!vItems) {
            return;
        }
        for (var i = 0; i < vItems.length; i++) {
            var vItem = vItems[i];
            if (vItem.getAttribute('type') == 'date') {
                alert(vItem);
            }
        }
    }
}