var fs = require('fs');


//constants
var TASK_PATH = "./todo.txt";
var TASK_DONE = "./done.txt";

function init(){
	//create file if it's present.
	if(!fs.existsSync(TASK_PATH)){
		setData([]);	
	}
	if(!fs.existsSync(TASK_DONE)){
		setDone([]);	
	}
	
}
//read todo file contents
function getData(){
	var contents = fs.readFileSync(TASK_PATH);
	var data = JSON.parse(contents);
	return data;
}
//read done file contents
function getDone(){
	var contents = fs.readFileSync(TASK_DONE);
	var data = JSON.parse(contents);
	return data;
}
//write data to todo.txt
function setData(data){
	var dataString = JSON.stringify(data);
	fs.writeFileSync(TASK_PATH,dataString);
}
//write data to done.txt
function setDone(data) {
	var dataString = JSON.stringify(data);
	fs.writeFileSync(TASK_DONE, dataString);
}

//display usage
function usage() {
	console.log("Usage :-");
	console.log(`$ ./todo add "todo item"  # Add a new todo`);
	console.log("$ ./todo ls               # Show remaining todos");
	console.log(`$ ./todo del NUMBER       # Delete a todo`);
	console.log(`$ ./todo done NUMBER      # Complete a todo`);
	console.log(`$ ./todo help             # Show usage`);
	console.log(`$ ./todo report           # Statistics`);
  
}

//add task
function add(task) {
	var data = getData();
	if (task) {
		data.push(task);
	setData(data);
	console.log(`Added todo: "${task}"`)
	}
	else {
		console.log("Error: Missing todo string. Nothing added!")
	}
	
}

//check task
function done(task) {
	var data = getData();
	var done = getDone();
	var todoBak = data[task];
	var date = new Date().toJSON().slice(0, 10).split('-').join('-');
	if (data[task]) {
		data.splice(task, 1);
		console.log("Marked todo #"+(task+1)+" as done.")
		setData(data);
		done.push(`x ${date + " " +todoBak}`)
		setDone(done);
	}
	else {
		console.log("Error: todo #"+(task+1)+" does not exist.")
	}
	
}

//delete task
function del(task){
	var data = getData();
	if (data[task]) {
		data.splice(task, 1);
		setData(data);
		console.log("Deleted todo #" + (task + 1))
	}
	else {
		console.log("Error: todo #"+(task+1)+" does not exist. Nothing deleted.")
	}
}
//list all tasks
function list() {
	var data = getData();
	if(data.length > 0){
		data.slice(0).reverse().forEach(function (task,index){
     		 console.log("["+(data.length-index)+ "] " + task);
		});
	}else{
		console.log("There are no pending todos!");
	}
}
//view report
function report() {
	var data = getData();
	var done = getDone();
	var date = new Date().toJSON().slice(0,10).split('-').join('-');
	console.log(date + " Pending : " + data.length + " Completed : " + done.length )
	 
}


var command = process.argv[2];
var argument = process.argv[3];

init();

switch(command){
	case "add":
		add(argument);
		break;
	case "done":
		if (argument) {
			done(argument-1);
		break;
		}
		else {
			console.log("Error: Missing NUMBER for marking todo as done.")
		}
		
	case "del":
		if (argument) {
			del(argument-1);
			break;
		}
		else {
			console.log("Error: Missing NUMBER for deleting todo.");
			break;
		}
	case "help":
		usage();
		break;
	case "report":
		report();
		break;
	case undefined:
		usage();
    break;
  case "ls":
    list();
    break;
	default:
		console.log("Command not found!!");
		usage();
		break;
}
