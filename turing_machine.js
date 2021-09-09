class TuringMachine
{
  constructor(description)
  {
    this.transitions = new Array();

    this.transitions = new Array();
  	var transitionsLines = description.split('\n');

  	for(let transitionLine of transitionsLines) {
  		if(transitionLine != "")
  		if(transitionLine[0] != ";")
  		{
  			var T = transitionLine.split(" ");

        if(T.length != 5)
          errorMessage("The transition '" + transitionLine + "' is not in the good format.");


  			if(this.transitions[T[0]] == undefined)
  				this.transitions[T[0]] = new Array();

  			var goI;

  			if(T[3] == "l" || T[3] == "<")
  				goI = -1;
  			else if(T[3] == "r" || T[3] == ">")
  				goI = 1;
  			else
  				goI = 0;

  			if(T[1] == "_")
  				T[1] = " ";

  			if(T[2] == "_")
  				T[2] = " ";

        if(this.transitions[T[0]][T[1]] == undefined)
          this.transitions[T[0]][T[1]] = new Array();

        this.transitions[T[0]][T[1]].push({write: T[2], go: goI, to: T[4]});
  		}
  	}
  }








  getNextConfigurations(configuration)
  {
    if(configuration.message)
        return [];

    var letter = configuration.tape[configuration.cursor];
    if(letter == undefined)
      letter = " ";


    if(configuration.state == "halt")
      return [{message: "halt", lastconfiguration: configuration}];
    if(configuration.state == "acc")
        return [{message: "accept", lastconfiguration: configuration}];
    if(configuration.state == "rej")
          return [{message: "reject", lastconfiguration: configuration}];

    if(this.transitions[configuration.state] == undefined)
    {
      return [{message: "no out-transition from state " + configuration.state, lastconfiguration: configuration}];
    }





    if(this.transitions[configuration.state][letter] == undefined)
    {
      return [{message: "no out-transition from state " + configuration.state + " with letter '" + letter + "'", lastconfiguration: configuration}];

    }


    let nextconfigurations = new Array();

    for(let transition of this.transitions[configuration.state][letter])
    {
      let nextconfiguration = {tape: configuration.tape, cursor: configuration.cursor};

      if(configuration.cursor == configuration.tape.length)
        nextconfiguration.tape += transition.write;
      else if(configuration.cursor == -1)
      {
        nextconfiguration.tape = transition.write + configuration.tape;
        nextconfiguration.cursor = 0;
      }
      else
        nextconfiguration.tape = setChar(configuration.tape, configuration.cursor, transition.write);





      nextconfiguration.cursor += transition.go;

      nextconfiguration.state = transition.to;
      nextconfiguration.lastconfiguration = configuration;

      nextconfigurations.push(nextconfiguration);
    }



    return nextconfigurations;
  }



}





function setChar(tapestring, i, newChar)
{
	return tapestring.substr(0, i) + newChar + tapestring.substr(i+1, 1000);
}
