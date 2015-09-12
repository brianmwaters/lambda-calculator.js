lambda-calculator.js
====================

lambda-calculator.js is an interpreter for the world's oldest functional
programming language, [&#955;-calculus](https://en.wikipedia.org/wiki/Lambda_calculus).
It implements Alonzo Church's original, untyped variant with call-by-value
semantics and the modern, dot-based syntax. As such, it differs substantially
from conventional functional programming language interpreters.

Installation
----------------------
<code>user@host:~$ sudo npm install -g lambda-calculator.js</code>

Usage
-----
<pre><code>user@host:~$ lambda-calculator.js
&gt; (\ x y . y x) a b
b a
&gt; </code></pre>
Use <code>Ctrl-C</code> to quit.
