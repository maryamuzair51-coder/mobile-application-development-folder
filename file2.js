//importing const from file 1
import { name, age, username, cgpa } from "./file1.js";

console.log("Name:", name);
console.log("Age:", age);
console.log("Username:", username );
console.log("CGPA", cgpa );

// import the array
import { numbers, colors } from './file1.js'; 
console.log(numbers); 
console.log(colors);
console.log(numbers[2]); // Accessing an element by index 
console.log(colors[1]); 
/*import function
import myFun from './file1.js';
 myFun();

 // import by changing the default fun name:
 import myVar from "./file1.js"; 
myVar();*/

// Import variable 
import myStudent from './file1.js'; 
console.log(myStudent); 

// Option 1: Access property directly 
console.log(myStudent.id); 
console.log(myStudent["name"]);

// Rename named export using "as"
import { score as points } from './file1.js';
console.log("Point:", points );