() => `
<h1>Quick Start</h1>

<p>Get started with G-lang in minutes. This guide covers the basics to get you writing code right away.</p>

<h2>Running the REPL</h2>

<p>The easiest way to experiment with G-lang is through the REPL (Read-Eval-Print Loop):</p>

<pre><code>g-lang</code></pre>

<p>This starts an interactive session where you can type expressions and see results immediately:</p>

<pre><code>G-lang v0.1.0
Type 'exit' or 'quit' to quit

>> 2 + 2
4
>> let name = "G"
>> println("Hello, " + name)
Hello, G
>> exit
Goodbye!</code></pre>

<h2>VS Code Extension (Syntax Highlighting)</h2>
<p>For a better user expirience we suggest installing the G-lang VS Code extension for syntax highlighting:</p>
<p><a href="/content/others/g-lang-0.0.1.vsix">Download g-lang-0.0.1.vsix</a></p>
<p>Installation guide: Open vscode -> Go to "Extensions" -> Click on the 3 dots -> At the bottom you will find "Install from VSIX..." -> Select the .vsix file.</p>


<h2>Your First Script</h2>

<p>Create a file called <code>first.g</code> with the following content:</p>

<pre><code>// Variables and arithmetic
let x = 10;
let y = 20;
let sum = x + y;

println(sum);</code></pre>

<p>Run it:</p>

<pre><code>g-lang run first.g</code></pre>

<p>Output:</p>

<pre><code>30</code></pre>

<h2>Variables and Types</h2>

<p>G-lang supports several data types:</p>

<pre><code>// Integers
let age = 25;

// Big integers (for very large numbers)
let huge = 99999999999999999999999999;

// Floats
let price = 19.99;

// Strings
let name = "Alice";

// Booleans
let is_active = true;

// Arrays
let numbers = [1, 2, 3, 4, 5];

// Hashes (dictionaries)
let person = {
    "name": "Bob",
    "age": 30
};

// Null
let nothing = null;</code></pre>

<h2>Functions</h2>

<p>Functions are first-class values in G-lang:</p>

<pre><code>// Function assigned to a variable
fn add(a, b) { a + b }

println(add(5, 3));  // 8</code></pre>

<p>Functions can be passed as arguments and returned from other functions:</p>

<pre><code>fn apply(func, x, y) {
    return func(x, y);
}

fn multiply(a, b) {
    return a * b;
}

let result = apply(multiply, 4, 5);
println(result);  // 20</code></pre>

<h2>Control Flow</h2>

<h3>If-Else Statements</h3>

<pre><code>let x = input("Insert a number: ").to_int();

if (x > 10) {
    println("x is greater than 10");
} else {
    println("x is less than or equal to 10");
}</code></pre>

<h3>While Loops</h3>

<pre><code>let counter = 0;

while (counter < 5) {
    println("Counter: ", counter);
    counter = counter + 1;
}</code></pre>

<h3>For Loops (Iterator-style)</h3>

<pre><code>let fruits = ["apple", "banana", "cherry"];

for (fruit in fruits) {
    println("I like ", fruit);
}</code></pre>

<h3>For Loops (C-style)</h3>

<pre><code>for (let i = 0; i < 10; i += 1) {
    if (i % 2 == 0) {
        println(i, " is even");
    }
}</code></pre>

<h3>Break and Continue</h3>

<pre><code>for (let i = 0; i < 10; i += 1) {
    if (i == 5) {
        break;  // Exit the loop
    }
    if (i % 2 == 1) {
        continue;  // Skip odd numbers
    }
    println(i);
}</code></pre>

<h2>Working with Arrays</h2>

<pre><code>let arr = [1, 2, 3, 4, 5];

// Get length
println(len(arr));  // 5

// Get first element
println(head(arr));  // 1

// Get all but first
println(tail(arr));  // [2, 3, 4, 5]

// Add element to end
let extended = push(arr, 6);
println(extended);  // [1, 2, 3, 4, 5, 6]

// Access by index
println(arr[0]);  // 1
println(arr[2]);  // 3</code></pre>

<h2>Structs</h2>

<p>Define custom data structures with fields and methods:</p>

<pre><code>struct Person {
    name: null,
    age: null,
    
    greet: fn() {
        println("Hello, I'm ", this.name);
    }
}

// Create an instance
let person = Person { 
    name: "John", 
    age: 30 
};

// Call method
person.greet();  // Hello, I'm John

// Access fields
println(person.name);  // John
println(person.age);   // 30</code></pre>

<h2>Enums</h2>

<p>Enums allow you to define a type by enumerating its possible variants, which can carry data and be pattern-matched.</p>

<pre><code>enum Result {
    Ok(value),
    Error(message)
}

let res = Result::Ok(200);

match res {
    Result::Ok(v) => println("Success: ", v),
    Result::Error(m) => println("Failed: ", m),
}</code></pre>

<h2>User Input</h2>

<p>Get input from the user with the <code>input()</code> function:</p>

<pre><code>let name = input("What's your name? ");
println("Hello, " + name + "!");

let age_str = input("How old are you? ");
let age = age_str.to_int();
println("You are " + age.to_string() + " years old");</code></pre>

<h2>Type Conversion</h2>

<pre><code>// String to integer
let num = "42".to_int();

// Integer to string
let str = 42.to_string();

// Integer to float
let f = 42.to_float();

// Float to integer
let i = 3.14.to_int();  // 3</code></pre>

<h2>Importing Modules</h2>

<p>Use the standard library modules:</p>

<pre><code>import std::io;
import std::math;

// Read from a file
if (io.exists("input.txt")) {
    let content = io.read_file("input.txt");
    println(content);
} else {
    println("File not found");
}

// Write to a file
io.write_file("output.txt", "Hello, file!");

// Generate random number
let random_num = math.random(1, 100);
println("Random number: " + random_num.to_string());</code></pre>

<h2>Complete Example</h2>

<p>A simple program that combines multiple concepts:</p>

<pre><code>// Simple number guessing game
import std::math;

let secret = math.random(1, 100);
let attempts = 0;

println("I'm thinking of a number between 1 and 100");

while (true) {
    let guess_str = input("Your guess: ");
    let guess = guess_str.to_int();
    attempts = attempts + 1;
    
    if (guess == secret) {
        println("Correct! You got it in " + attempts.to_string() + " attempts!");
        break;
    } else if (guess < secret) {
        println("Too low!");
    } else {
        println("Too high!");
    }
}</code></pre>

<h2>Next Steps</h2>

<div class="alert alert-info">
    <p><strong>Learn More:</strong></p>
    <ul>
        <li><a href="#syntax">Syntax Guide</a> - Detailed syntax reference</li>
        <li><a href="#data-types">Data Types</a> - Deep dive into types</li>
        <li><a href="#functions">Functions</a> - Advanced function usage</li>
        <li><a href="#structs">Structs</a> - Working with custom types</li>
        <li><a href="#enums">Enums</a> - Working with variants and data</li>
        <li><a href="#io-functions">Built-in Functions</a> - All available built-in functions</li>
        <li><a href="#stdlib-io">Standard Library</a> - Explore the standard library modules</li>
    </ul>
</div>

<h2>Tips for Learning</h2>

<ul>
    <li>Use the REPL to experiment with expressions and test ideas quickly</li>
    <li>Start with small programs and gradually add complexity</li>
    <li>Check your syntax with <code>g-lang check file.g</code> before running</li>
    <li>Read error messages carefully - they often point directly to the problem</li>
    <li>Explore the standard library modules for common functionality</li>
</ul>
`;