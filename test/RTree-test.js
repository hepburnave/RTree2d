define([
  'rtree/RTree'
], function(RTree) {

  module("RTree");

  var OBS = [
    {"l": 20, "b": 161, "r": 26, "t": 161},
    {"l": -429, "b": 451, "r": -427, "t": 452},
    {"l": 365, "b": 236, "r": 367, "t": 236},
    {"l": -209, "b": 54, "r": -203, "t": 62},
    {"l": -199, "b": 73, "r": -195, "t": 80},
    {"l": 195, "b": 346, "r": 199, "t": 352},
    {"l": -486, "b": 213, "r": -477, "t": 216},
    {"l": -384, "b": -306, "r": -381, "t": -299},
    {"l": -198, "b": -196, "r": -188, "t": -186},
    {"l": 453, "b": 499, "r": 456, "t": 507},
    {"l": -265, "b": 421, "r": -264, "t": 423},
    {"l": -146, "b": -323, "r": -145, "t": -315},
    {"l": -278, "b": -359, "r": -277, "t": -355},
    {"l": -325, "b": 173, "r": -323, "t": 180},
    {"l": 32, "b": -280, "r": 37, "t": -271},
    {"l": -103, "b": 446, "r": -99, "t": 454},
    {"l": -422, "b": -48, "r": -420, "t": -43},
    {"l": 402, "b": 148, "r": 409, "t": 153},
    {"l": 495, "b": -473, "r": 496, "t": -471},
    {"l": 316, "b": 446, "r": 320, "t": 455}
  ];

  function randomOb() {
    var ob = {};
    ob.l = Math.floor((Math.random() * 1000) - 500);
    ob.b = Math.floor((Math.random() * 1000) - 500);
    ob.r = ob.l + Math.round(Math.random() * 10);
    ob.t = ob.b + Math.round(Math.random() * 10);
    return ob;
  }

  function randomObDub() {
    var ob = {};
    ob.l = ((Math.random() * 1000) - 500);
    ob.b = ((Math.random() * 1000) - 500);
    ob.w = (Math.random() * 10);
    ob.h = (Math.random() * 10);
    ob.r = ob.l + ob.w;
    ob.t = ob.b + ob.h;
    return ob;
  }


  test("insert", function() {

    var rt = new RTree();

    var ob = {};
    r = rt.insert(ob, 101, 101, 1, 1);

    equal(r, rt, 'should return itself');

  });

  test("insert. x3", function() {

    var rt = new RTree({
      bf: 3
    });

    var ob = {    };
    var r = rt.insert(ob, -1, -1, 2, 2);

    ob = {};
    r = rt.insert(ob, 3, 3, 1, 1);

    ob = {};
    r = rt.insert(ob, 100, 100, 1, 1);

    equal(rt.size(), 3, 'should keep track of size');

  });


  test("insert. x4 - with split and grow", function() {

    rt = new RTree({
      bf: 3
    });

    var ob = {};
    var r = rt.insert(ob, -1, -1, 2, 2);

    ob = {};
    r = rt.insert(ob, 3, 3, 1, 1);


    ob = {};
    r = rt.insert(ob, -100, -100, 1, 1);

    ob = {};
    r = rt.insert(ob, 100, 100, 101, 101);

    equal(rt.size(), 4, 'should keep track of size');


  });

  test("insert - determinate", function() {

    var rt = new RTree({
      bf: 3
    });


    var b = Date.now();
    var ob;
    for (var i = 0; i < OBS.length; i += 1) {
      ob = OBS[i];
      rt.insert(ob, ob.l, ob.b, ob.r - ob.l, ob.t - ob.b);
    }
    equal(rt.size(), OBS.length, "should keep track of size (" + OBS.length + ")");


  });

  test("remove", function() {

    var rt = new RTree({
      bf: 3
    });

    var ob;
    for (var i = 0; i < OBS.length; i += 1) {
      ob = OBS[i];
      rt.insert(ob, ob.l, ob.b, ob.r - ob.l, ob.t - ob.b);
    }

//    rt._root.__validate();

    var size = rt.size();
    ob = OBS[0];
    var r = rt.remove(ob, ob.l, ob.b, ob.r - ob.l, ob.t - ob.b);
    equal(rt.size(), size - 1, 'should have removed one');
//    rt._root.__validate();

    //try remove the same
    var r = rt.remove(ob, ob.l, ob.b, ob.r - ob.l, ob.t - ob.b);
    equal(rt.size(), size - 1, 'should not have removed anything');


  });

  test("removeinsert", function() {

    var rt = new RTree({
      bf: 3
    });

    var ob;
    for (var i = 0; i < OBS.length; i += 1) {
      ob = OBS[i];
      rt.insert(ob, ob.l, ob.b, ob.r - ob.l, ob.t - ob.b);
    }

    rt._root.__validate();
    equal(rt.size(), OBS.length, "all ekements should have been inserted");

    for (var i = 0; i < OBS.length; i += 1) {
      ob = OBS[i];
      rt.remove(ob, ob.l, ob.b, ob.r - ob.l, ob.t - ob.b);
      if (rt._root) {
        rt._root.__validate();
      }
    }

    equal(rt.size(), 0, "all ekements should have been removed");
    for (var i = 0; i < OBS.length; i += 1) {
      ob = OBS[i];
      rt.insert(ob, ob.l, ob.b, ob.r - ob.l, ob.t - ob.b);
      if (rt._root) {
        rt._root.__validate();
      }
    }
    equal(20, rt.size(), "all ekements should have been inserted again");

    var r = rt.search(OBS[0]);
    console.log('r', r);

  });

  test("insert - some (random)", function() {

    var rt = new RTree({
      bf: 3
    });

    var total = 100;
    var ob;
    for (var i = 0; i < total; i += 1) {
      ob = randomOb();
      rt.insert(ob, ob.l, ob.b, ob.w, ob.h);
    }

    equal(rt.size(), total, "should keep track of size (" + total + ")");
  });


  test("add - many (random)", function() {

    var bf = 12;
    var rt = new RTree({
      bf: bf
    });

    var total = 50000;
    var ob;

    for (var i = 0; i < total; i += 1) {
      ob = randomObDub();
      rt.insert(ob, ob.l, ob.b, ob.w, ob.h);
    }
    rt._root.__validate();
    console.log('inserted', total);
    equal(rt.size(), total, "should keep track of size (" + total + ")");
  });


});