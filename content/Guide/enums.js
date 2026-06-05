() => `
<h1>Enums</h1>

<p>Enums (enumerations) allow you to define a type by enumerating its possible variants. G-lang's enums are highly flexible, supporting simple variants, tuple-like variants, and struct-like variants, all of which can be used with pattern matching.</p>

<h2>Defining an Enum</h2>

<p>Use the <code>enum</code> keyword to define a new enum. Variants are listed inside curly braces and separated by commas.</p>

<pre><code>enum Color {
    Red,
    Green,
    Blue,
    Custom(r, g, b),
    Alpha { r, g, b, a }
}</code></pre>

<p>In this example:</p>
<ul>
    <li><code>Red</code>, <code>Green</code>, and <code>Blue</code> are simple variants.</li>
    <li><code>Custom(r, g, b)</code> is a tuple-like variant that carries three values.</li>
    <li><code>Alpha { r, g, b, a }</code> is a struct-like variant with named fields.</li>
</ul>

<h2>Matching on Enums</h2>

<p>The <code>match</code> expression is the primary tool for working with enums. It allows you to destructure variants and access the data they carry.</p>

<pre><code>fn describe_color(c) {
    match c {
        Color::Red => println("Pure Red"),
        Color::Green => println("Pure Green"),
        Color::Blue => println("Pure Blue"),
        Color::Custom(r, g, b) => {
            print("Custom Color - R: "); print(r);
            print(", G: "); print(g);
            print(", B: "); println(b);
        },
        Color::Alpha { r, g, b, a } => {
            print("Alpha Color - R: "); print(r);
            print(", G: "); print(g);
            print(", B: "); print(b);
            print(", A: "); println(a);
        },
        _ => println("Unknown color format"),
    }
}

describe_color(Color::Red);
describe_color(Color::Custom(10, 20, 30));
describe_color(Color::Alpha { r: 100, g: 150, b: 200, a: 255 });</code></pre>

<h3>Ambiguous (No-Prefix) Matching</h3>

<p>G-lang supports matching on variants without the enum name prefix if the context is clear. This makes code more concise.</p>

<pre><code>enum Status { Pending, Active, Done }

fn check_status(s) {
    match s {
        Pending => println("Work is pending"),
        Active => println("Work is in progress"),
        Done => println("Work is finished"),
    }
}

check_status(Status::Active);</code></pre>

<h2>Nested Matching</h2>

<p>Patterns in a <code>match</code> expression can be nested, allowing you to match on deeply structured data in a single step.</p>

<pre><code>enum Shape {
    Circle(radius),
    Rectangle { w, h },
    Colored(color, shape)
}

fn area(s) {
    match s {
        Shape::Circle(r) => 3.14 * r * r,
        Shape::Rectangle { w, h } => w * h,
        Shape::Colored(c, inner) => {
            print("Area of "); print(c); print(" shape: ");
            area(inner)
        },
        _ => 0,
    }
}

let my_shape = Shape::Colored("Red", Shape::Rectangle { w: 10, h: 5 });
println(area(my_shape));</code></pre>

<div class="alert alert-info">
    <strong>Note:</strong> When matching on variants with data, the variable names in the pattern (like <code>r, g, b</code> in <code>Custom(r, g, b)</code>) are bound to the values carried by the variant.
</div>

<div class="alert alert-success">
    <strong>Next Steps:</strong> Learn more about how the <a href="#control-flow">Match Expression</a> works with literals and wildcards.
</div>
`;
