# Selector.js

## Setup

1. Forkea este Repo
2. Clonalo en tu computadora

### Corriendo los tests

Los archivos con los que vamos a trabajar son

- **SpechRunner.html** - Abrir en el browser para empezar el proceso de testeo.
- **spec/selectorSpec.js** - Lee los tests. No edites este archivo!
- **src/selector.js** - agrega tu código aquí

Para correr los test abre `SpecRunner.html` en tu browser. Una forma rapida de hacer esto es correr desde tu terminal:
 
```sh 
open SpecRunner.html
```

#### Mirando los resultados de los test

Una vez que abriste SpecRunner.html, deberías ver una página de dos partes. La primera parte tiene el titulo Selector.js Test Page y luego un par de imagenes y mas titulo. La otra mitad es la interfaz de Jasmine que conocemos.

Por ahora, deberias ver un par de tests fallidos. Esto es llamado Redland, nuestro punto de partida para todos los proyectos test-first. Comenzemos el trabajo para llegar a Greenland, donde nos gustaría estar.

#### Refierase al archivo selectorSpec.js

En spec/selectorSpec.js podes previsualizar como los test estan siendo corridos. Esto te dará una pista de como definir las funciones requeridas.

## Construyendo Selector.js

### Orientacion

En Sublime Text (o tu editor favorito) abre la carpeta del proyecto. Una forma fácil de hacer esto es usando la terminal:

```sh
cd selector.js
subl .
```

#### selector.js

En el archivo `src/selector.js` hay tres funciones para que definas eventualmente:

- selectorTypeMatcher
- matchFunctionMaker
- traverseDomAndCollectElements

Vamos a construir cada una de estas a medida que el workshop avanza. Ademas, la principal funcion $ ha sido definida para vos (pero usa las funciones listadas arriba que necesitas definir).


#### Code Flow

Cuando un usuario quiere usar selector.js, los siguientes pasos ocurren:

1. El usuario llama la función `$` para seleccionar elementos de su webpage.
2. Primero, `$` llama `matchFunctionMaker` que llama a `selectorTypeMatcher` para detectar el tipo de selector que el usuario solicitó.
3. Luego, `matchFunctionMaker` crea a `matchFunction` para testear si un elemento dado matchea el selector especifico que el usuario quiere.
4. La función `traverseDomAndCollectElements` hace un breadth o un depth-first search del DOM tree y crea un arreglo de elementos para la cual `matchFunction` devuelve true (significando que esos elementos matchean el selector del user).
5. `traverseDomAndCollectElements` devuelve el arreglo final de elementos a `$`, y `$` devuelve el arreglo a los usuarios.

Estas llamadas de funciones ya estan conectadas para vos, es decir, el flow esta establecido. Tu trabajo es hacer que cada función realmente funcione.

### Tips

- `classList`, `className`, `tagName` y `id`: Estos son las 4 propiedades de los elementos del DOM que vas a necesitar cuando matchies los elementos en el tree.
- `.children`: Cada elemento en el DOM (incluyendo document.body) tienen una propiedad `children` que es un array-like object de todos los children de ese elemento. Vas a necesitar esto mientras traversamos el arbol.
- Podes chequear otras utilidades utiles [aquí](https://developer.mozilla.org/en-US/docs/Web/API/Node)

#### Chrome Web Tools

Usando Chrome Web Tools va a ser útil mientras debuggiemos el codigo, o examinando elementos HTML. Esto tambien es una gran oportunidad para ser mejor en la consola Javascript y Web Tools. Trata usando la función `document.querySelectorAll` en la consola para entender como la función `$` que estamos construyendo deberia funcionar y devolver. 

Tratemos un par de comandos en consola de Chrome:

Abre la consola de Chrome en la misma ventana donde estas corriendo `SpecRunner.html` (podes usar el shortcut `CMD+Option+J`).

- Tipea `var alldivs = document.querySelectorAll('div');` - deberias tener un arreglo con todos los `<div>` de la página.
- Ahora, tipea `alldivs[0]` - esto te devuelve el primer div.
- Ahora, trate `alldivs[0].children` - esto te devuelve todos los hijos del primer div.
- Similarmente podes substituir "div" por cualquier selector css en `querySelectorAll`.

### La funcion principal: $ 

A pesar de que esta función esta ya definida para vos, es importante entender su proposito. La función `$` se comporta exactamente casi como `document.querySelectorAll` o JQuery's `$`. Toma un string de un selector CSS y devuelve un arreglo de elementos en el documento que matchea el selector. Por ejemplo, `$('img.photo')` debería retornar un arreglo con todos los nodos HTML `<img>` que tienen `class="photo"`.

**IMPORTANTE**: Cuando escribas selector.js, no puedes usar ninguna libreria externa como Jquery ni tampoco cualquiera de las siguientes funciones de Javascript:

- `document.getElementById`
- `document.querySelectorAll`
- `document.getElementsByTagName`
- `document.getElementsByClassName`

¿Listo para empezar a construir? Empecemos por matcher tipos de selectores.  

### Matching Selector Types

Antes de que podamos empezar a matchear selectores especificos, tenemos que pensar que tipo de selector el usuario quiere. Buscar por cierto tipo de elemento (e.g. `<h1>` tags) es muy diferente a buscar por elementos con una cierta clase (e.g todos los tags con class="warning"). 

Hay cuatro tipos de selectores que tu función `$` puede ser capáz de matchiar. Notese que esto es un subset simplificado de el actual selector que JQuery y CSS aceptan; tu no tendrás que matchiar todo que una librería completa manejaría: 

| Tipo de Selector | Ejemplo de selector de string | selectorTypeMatcher devuelve |
|------------------|-------------------------------|------------------------------|
| id               | '#savebox'                    | 'id'                         |
| class name       | '.red'                        | 'class'                      |
| element tag      | 'div'                         | 'tag'                        |
| tag with class   | 'div.red'                     | 'tag.class'                  |

#### Primeros Tests: `selectorTypeMatcher`

El `selectorTypeMatcher` debería tomar un selector como string (como cualquiera de los ejemplos de arriba) y devolver 1 de los 4 string que representan el tipo de selector. Por ejemplo, para detectar un selector de tipo id, cheque primero si el primer caracter del selector es #. Si es así, la función debería devolver 'id'.

**Termina escribiendo** `selectorTypeMatcher. Cuando hayas pasado los tests asociados avanza a la siguiente parte del workshop. 


### Generando la función de matcheo

Ahora que ya tenemos un detector de selectores, podemos hacer cosas un poco mas sofisticadas en terminos de `functional programming`. Vamos a generar dinamicamente funciones que prueben un input para ver si matchean un selector especifico de un user.

#### Segundos Tests: `matchFunctionMaker`

La función `matchFunctionMaker` debería devolver una matchFunction. Cada matchFunction testea un elemento html para ver si esta matchea el selector del usuario. Tiene las siguientes especificaciones:

- `matchFunction` toma un parametro, un elemento HTML.
- `matchFunction` devuelve `true` o `false`
- `matchFunction` usa closure para saber que matchear durante un search especifico

Los cuatro tipos de selectores (id, class, tag y tag.class) van a necesitar producir diferentes matchFunctions. Por ejemplo, imagina que el selector pasado a la función `$`  es "div". Aquí es como una funcion que matchea todos los elementos `div` deveria verse:

```javascript
var selector = 'div';

// una matchFunction para un selector "tag" podría verse asi:
var matchFunction = function (el) {
  return el.tagName && (el.tagName.toLowerCase() === selector.toLowerCase());
};
```

La función devuelta por matchFunctionMaker va a ser usada por `traverseDomAndCollectElements` para chequear si un elemento dado realmente matchea el selector. Con el tag matcher definido arriba, podríamos en teoría pasar esa función a `traverseDomAndCollectElements(matchFunction)` y tener un arreglo de elementos `<div>` como resultado.

**Termina escribiendo** `matchFunctionMaker`.  Cuando los test asociados hayan pasado puedes continuar con la siguiente parte del workshop.

### Recorriendo el DOM y Recolectando Elementos 

#### Repaso

Repasemos: La función principal `$` toma un selector (string) y comienza por usar `matchFunctionMaker` para generar una `matchFunction` para ese selector. Podemos pasar un elemento HTML a matchFunction y va a devolver `true` o `false` si el elemento matchea el selector. Hasta este punto, todo lo que nos queda hacer es chequear cada elemento en el DOM para ver si lo debemos recolectar!


#### Terceros Tests: traverseDomAndCollectElements

La función `traverseDomAndCollectElements` es usada para recorrer (navegar a través) el arbol del DOM completo y recolectar los elementos especificos deseados por el usuario. Una manera natural de escribir estas funciones es usando recursión. Toma dos parametros: `matchFunc` y `startEl`.

- `startEl` - este es el elemento del arbol del DOM donde la busqueda comenzará. Si `startEl` es `undefined`, la busqueda comienza en `document.body`.
- `matchFunc` - la función generada por nuestro `matchFunctionMaker`. Testea si un elemento dado matchea con el selector o no, y por lo tanto si deberia ser recolectado o no.

**Termina escribiendo** `traverseDomAndCollectElements`. Cuando los tests asociados hayan pasado, has completado la parte principal del workshop! Puedes continuar al Extra Credito si tienes tiempo.

## Extra Credito

### Selector de Jerarquía

Listo ya? Fijate si podés implementar selectores mas avanzados.

- `$('div > img')` seleccionaría todos los `<img>` tags que son hijos directos de `<div>` tags.
- `$('div img')` seleccionaria todos los `<img>` tags a cualquier nivel dentro de `<div>` tags.

### Multiple Jerarquía

Acepta cualquier numero de argumentos, e.g. `$('div > p > a > img')`.

### Seleccion de Atributos dentro de Tags

`$('input[type="text"]')` seleccionaria todos los `<input>` tags que tienen el atributo `type="text"`.

### Selector Chaining (find, children)

Encadenar (chaining) es un concepto popular en javascript, en el que ejecutas multiples metodos en una declaración. Lográs esto a partir de que en cada chaining method llamado, devolves no solo el output esperado, pero tambien otras capacidades que podes invocar inmediatamente.

Para este ejercicio vas a hacer los sigientes selectores encadenables:

- `$('div).find('img')` va a funcionar de la misma manera que `$('div img')`
- `$('div').find('img').get(0)` va a devolver el elemento del DOM. Esta funcíon toma un indice como argumento, y devuelve el elemento correspondiente al indece. En este caso devolverías el primer img tag.
- `$('div').children('img')` va a funcionar como `$('div > img')`. Tambien vas a ser capaz de encadenar la función `get` desde `children`.

Funciones encadenadas opcionales: `.next()`, `.prev()`, `.parent()`, `.closest()`(esto es probablemente el más díficil).

Nota: Agregar esta funcionalidad va a requerir cambiar tu implementación de tal manera que los test que usamos previamente no seran validos - esto esta bien - para aún mas extra credito, sientete libre de ajustar los test para que funcionen con tu nueva implementación!

### Selector de Posición Relativa

Implementa `+` en tu selector de tal manera que matchie los hermanos adyacentes. Refiereta a la [documentacion de mdn sobre el selector de hermanos adyacentes](https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_selectors).

### Event Emmiter


Agrega la abilidad de registar multiples event handlers, para un nodo del DOM - por ahora concentrate en solo el 'click' event. Si todavía no lo hiciste, quizás quieras implementar una clase customizada para estos nodos del DOM. Por ejemplo, deberías ser capaz de hacer algo así:

```javascript
domNode.on('click', function () {
    console.log('I run');
});

domNode.on('click', function () {
    console.log('I also run');
});
```

Asegurate que esta realmente ligado a la API del DOM de click event. Luego agrega otro metodo para disparar eventos arbitrarios, e.g.:

```javascript
domNode.trigger('click');

// custom event
domNode.on('bananas', function () {
    console.log('in pajamas');
});
domNode.trigger('bananas');
// console should have logged 'in pajamas'
```






