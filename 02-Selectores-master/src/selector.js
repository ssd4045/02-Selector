var traverseDomAndCollectElements = function(matchFunc, startEl) {
  var resultSet = [];

  if (typeof startEl === "undefined") {
    startEl = document.body;
  }
  let domTree = document.documentElement;
  recorreDom(domTree, matchFunc, resultSet);
  // recorre el árbol del DOM y recolecta elementos que matchien en resultSet
  // usa matchFunc para identificar elementos que matchien

  return resultSet;
};
function recorreDom(node, matchFunc, resultSet) {
  if (matchFunc(node.nodeName)) {
    resultSet.push(node.nodeName);
  }
  if (node.hasChildNodes()) {
    for (let i = 0; i < node.childNodes.length; i++) {
      recorreDom(node.childNodes[i]);
    }
  }
}

// Detecta y devuelve el tipo de selector
// devuelve uno de estos tipos: id, class, tag.class, tag

var selectorTypeMatcher = function(selector) {
  if (selector[0] === "#") return "id";
  if (selector[0] === ".") return "class";
  if (selector.indexOf(".") !== -1) return "tag.class";
  return "tag";
};

// NOTA SOBRE LA FUNCIÓN MATCH
// recuerda, la función matchFunction devuelta toma un elemento como un
// parametro y devuelve true/false dependiendo si el elemento
// matchea el selector.

var matchFunctionMaker = function(selector) {
  var selectorType = selectorTypeMatcher(selector);
  var matchFunction;
  if (selectorType === "id") {
    matchFunction = function(sampleElem) {
      return sampleElem.id === selector.slice(1);
    };
  } else if (selectorType === "class") {
    matchFunction = function(sampleElem) {
      return sampleElem.className.split(" ").includes(selector.slice(1));
    };
  } else if (selectorType === "tag.class") {
    const arrSel = selector.split(".");
    matchFunction = function(sampleElem) {
      return (
        sampleElem.tagName.toLowerCase() === arrSel[0] &&
        sampleElem.className.split(" ").includes(arrSel[1])
      );
    };
  } else if (selectorType === "tag") {
    matchFunction = function(sampleElem) {
      return sampleElem.tagName.toLowerCase() === selector;
    };
  }
  return matchFunction;
};

var $ = function(selector) {
  var elements;
  var selectorMatchFunc = matchFunctionMaker(selector);
  elements = traverseDomAndCollectElements(selectorMatchFunc);
  return elements;
};
