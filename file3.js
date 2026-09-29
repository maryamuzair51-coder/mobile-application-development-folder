/* Declaration and assigning value
let numbers = [10, 20, 30]; 
// Destructuring assignment
let [first, second] = numbers;
console.log(first,second); // in one line 
console.log(second); // separate*/
// array destruction
let numbers = [10, 20, 30, 40, 50]; 
// Destructuring assignment while selection 1st and last element only
let [a,,,d] = numbers; 
console.log(a,d); // in one line 
console.log(a); 

/*let student = { id: 6766, name: "Kausar", age: 26 };
 // Object destructuring 
let { id, name } = student; 
console.log(id, name,); 
console.log(name); */

/* Step 1: Create nested object 
let student = {
    name: "Kausar", 
    address: { 
        city: "Islamabad", 
        country: "Pakistan"}
    };
 // Step 2: Destructure nested object
let { address: { city, country } } = student; 
// Step 3: Use the variables
console.log(city); 
console.log(country , city); */

/* Function with destructuring in parameters 
function greet({ name, age }) {
    // <-destructuring happens here 
    console.log("Hello " + name + ", you are " + age); } 
    
// Object is declared outside 
let person = { name: "Kausar", age: 26 }; 
// Pass object to function
greet(person);*/

/* Function with destructuring in parameters 
function greet({ name, age }) {
     console.log("Hello " + name + ", you are " + age); 
    }
// Object passed directly in function call 
greet({ name: "Kausar", age: 26 });*/

/* Function returns an object
function getUser() { 
    return { name: "Kausar", age: 26, city: "Islamabad"}; 
} 
//Destructuring the returned object 
const { name, age, city } = getUser(); 
// takes values from function 
console.log(name,age, city); */

function getScores()
 { return [90, 85, 95]; 
    
 } 
// Destructuring returned array into variables 
const [math, english, science, MAD] = getScores(); 
console.log(math, english, science, MAD); 