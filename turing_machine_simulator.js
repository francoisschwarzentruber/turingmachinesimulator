var turingMachine;


function loadTuringmachinetransitionsystem() {
	turingMachine = new TuringMachine($('#turingmachinecode').val());
}







var configurations;




function someSteps()
{
	if(!isFinished)
		window.setTimeout(someSteps, 200);

	if(isFinished)
			return;

		oneStep();


}
var isFinished = false;

function finished()
{
	$('#runningdiv').hide();
	$('#outputdiv').show();
	window.clearTimeout();
	isFinished = true;
}


function errorMessage(message)
{
	$('#outputmessage').html(message);
}


function oneStep()
{
	configurations_print(configurations);

	let nextConfigurations = new Array();

	for(let configuration of configurations)
				nextConfigurations = nextConfigurations.concat(turingMachine.getNextConfigurations(configuration));

	if(nextConfigurations.length == 0)
      finished();

	configurations = nextConfigurations;

}



function cancel()
{
	isFinished = true;
	$('#outputmessage').html("cancelled");
	$('#outputdiv').hide();
	$('#runningdiv').hide();

}

function load()
{
	clusterstack = new Array();
	clusterstack.push(0);

	isFinished = false;
	$('#runningdiv').show();
	$('#outputdiv').hide();
	$('#outputmessage').html("");
	loadTuringmachinetransitionsystem();

	configurations = [{tape: $('input').val(), cursor: 0, state: '0'}];

	displayInit();

	someSteps();



}






$( document ).ready(function() {
	load();
});
