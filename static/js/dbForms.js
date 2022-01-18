function locUpdate(id, eid, x, y, monster){
    var form = document.createElement('form');
    form.method = "post";
    form.action = "/db/locUpdate/";

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

function charUpdate(id, attr, val){
    var form = document.createElement('form');
    form.method = "post";
    form.action = "/db/charUpdate/";

    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "id";
    hiddenField.value = id;
    form.appendChild(hiddenField);

    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "attr";
    hiddenField.value = attr;
    form.appendChild(hiddenField);

    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "val";
    hiddenField.value = val;
    form.appendChild(hiddenField);

    var iframe = document.createElement('iframe');

    iframe.style.cssText = 'width: 1px;height: 1px;position: absolute;top: -10px;left: -10px';

    document.body.appendChild(iframe);

    iframe.contentDocument.body.appendChild(form);

    form.submit();
}

function monUpdate(id, attr, val){
    var form = document.createElement('form');
    form.method = "post";
    form.action = "/db/monUpdate/";

    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "id";
    hiddenField.value = id;
    form.appendChild(hiddenField);

    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "attr";
    hiddenField.value = attr;
    form.appendChild(hiddenField);

    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "val";
    hiddenField.value = val;
    form.appendChild(hiddenField);

    var iframe = document.createElement('iframe');

    iframe.style.cssText = 'width: 1px;height: 1px;position: absolute;top: -10px;left: -10px';

    document.body.appendChild(iframe);

    iframe.contentDocument.body.appendChild(form);

    form.submit();
}

function purseUpdate(cid, nom, val){
    var form = document.createElement('form');
    form.method = "post";
    form.action = "/db/purseUpdate/";

    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "cid";
    hiddenField.value = cid;
    form.appendChild(hiddenField);

    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "nom";
    hiddenField.value = nom;
    form.appendChild(hiddenField);

    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "val";
    hiddenField.value = val;
    form.appendChild(hiddenField);

    var iframe = document.createElement('iframe');

    iframe.style.cssText = 'width: 1px;height: 1px;position: absolute;top: -10px;left: -10px';

    document.body.appendChild(iframe);

    iframe.contentDocument.body.appendChild(form);

    form.submit();
}

function itemUpdateCnt(cid, item, cnt){
    var form = document.createElement('form');
    form.method = "post";
    form.action = "/db/itemUpdate/";

    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "cid";
    hiddenField.value = cid;
    form.appendChild(hiddenField);

    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "item";
    hiddenField.value = item;
    form.appendChild(hiddenField);

    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "cnt";
    hiddenField.value = cnt;
    form.appendChild(hiddenField);

    var iframe = document.createElement('iframe');

    iframe.style.cssText = 'width: 1px;height: 1px;position: absolute;top: -10px;left: -10px';

    document.body.appendChild(iframe);

    iframe.contentDocument.body.appendChild(form);

    form.submit();
}

function terrainUpdate(eid, x, y, width, height, tid=-1){
    var form = document.createElement('form');
    form.method = "post";
    form.action = "/db/terrainUpdate/";

    if (tid > 0) {
        var hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = "tid";
        hiddenField.value = tid;
        form.appendChild(hiddenField);
    }

    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "eid";
    hiddenField.value = eid;
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

    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "width";
    hiddenField.value = width;
    form.appendChild(hiddenField);

    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "height";
    hiddenField.value = height;
    form.appendChild(hiddenField);

    var iframe = document.createElement('iframe');

    iframe.style.cssText = 'width: 1px;height: 1px;position: absolute;top: -10px;left: -10px';

    document.body.appendChild(iframe);

    iframe.contentDocument.body.appendChild(form);

    form.submit();
}
