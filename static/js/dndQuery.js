function dndQuery(cat, name, targetFunc){
    var result = null;
    var url = 'http://localhost:3000/api/' + cat + '/' + name;
    console.log(url);
    try {
        $.getJSON(url, targetFunc)
        }
    catch (err) {
        alert("invalid db request!")
        }
    }

