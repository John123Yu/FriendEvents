var EarthRadius = 3961
function hav(theta) {
  return (1 - cos(theta)) / 2;
}
function sqrt(val) {
  return Math.sqrt(Math.abs(val));
}
function cos(theta) {
  theta = toRad(theta);
  return Math.cos(theta);
}
function asin(oh) {
  theta = Math.asin(oh);
  return toDeg(theta);
}
function toDeg(angle) {
  return angle * 180 / Math.PI;
}
function toRad(angle) {
  return angle * Math.PI / 180;
}

module.exports = {
toDeg: function(angle) {
  return angle * 180 / Math.PI;
},
toRad: function(angle) {
  return angle * Math.PI / 180;
},
sin: function(theta) {
  theta = toRad(theta);
  return Math.sin(theta);
},
cos: function(theta) {
  theta = toRad(theta);
  return Math.cos(theta);
},
tan: function(theta) {
  theta = toRad(theta);
  return Math.tan(theta);
},
asin: function(oh) {
  theta = Math.asin(oh);
  return toDeg(theta);
},
acos: function(ah) {
  theta = Math.acos(ah);
  return toDeg(theta);
},
atan: function(oa) {
  theta = Math.atan(oa);
  return toDeg(theta);
},
abs: function(val) {
  return Math.abs(val);
},
sqrt: function(val) {
  return Math.sqrt(Math.abs(val));
},
hav: function(theta) {
  return (1 - cos(theta)) / 2;
},
hav2: function(theta) {
  var sq = sin(theta / 2);
  return sq * sq;
},
Loc:function(lat,lon,alt) {
  this.lat = toRad(lat);
  this.lon = toRad(lon);
},
dist: function(loc1,loc2) {
  var gcd = hav(loc1.lon - loc2.lon);
  gcd *= cos(loc1.lat);
  gcd *= cos(loc2.lat);
  gcd += hav(loc1.lat - loc2.lat);
  gcd = sqrt(gcd);
  gcd = asin(gcd);
  gcd *= 2 * EarthRadius;
  return gcd;
}

}