// (?<=[0-9]{2}),(?=[0-9]{2})
// (?<=[0-9])"

(function(){

var $  = document.getElementById.bind(document);
var $$ = document.querySelectorAll.bind(document);

var App = function($el){
  this.$el = $el;
  this.load();

  this.$el.addEventListener(
    'submit', this.submit.bind(this)
  );

  if (this.dob) {
    this.renderAgeLoop();
  } else {
    this.renderChoose();
  }
};

App.fn = App.prototype;

App.fn.load = function(){
  var value;

  if (value = localStorage.dob)
    this.dob = new Date(parseInt(value));
    this.gender = localStorage.gender;
    this.year = localStorage.year;
};

App.fn.save = function(){
  if (this.dob)
    localStorage.dob = this.dob.getTime();
    localStorage.gender = this.gender;
    localStorage.year = this.year;
};

App.fn.submit = function(e){
  e.preventDefault();

  var input = this.$$('input')[0];
  if ( !input.valueAsDate ) return;

  var genderElem = this.$$('select');
  if (!genderElem[0]) return;

  var gender = genderElem[0].value;

  var year = new Date(input.value).getFullYear();
  
  this.gender = gender;
  this.dob = input.valueAsDate;
  this.year = year;

  this.save();
  this.renderAgeLoop();
};

App.fn.renderChoose = function(){
  this.html(this.view('dob')());
};

App.fn.renderAgeLoop = function(){
  this.interval = setInterval(this.renderAge.bind(this), 100);
};

App.fn.getLifespan = function (yearofbirth, gender) {
  return data.find(elm => elm.year == yearofbirth)[gender];
}

App.fn.renderAge = function(){
  var now       = new Date
  var duration  = now - this.dob;

  var lifespan = this.getLifespan(this.year, this.gender);  
  var years = duration / 31556900000;

  var diff = lifespan - years;
  var majorMinor = diff.toFixed(9).toString().split('.');

  requestAnimationFrame(function(){
    this.html(this.view('age')({
      year:         majorMinor[0],
      milliseconds: majorMinor[1]
    }));
  }.bind(this));
};

App.fn.$$ = function(sel){
  return this.$el.querySelectorAll(sel);
};

App.fn.html = function(html){
  this.$el.innerHTML = html;
};

App.fn.view = function(name){
  var $el = $(name + '-template');
  return Handlebars.compile($el.innerHTML);
};

window.app = new App($('app'))

})();
