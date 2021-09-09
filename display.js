//$.ready(() =>
	jsPlumb.ready(() => jsPlumb.setContainer($("#computationtree")[0]));



$(window).resize(() => jsPlumb.repaintEverything());


let _newidcounter = 0;

function getNewID()
{
	_newidcounter++;
	return "c" + _newidcounter;
}

function drawLine(element1, element2)
{
	if(element1.attr('id') == undefined)
		element1.attr('id', getNewID());

	if(element2.attr('id') == undefined)
			element2.attr('id', getNewID());

			console.log(element1.attr('id'))
			console.log(element2.attr('id'))

jsPlumb.connect({
  	source: element1.attr('id'),
	  target: element2.attr('id'),
		anchors:[ "BottomCenter","TopCenter" ],
		cssClass:"transition",
		connector : "Straight",
		endpoint: [ "Blank", {} ],
		overlays:[
          ["Arrow" , { width:12, length:12, location:0.5 }]
                ]
    //connector: [ "Bezier", 175 ],
  //  paintStyle:{ lineWidth:5, strokeStyle:'red' }
});
}

function stringTapeToHTML(tape) {
	return tape.replace(/ /g, "_");
}

function tapeinHTML(tapestring, cursor) {
	if(cursor > tapestring.length) {
		return tapestring;
	}
	else {
		var currentletter = tapestring[cursor];

		if(currentletter == undefined)
			currentletter = " ";

		return stringTapeToHTML(tapestring.substr(0, cursor)) + "<span class='cursor'>" + stringTapeToHTML(currentletter) + "</span>" + stringTapeToHTML(tapestring.substr(cursor+1, 1000));
	}
}

var clusterstack = new Array();


function indentationHTML()
{
	return "<div class='indentation' style='width:" + (clusterstack.length * 8) + "px; float:left;'>&nbsp; </div>";
}



function isEndClusterState(state)
{
	return "c" + getClusterNumber(configuration.state) + "end" == configuration.state.substr(0, configuration.state.indexOf("end")+3);
}


function getClusterNumber(state)
{
	if(state == "0")
		return 0;
	else
		return parseInt(configuration.state.substr(1));
}



var _elementFromConfiguration = new Map();



function setElementFromConfiguration(configuration, element)
{
	return _elementFromConfiguration.set(configuration, element);
}



function getElementFromConfiguration(configuration)
{
	return _elementFromConfiguration.get(configuration);
}



function configurations_print(configurations) {
  $('#computationtree').append(getElementConfigurations(configurations));

	for(let configuration of configurations)
  {
		let elementConfiguration = getElementFromConfiguration(configuration);

		elementConfiguration.hide();
		elementConfiguration.fadeIn("slow");
		if(configuration.lastconfiguration != undefined)
		  	setTimeout(() => drawLine(getElementFromConfiguration(configuration.lastconfiguration), getElementFromConfiguration(configuration)), 500);

  }

}



function getElementConfigurations(configurations) {
  let element = $("<div class='timestep'>");

  for(let configuration of configurations)
  {
		let elementConfiguration = getElementConfiguration(configuration);
		setElementFromConfiguration(configuration, elementConfiguration);
    element.append(elementConfiguration);
  }
  return element;
}


function getElementConfiguration(configuration) {
	if(configuration.message)
	{
		return $("<span class='configuration'>" + configuration.message + "</span>");
	}



  let imin = Math.max(configuration.cursor-3, 0);
  let imax = configuration.cursor+3;

	if(configuration.cursor < 4)
	{
		imin = 0;
		imax = 7;
	}

	if(imin == 1)
		imin = 0;


  let element = $("<table class='configuration'>");


  let tapeIndexElement = $("<tr>");
  element.append(tapeIndexElement);

  if(imin > 0)
    tapeIndexElement.append($("<td></td>"));

  for(let i = imin; i<=imax; i++) {
      let cellElement = $("<td class='cellIndex'>" + i + "</td>");
      tapeIndexElement.append(cellElement);
  }
  let tapeElement = $("<tr class='tape'>");
  element.append(tapeElement);

  if(imin > 0)
    tapeElement.append($("<td class='tapedots'>...</td>"));

  for(let i = imin; i<=imax; i++) {
      let char =  configuration.tape[i];
      if(char == " ")
        char = "_";

      if(char == undefined)
        char = "_";

        let cellElement = $("<td class='cell'>" + char + "</td>");
      if(configuration.cursor == i)
          cellElement.addClass("currentcell");

			if(i % 2 == 0)
				cellElement.addClass("celleven");

      tapeElement.append(cellElement);
  }
  tapeElement.append($("<td class='tapedots'>...</td>"));

  let trcursorElement = $("<tr>");
  element.append(trcursorElement);


    if(imin > 0)
      trcursorElement.append($("<td></td>"));


  for(let i = imin; i<=imax; i++) {
      if(configuration.cursor == i)
        trcursorElement.append($("<td class='cursor'>" + configuration.state + "</td>"));
      else
      trcursorElement.append($("<td></td>"));
  }



	return element;

}




function displayInit()
{
		$('#computationtree').empty();
}
