function convertSize(size) {
    // relative to 5ft gridsize
    if (size.toLowerCase() == "tiny") {
        return 0.5
    }
    else if (size.toLowerCase() == "large") {
        return 2
    }
    else if (size.toLowerCase() == "huge") {
        return 3
    }
    else if (size.toLowerCase() == "gargantuan") {
        return 4
    }
    // either small or medium
    else {
        return 1
    }
}

function addMonster(mon, local=true){

    let hp = mon.hit_points;
    let size = convertSize(mon.size);

     if (!Number.isInteger(hp)) {
        alert("Monster not found; try uploading json")
    }

    const form2 = document.createElement('form');
    form2.method = "post";

    const hiddenField3 = document.createElement('input');
    hiddenField3.type = 'hidden';
    hiddenField3.name = "monster_name";
    hiddenField3.value = mon.index;
    form2.appendChild(hiddenField3);

    const hiddenField4 = document.createElement('input');
    hiddenField4.type = 'hidden';
    hiddenField4.name = "monster_hp";
    hiddenField4.value = hp;
    form2.appendChild(hiddenField4);

    const hiddenField5 = document.createElement('input');
    hiddenField5.type = 'hidden';
    hiddenField5.name = "monster_size";
    hiddenField5.value = size;
    form2.appendChild(hiddenField5);

    const hiddenField232 = document.createElement('input');
    hiddenField232.type = 'hidden';
    hiddenField232.name = "local";
    hiddenField232.value = local;
    form2.appendChild(hiddenField232);

    document.body.appendChild(form2);
    form2.submit();
}

function allowLocalMonster(name, mon) {
    let hp = mon.hit_points;
    if (!Number.isInteger(hp)) {
        localMonster(name, addMonster);
    }
    else {
        addMonster(mon, false);
    }
}

function fetchMonster(name) {
    return fetch('http://localhost:3000/api/monsters' + '/' + name)
    .then((response) => response.json())
    .then((mon) => {
        allowLocalMonster(name, mon);
   })
   .catch((error) => {
     console.log("handled: ", error);
    });
}

function checkEncMonster(){
  let monster_name = document.getElementById("addEncMonster").value;
  fetchMonster(monster_name);
}

function removeMonster(mid){

    let form = document.createElement('form');
    form.method = "post";

    let hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "remove_monster";
    hiddenField.value = mid;
    form.appendChild(hiddenField);
    
    document.body.appendChild(form);
    form.submit();
}

class EncChar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: props.name, hp: props.hp, cid: props.cid,
                  init: window.localStorage.getItem(props.name+'init') || ''};
  }

  componentDidUpdate(){
    window.localStorage.setItem(this.state.name+'init', this.state.init);
  }

  updateInit(event){
    let parsed = parseInt(event.target.value);
    if (isNaN(parsed)) {
      this.setState({init: event.target.value});
    }
    else {
      this.setState({init: parsed});
    }
  }

  updateMyHP(event){
    let parsed = parseInt(event.target.value);
    if (isNaN(parsed)) {
      this.setState({hp: event.target.value});
    }
    else {
      this.setState({hp: parsed});
    }
  }

  render() {
    return (
      <div className="char-row">
          <p><span className="charName">{this.state.name}  </span>
          <span>HP: </span>
          <input value={this.state.hp} onChange={this.updateMyHP.bind(this)} className="input-field char-row-item"/>
          <button onClick={() => charUpdate(this.state.cid, 'hp', this.state.hp)} className="btn char-row-item">save</button>
          <input value={this.state.init} onChange={this.updateInit.bind(this)} className="input-field char-row-item"/>
          </p>
      </div>
    );
  }
}


let charInfo = (
  <div className="char-encounter-table">
      {enc_chars.map( c => (
          <EncChar key={c.name} cid={c.id} name={c.name} hp={c.hp}/>
      ))}
  </div>
)

ReactDOM.render(charInfo, document.getElementById('encounter-characters'));


const EncMonsterState = {divs: [], names: []}

function drawTab(monster) {
    if (!EncMonsterState.names.includes(monster.name)) {
        EncMonsterState.names.push(monster.name);
        var newDiv = document.createElement("div")
        monsterEntry(monster, newDiv)
        let cont = document.getElementById("monster-encounter-container")
        cont.appendChild(newDiv)
    }
}

function localMonster(name, targetFunc) {
    var url = '/uploads/' + name + ".json";
    return fetch(url)
    .then((response) => response.json())
    .then((mon) => {
        targetFunc(mon);
   })
   .catch((error) => {
     console.log(error);
     alert("there was a problem with your monster!")
    });
}


function fetchEncMonster(name, local) {
    if (local) {
        localMonster(name, drawTab);
    }
    else {
        dndQuery("monsters", name, drawTab);
    }
}

function updateMonHP(mid, hp){

    const form2 = document.createElement('form');
    form2.method = "post";

    const hiddenField3 = document.createElement('input');
    hiddenField3.type = 'hidden';
    hiddenField3.name = "new_hp";
    hiddenField3.value = hp;
    form2.appendChild(hiddenField3);

    const hiddenField4 = document.createElement('input');
    hiddenField4.type = 'hidden';
    hiddenField4.name = "monster_id";
    hiddenField4.value = mid;
    form2.appendChild(hiddenField4);
    
    document.body.appendChild(form2);
    form2.submit();
}

class EncMonster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: props.name, hp: props.hp, id: props.id, local: props.local,
                  init: window.localStorage.getItem(props.id+'init') || ''};
  }

  componentDidUpdate(){
    window.localStorage.setItem(this.state.id+'init', this.state.init);
  }

  updateInit(event){
    let parsed = parseInt(event.target.value);
    if (isNaN(parsed)) {
      this.setState({init: event.target.value});
    }
    else {
      this.setState({init: parsed});
    }  
  }

  updateMyHP(event){
    let parsed = parseInt(event.target.value);
    if (isNaN(parsed)) {
      this.setState({hp: event.target.value});
    }
    else {
      this.setState({hp: parsed});
    }  
  }

  render() {
    return (
      <div className="char-row">
          <p>
          <span onClick={() => fetchEncMonster(this.state.name, this.state.local)} className="charName monster-name">
          {this.state.name}
          <button onClick={() => removeMonster(this.state.id)} className="btn">x</button>
          </span>
          <span>HP: </span>
          <input value={this.state.hp} onChange={this.updateMyHP.bind(this)} className="input-field char-row-item"/>
          <button onClick={() => monUpdate(this.state.id, 'hp', this.state.hp)} className="btn char-row-item">save</button>
          <input value={this.state.init} onChange={this.updateInit.bind(this)} className="input-field char-row-item"/>
          </p>
      </div>
    );
  }
}

let monsterInfo = (
  <div className="monster-encounter-table">
      {enc_monsters.map( c => (
          <EncMonster key={c.id} id={c.id} name={c.name} hp={c.hp} local={c.local}/>
      ))}
  </div>
)

ReactDOM.render(monsterInfo, document.getElementById('encounter-monsters'));

