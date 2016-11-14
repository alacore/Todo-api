var person = {
	name: 'Andrew',
	age: 21
};

function updatePerson (obj){

	this.name = obj.name;
	this.age = 45;

	return obj;

}

updatePerson(person);
// console.log(person);

console.log(person);