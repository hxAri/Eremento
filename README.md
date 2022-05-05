# Eremento

Simple JavaScript HTMLElement Generator.
Want to create or build HTML elements with an Array arrangement? But you are confused about making it? Sans **Eremento** is the solution, it is made as simple as possible so that it is easy to use by everyone who needs it.

# Usage
As for how to use it, it's also quite simple without much ado.
```html
<!-- Without being minimized -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/hxAri/Eremento@latest/dist/js/eremento.js"></script>

<!-- With minimized script -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/hxAri/Eremento@latest/dist/js/eremento.min.js"></script>

<!-- Or even with obfuscate -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/hxAri/Eremento@latest/dist/js/eremento.obs.js"></script>

<!-- Application examples -->
<script type="text/javascript">

    window.addEventListener( "load", function(e)
    {
        // Root element target.
        var root = document.getElementById( "root" );

            // Single create element.
            root.appendChild( Eremento.create({
                name: "h1",
                self: {
                    innerHTML: "Example Single Element"
                }
            });

            // Multiple create element.
            Eremento.multiple([ .... ]);

            // Multiple create element with root.
            Eremento.multiple([ root, [ .... ] ]);
    }

</script>
```

# License
All source code license under MIT.<br/>
Please see the MIT documentation for details.
