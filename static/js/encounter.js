function updateHP(name, hp){

    const form = document.createElement('form');
    form.method = "post";


    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "hp";
    hiddenField.value = hp;
    form.appendChild(hiddenField);

    const hiddenField2 = document.createElement('input');
    hiddenField2.type = 'hidden';
    hiddenField2.name = "name";
    hiddenField2.value = name;
    form.appendChild(hiddenField2);
    
    document.body.appendChild(form);
    form.submit();
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
    this.state = {name: props.name, hp: props.hp, 
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
          <button onClick={() => updateHP(this.state.name, this.state.hp)} className="btn char-row-item">save</button>
          <input value={this.state.init} onChange={this.updateInit.bind(this)} className="input-field char-row-item"/>
          </p>
      </div>
    );
  }
}


let charInfo = (
  <div className="char-encounter-table">
      {enc_chars.map( c => (
          <EncChar key={c.name} name={c.name} hp={c.hp}/>
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
          <button onClick={() => updateMonHP(this.state.id, this.state.hp)} className="btn char-row-item">save</button>
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

