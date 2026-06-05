() => `
<h1>Syntax Guide</h1>

<p>This guide provides a comprehensive reference for the syntax of G-lang. The language is designed to be familiar to users of C-family languages like JavaScript, Rust, and C.</p>

<h2>Comments</h2>

<p>G-lang supports single-line comments. Everything after <code>//</code> on a line is ignored.</p>

<pre><code>// This is a comment
let x = 5; // This is also a comment</code></pre>

<h2>Variables</h2>

<p>Variables are declared using the <code>let</code> keyword. G-lang is dynamically typed, so you don't need to specify types.</p>

<pre><code>let x = 10;
let message = "Hello";
let is_valid = true;</code></pre>

<p>Variables are mutable by default, meaning you can reassign them.</p>

<pre><code>let count = 0;
count = count + 1;</code></pre>

<h2>Data Types</h2>

<p>G-lang supports the following literals and types:</p>

<ul>
    <li><strong>Integers:</strong> <code>42</code>, <code>-10</code></li>
    <li><strong>Big Integers:</strong> <code>99999999999999999999999999</code></li>
    <li><strong>Floats:</strong> <code>3.14</code>, <code>0.01</code></li>
    <li><strong>Strings:</strong> <code>"Hello, World!"</code></li>
    <li><strong>Booleans:</strong> <code>true</code>, <code>false</code></li>
    <li><strong>Arrays:</strong> <code>[1, 2, 3]</code></li>
    <li><strong>Hashes:</strong> <code>{"key": "value", "age": 30}</code></li>
    <li><strong>Null:</strong> <code>null</code></li>
</ul>

<h2>Control Flow</h2>

<h3>If-Else</h3>

<p>Conditional execution uses <code>if</code> and <code>else</code>. Parentheses around the condition are required.</p>

<pre><code>if (x > 0) {
    println("Positive");
} else if (x < 0) {
    println("Negative");
} else {
    println("Zero");
}</code></pre>

<h3>Loops</h3>

<p>G-lang supports <code>while</code> loops and two types of <code>for</code> loops.</p>

<pre><code>// While loop
while (condition) {
    // ...
}

// C-style For loop
for (let i = 0; i < 10; i += 1) {
    println(i);
}

// Iterator-style For loop
let list = [1, 2, 3];
for (item in list) {
    println(item);
}</code></pre>

<p>You can use <code>break</code> to exit a loop early and <code>continue</code> to skip to the next iteration.</p>

<h2>Functions</h2>

<p>Functions are first-class values defined with the <code>fn</code> keyword.</p>

<pre><code>fn add(a, b) {
    return a + b;
}

// Implicit return of the last expression is supported
fn multiply(a, b) {
    a * b // Implicit return, the same can be achieved with return a * b
}</code></pre>

<h2>Structs</h2>

<p>Structs allow you to define custom data types with fields and methods.</p>

<pre><code>struct Person {
    name: null,
    age: null,
    
    greet: fn() {
        println("Hello, I'm ", this.name);
    }
}

// Instantiation
let p = Person { name: "Alice", age: 30 };
p.greet();</code></pre>

<h2>Enums</h2>

<p>Enums allow you to define a type by enumerating its possible variants, which can carry data.</p>

<pre><code>enum Status {
    Pending,
    Active(started_at),
    Done { finished_at, result }
}

let s = Status::Active("2024-01-01");

match s {
    Status::Pending => println("Pending..."),
    Status::Active(time) => println("Active since ", time),
    Status::Done { finished_at, result } => println("Done at ", finished_at),
}</code></pre>

<h2>Modules</h2>

<p>Code can be organized into modules and imported using the <code>import</code> keyword.</p>

<pre><code>// Importing a module from std
import std::io;
import std::math;

// Importing a module from a local file
import path::to::file;

// Importing elements from a local file
import path::to::file::{function1, function2, ...};

// Importing file in parent folder
import super::file;</code></pre>



<div class="alert alert-info">
    <strong>Note:</strong> Statements in G-lang typically end with a semicolon <code>;</code>.
</div>
`;
