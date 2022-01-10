function locUpdate(id, eid, x, y, monster){
    var form = document.createElement('form');
    form.method = "post";
    form.action = "/locUpdate/";

    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "id";
    hiddenField.value = id;
    form.appendChild(hiddenField);

    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "x";
    hiddenField.value = x;
    form.appendChild(hiddenField);

    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "y";
    hiddenField.value = y;
    form.appendChild(hiddenField);

    if(!monster){
        var hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = "eid";
        hiddenField.value = eid;
        form.appendChild(hiddenField);
    }

    var iframe = document.createElement( 'iframe' );

    iframe.style.cssText = 'width: 1px;height: 1px;position: absolute;top: -10px;left: -10px';

    document.body.appendChild( iframe );

    iframe.contentDocument.body.appendChild( form );

    form.submit();
}