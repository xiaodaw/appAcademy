// utility code, esp vector stuff

const Utils = {
  inherits: function(childClass, parentClass) {
    childClass.prototype = Object.create(parentClass.prototype);
    childClass.prototype.constructor = childClass;
  },

  randomVec: function(length) {
    const deg = 2 * Math.PI * Math.random();
    return Utils.scale([Math.sin(deg), Math.cos(deg)], length);
  },

  scale: function(vec, mag) {
    return [vec[0] * mag, vec[1] * mag];
  }
}

module.exports = Utils;