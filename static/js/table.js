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

class Purse extends React.Component {

  createTable = () => {
    let table = []
    let children = []
    children.push(<th width="40"></th>)
    children.push(<th width="20"></th>)

    table.push(<tr>{children}</tr>)

    for (let i = 0; i < j_purse.length; i++) {
        let children = []
        //Inner loop to create children
        children.push(<td> <b>{j_purse[i].coin}</b>  </td>)
        children.push(<td> {j_purse[i].val}  </td>)
        //Create the parent and add the children
        table.push(<tr>{children}</tr>)
    }
    return table
  }

  render() {
    return(
      <table>
      <tbody>
        {this.createTable()}
      </tbody>
      </table>
    )
  }
}

const Element = Purse
ReactDOM.render(<Element />, document.getElementById('purse_table'));

const Table = AbilTable
ReactDOM.render(<Table />, document.getElementById('abil_table'));
