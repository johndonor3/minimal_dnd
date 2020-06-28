function updateHP(name, delta, encounter_title){

    const form = document.createElement('form');
    form.method = "post";


    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "hp";
    hiddenField.value = delta;
    form.appendChild(hiddenField);

    const hiddenField2 = document.createElement('input');
    hiddenField2.type = 'hidden';
    hiddenField2.name = "name";
    hiddenField2.value = name;
    form.appendChild(hiddenField2);
    
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

  render() {
    return (
      <div className="char-row">
          <p><span className="charName">{this.state.name}  </span>
          <button onClick={() => updateHP(this.state.name, -1)}>-</button>
          <strong> {this.state.hp} </strong>
          <button onClick={() => updateHP(this.state.name, 1)}>+</button>
          <span>   </span>
          <input value={this.state.init} onChange={this.updateInit.bind(this)} />
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
