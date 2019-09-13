class AbilTable extends React.Component {

  createTable = () => {
    let table = []

    let children = []
      //Inner loop to create children
    children.push(<th width="80">abil</th>)
    children.push(<th width="35"></th>)
    children.push(<th width="20">mod</th>)
    //Create the parent and add the children
    table.push(<tr>{children}</tr>)

    for (let i = 0; i < j_abils.length; i++) {
        let children = []
        children.push(<td>{j_abils[i].abil}  </td>)
        children.push(<td>{j_abils[i].score}  </td>)
        children.push(<td>{j_abils[i].mod}</td>)
        //Create the parent and add the children
        table.push(<tr>{children}</tr>)
    }
    return table
  }

  render() {
    return(
      <table>
        {this.createTable()}
      </table>
    )
  }
}


class Coin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {nom: props.nom, val: props.val};
  }

  test(){
    var newCoin = prompt("Enter new value for "+this.state.nom, this.state.val);
    console.log(newCoin, this.state.nom, this.state.val);
  }

  render() {
    return (
      <p>
        <b>{this.state.nom}</b>: {this.state.val}
        <button onClick={this.test.bind(this)}>$</button>
      </p>

    );
  }
}

const purse = (
  <div>
  {j_purse.map(item => (<Coin key={item.coin} nom={item.coin} val={item.val}/>)
    )}
  </div>
)


const Table = AbilTable
ReactDOM.render(<Table />, document.getElementById('abil_table'));

ReactDOM.render(purse, document.getElementById('purse_table'));
