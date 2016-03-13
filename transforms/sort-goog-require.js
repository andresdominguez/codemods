const theVars = [];

function doSort() {
  theVars.sort((l, r) => {
    var a = l.declarations[0].id.name;
    var b = r.declarations[0].id.name;
    return a.localeCompare(b);
  });
}

function isGoogRequire(vd) {
  if (!vd.declarations.length) {
    return false;
  }

  const callee = vd.declarations[0].init.callee;
  if (!callee) {
    return false;
  }

  const name = callee.object.name;
  const propertyName = callee.property.name;

  var isGoogRequire = (name === 'goog' && propertyName === 'require');
  if (isGoogRequire) {
    theVars.push(vd);
    doSort();
  }
  return isGoogRequire;
}

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const {expression, statement, statements} = j.template;

  return j(file.source)
      .find(j.VariableDeclaration, isGoogRequire)
      .replaceWith((p, index) => theVars[index])
      .toSource();
};
