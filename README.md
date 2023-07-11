
![Eremento · Logo](https://raw.githubusercontent.com/hxAri/hxAri/main/public/images/1653507202%3B5fe1yJwN3F.png)

Eremento is a tool for building HTML Elements based on objects or properties, you can create HTML element objects and also create raw HTML structures easily with Eremento.

## Features
* Arrangement<br/>
  Builds the raw HTML structure from the object as well as from the HTML instance itself.
* Object<br/>
  Builds html elements from objects.
* Multiple<br/>
  You can construct one element or even more than one html element.

## Initialize
Through **UNPKG**
```html
<script type="text/javascript" src="https://unpkg.com/eremento/dist/js/eremento.js"></script>
```

## Examples
Build raw HTML structure.
```js
/** For Multiple Elements **/
Eremento.arrange([]);

/** For Single Element **/
Eremento.arrange({
    name: "input",
    attributes: {
        type: "text",
        value: null
    }
});

/** Results **/
/** <input type="text" value="" /> */
```

Building an HTML Element Instance.

```js
Eremento.create({
    name: "button",
    attributes: {
        dataset: {
            id: 0
        },
        click: e => console.log( e.target.dataset.id )
    }
});
```

## License
All source code license under [MIT license](https://opensource.org/licenses/MIT). Please [see](https://opensource.org/licenses/MIT) the [MIT](https://opensource.org/licenses/MIT) documentation for details.
