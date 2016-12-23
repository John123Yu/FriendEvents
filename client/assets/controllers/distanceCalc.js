var EarthRadius = 3961
function toDeg(angle) {
  return angle * 180 / Math.PI;
}
function toRad(angle) {
  return angle * Math.PI / 180;
}

function sin(theta) {
  theta = toRad(theta);
  return Math.sin(theta);
}
function cos(theta) {
  theta = toRad(theta);
  return Math.cos(theta);
}
function tan(theta) {
  theta = toRad(theta);
  return Math.tan(theta);
}
function asin(oh) {
  theta = Math.asin(oh);
  return toDeg(theta);
}
function acos(ah) {
  theta = Math.acos(ah);
  return toDeg(theta);
}
function atan(oa) {
  theta = Math.atan(oa);
  return toDeg(theta);
}

function abs(val) {
  return Math.abs(val);
}

function sqrt(val) {
  return Math.sqrt(Math.abs(val));
}

function hav(theta) {
  return (1 - cos(theta)) / 2;
}

function hav2(theta) {
  var sq = sin(theta / 2);
  return sq * sq;
}

function Loc (lat,lon,alt) {
  this.lat = toRad(lat);
  this.lon = toRad(lon);
}

function dist(loc1,loc2) {
  var gcd = hav(loc1.lon - loc2.lon);
  gcd *= cos(loc1.lat);
  gcd *= cos(loc2.lat);
  gcd += hav(loc1.lat - loc2.lat);
  gcd = sqrt(gcd);
  gcd = asin(gcd);
  gcd *= 2 * EarthRadius;
  return gcd;
}