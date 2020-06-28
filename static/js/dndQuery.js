function dndQuery(cat, name, targetFunc) {
    var url = 'http://localhost:3000/api/' + cat + '/' + name;
    return fetch(url)
    .then((response) => response.json())
    .then((mon) => {
        targetFunc(mon);
   })
   .catch((error) => {
     console.log(error);
    });
}

function abilMod (score){
    let mod = Math.floor((score - 10) / 2);
    if (mod == 0) {
        return score + "(0)";
    }
    else if (mod > 0) {
        return score + "(+" + mod + ")";
    }
    else {
        return score + "(" + mod + ")";
    }
}

function combJson (iterObj) {
    // iterate and combine json object to string
    let outString = ""
    jQuery.each(iterObj, function(n, val) {
                    outString = outString + n + " " + val + ", ";
                    })

    outString = outString.replace("_", " ")

    return outString
}

const monsterState = {divs: [], names: []}

function monsterEntry(monster, useDiv) {
    let MonsterAttack = props => <div className="attack">

    <span className="attackname">{props.name}. </span>
    <span>{props.desc}</span>
    </div>

    let monsterTable = (
        <div className="monster">
            <div className="name">{monster.name}</div>
            <div className="description">{monster.size} {monster.type}, {monster.alignment}</div>

            <div className="gradient"></div>

            <div className="red">
                <div ><span className="bold red">Armor Class</span><span> {monster.armor_class} </span></div>
                <div><span className="bold red">Hit Points</span><span> {monster.hit_points} ({monster.hit_dice})</span></div>
                <div><span className="bold red">Speed</span><span> {monster.speed.walk} </span></div>
            </div>

            <div className="gradient"></div>

            <table>
                <tr><th>STR    </th><th>DEX   </th><th>CON    </th><th>INT   </th><th>WIS   </th><th>CHA   </th></tr>
                <tr><td>{abilMod(monster.strength)}</td>
                    <td>{abilMod(monster.dexterity)}</td>
                    <td>{abilMod(monster.constitution)}</td>
                    <td>{abilMod(monster.intelligence)}</td>
                    <td>{abilMod(monster.wisdom)}</td>
                    <td>{abilMod(monster.charisma)}</td></tr>
            </table>

            <div className="gradient"></div>

            <div><span className="bold">Senses: </span>
                <span>{combJson(monster.senses)}</span></div>

            <div><span className="bold">Languages: </span><span>{monster.languages}</span></div>
            <div><span className="bold">Challenge: </span><span>{monster.challenge_rating}</span></div>

            <div className="gradient"></div>

            <div className="actions red">Actions</div>

            {monster.actions.map(action => (
                    <MonsterAttack name={action.name} desc={action.desc}/>
                ))}

            <div className="monster actions legendary-actions">
                
            </div>

        </div>
    )

    ReactDOM.render(monsterTable, useDiv);
}

function drawTab(monster) {
    if (!monsterState.names.includes(monster.name)) {
        monsterState.names.push(monster.name);
        var newDiv = document.createElement("div")
        monsterEntry(monster, newDiv)
        let cont = document.getElementById("all-monsters")
        cont.appendChild(newDiv)
    }
    else {
        alert("You already added " + monster.name)
    }
}


function checkMonster() {
    dndQuery("monsters", document.getElementById("monsterForm").value, drawTab);
}
