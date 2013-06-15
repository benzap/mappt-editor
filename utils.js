// utils.js 

//http://ejohn.org/blog/simple-javascript-inheritance/
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);       
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})()

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

Array.prototype.each = function(callback){
    for (var i =  0; i < this.length; i++){
       if(typeof(this[i])!="undefined"){
          var res = callback(i, this[i]);
          if (res == false){
          	break
          }
       }
    }
}

Array.prototype.removeItem = function(item){
	var count = 0
	var a = this
    while(count < a.length){
		if(this[count] == item){
			a = a.remove(count)
		}
		else{
			count ++
		}
	}
	return a
}

Array.prototype.find = function(key, val){
    var ret = []
    var obj=this;
    obj.each(function(i, item){
      var current = item[key]
      if ((current == val && val != undefined) || (val == undefined && current)){
        ret.push(item)
      }
    })
    return ret
}

Array.prototype.last = function(){
  if(this.length > 0){
     return this[this.length-1]
  }
}

Array.prototype.prev = function(item){
  if(this.length > 0){
     return this[this.indexOf(item)-1]
  }
}

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var _isSame = function(a,b){
  var ret = true
    a.each(function(i,item){
      var item2 = b[i]
      if(item != item2){
        
       

        ret = false
        return false
      }
    })
   return ret
}

var _hasSameValues = function(a,b){
    for(var k in a){
      if(b[k] != a[k]){
        return false
      }
    }
    for(var k in b){
      if(b[k] != a[k]){
        return false
      }
    }
    return true
}

Array.prototype.isSame = function(list){
    if(this.length != list.length){
      return false
    }
    var same = true
    this.each(function(i,item){
      if(!_hasSameValues(item, list[i])){
        same = false
        return false
      }
    })
    return same
}

if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

function setupContenteditable(){

  $('[contenteditable]').live('focus', function() {

    var $this = $(this);
    $this.data('before', $this.html());
    return $this;
}).live('blur paste', function() {
    var $this = $(this);
    if ($this.data('before') !== $this.html()) {
        $this.data('before', $this.html());
        $this.trigger('change');
    }
    return $this;
});

}

function log(t1, t2, t3, t4, t5, t6, t7, t8, t9){
  if(typeof(console)=="object"){
      var a = [t1,t2,t3,t4,t5,t6,t7,t8,t9]
      a.each(function(i,v){
        if(v!=undefined){
          if(typeof v == "object")
            a[i] = ser(v)
          }
          else if(typeof v == "function"){
            a[i] = "function(){...}"
          }
      })
      console.log(a.join("\t"))
  }
}

function ser(t){
  return JSON.stringify(t)
}

if (!String.prototype.trim) {

  String.prototype.trim=function(){return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');};

  String.prototype.ltrim=function(){return this.replace(/^\s+/,'');};

  String.prototype.rtrim=function(){return this.replace(/\s+$/,'');};

  String.prototype.fulltrim=function(){return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};
}

String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
}

function toTable(s){
    var res = {}
    for(var i=0; i< s.length;i++){
      res[s[i]] = true
    }
    return res
}

Date.prototype.getDOY = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  return Math.ceil((this - onejan) / 86400000);
} 

function isArray(child){
  return Object.prototype.toString.call( child ) === '[object Array]'
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function getMatchResults(array, query) {
  /*if (query == undefined || query == ""){
    return array
  }*/
  var score = {};
  var matcher = function(item) {
    var q = query.toLowerCase()
    var start = 0
    var item2 = item.toLowerCase()
    var matches = []
    if(q.length == 0){
      score[item] = 1
      return true
    }
    for(var i = 0; i<q.length; i++) {
      var c = q[i]
      var index = item2.indexOf(c, start) 
      if (index == -1){
        return false
      }
      matches.push(index)
      start = index+1
    }
    var dist = (matches[matches.length-1] - matches[0])/q.length + matches[0]/q.length
    score[item] = Math.max(dist, 0.1)

    return true
  }

  score = {};
  var matches = [];
  if (query != "") {
    for (var i = 0; i < array.length; i++) {
      var item = array[i];
      if (matcher(item)) {
        matches.push(item);
      }
    }
  }
  matches.sort(function(a,b) {
    return score[a] - score[b];
  })

  return matches
}


function partialMatcher(name, query) {
  var q = query.toLowerCase()
  var start = 0
  var item2 = name.toLowerCase()
  var matches = []
  if(q.length == 0){
    return 1
  }
  for(var i = 0; i<q.length; i++) {
    var c = q[i]
    var index = item2.indexOf(c, start) 
    if (index == -1){
      return 
    }
    matches.push(index)
    start = index+1
  }
  var dist = (matches[matches.length-1] - matches[0])/q.length + matches[0]/q.length
  return Math.max(dist, 0.1)

}

 



function getMatches(tags, data2, searchString){
  var keyScore = {}
  var keyLookup = {}
  var invertedkeyLookup = {}
  var len1 = 1/tags.length
  
  var data = data2.slice()

  var dataHash = {}
  tags.each(function(i,tag){
    var cons = []
    for(var con in tag.context){
      cons.push(con)
    }
    cons.sort()
    var key = cons.join("_")
    keyScore[key] = (keyScore[key] || 0) + len1
    keyLookup[key] = tag.context

    cons.each(function(i, word){
      invertedkeyLookup[word] = (invertedkeyLookup[word] || 0) +  len1
      /*var set = invertedkeyLookup[word]
      if(!set){
        set = {}
        invertedkeyLookup[word] = set
      }
      set[key] =  keyScore[key]*/
      dataHash[word] = (dataHash[word] || 0) + 1
    })
  })

  for (var k in dataHash){
    data.push(k)
  }

  //og("ks", keyScore) // counts for eachs
 // log("k2", keyLookup) // faster
 // log("k2.1", invertedkeyLookup) // faster
  

  var parts = searchString.split(" ")
  var searchSet = _.intersection(parts, data)
  var partial = _.difference(parts, data)[0]

  //log("p", partial)

  //var searchSet = ["home", "work"]
  var searchInverted = {}
  var hasAnyMatches = false
  searchSet.each(function(i, item){
    hasAnyMatches = true
    searchInverted[item] = true
  })

  //log("k2.5", searchInverted) // exclude these from results
    
  
  var matched ={}
  searchSet.each(function(i, word){
    for(var k in keyLookup){
      var context = keyLookup[k]
      if(context[word]){
        for(var word2 in context){
          if(word!=word2 && !searchInverted[word2]){
            matched[word2] =  (i + 1) /  searchSet.length
          }
        }
      }
    }

  })

  //log("k3", matched) //next words rated by number of matches

  var score1 = {}
  for(var k in invertedkeyLookup){
    score1[k] = (hasAnyMatches ? (matched[k] || 0) : 1) * invertedkeyLookup[k]
  }

  //log("k4", score1) //score for these - without partials

  data.sort(function(a,b){
    return (score1[b] || 0) - (score1[a] || 0)
  })
  var res = []
  for(var i =0; i< data.length; i++){
    if(!searchInverted[data[i]]){
      res.push(data[i])
    }
  }
  var res2 = res

  //var res = data.slice()

  // todo - this is slow - could probably be faster
  var matchedTags = []
  tags.each(function(i,tag){
      var pass = true
      for(var k in searchInverted){
        if( !tag.context[k] ){
          pass = false
          break
        }
      }
      if(pass){
        matchedTags.push(tag)
      }
  })

  var counts = {} // used for left bar filter
  matchedTags.each(function(i, tag){
     for (var name in tag.context){
        counts[name] = (counts[name] || 0) +1
     }
  })

  //log("k4.5", data)

  if(partial){
    //var partial = "e"
    var filtered = getMatchResults(data, partial)

    // if 'home' came in, don't include it in the results
    filtered = _.filter(filtered, function(item){
        return !searchInverted[item]
    }) 

   // log("k5", filtered)

    var score2 = {}
    var len2 = filtered.length
    filtered.each(function(i, name){
      score2[name] = (len2 - i)/len2
    })
   // log("k6", score2)

    filtered.sort(function(a,b){
      var s1 = (score2[a] || 0) / 10 +(score1[a] || 0)
      var s2 = (score2[b] || 0) / 10 + (score1[b] || 0)
      return s2 - s1
    })

    //log("k7", filtered)

    res = filtered
  }

  //log("final", res)
  return {res:res, partial:partial, existing:res2, set:searchSet, matchedTags:matchedTags, counts:counts}
}

function filterSet(tags, searchTags){
  var filteredList = []
  tags.each(function(i,item){
    var pass = true
    
    for(var arrayType in searchTags){
      var itemArea = item[arrayType]
      var tagList = searchTags[arrayType]
      tagList.each(function(i2, tag){
        if(!itemArea[tag] ){
          pass = false
          return false
        }
      })
    }
    
    if(pass){
      filteredList.push(item)
    }
  })
  return filteredList
}



function getMatches2(tags, searchTags, partial){
  tags = tags || []
  var keyScore = {}
  var keyLookup = {}
  var invertedkeyLookup = {}
  var len1 = 1/tags.length

  // filter the set

  var filteredList = filterSet(tags, searchTags)
 
  // count the tags
  var overall = {context:{}, people:{}, tags:{}}
  filteredList.each(function(i, tag){
    for (var setName in overall){
      set = overall[setName]
      for(var tagName in tag[setName]){
        set[tagName] = (set[tagName] || 0) + 1
      }

    }

  })

  //{name:...
  //  context{x:true},  
  //  people{x:true}, 
  //  tags:{x:true} 
  //}

  // overall = {
  //   context: {home:5, work:78}, 
  //   people: {greg:10}, 
  //   tags: {'good idea': 11}
  // }

  // put them into arrays
  var overall2 = []
  for (var setName in overall){
    set = overall[setName]
    overall2.push({header:true, type: setName, name: setName})
    var miniList = []
    for(var tagName in set){
      var count = set[tagName]

      // find it?
      var seachArray = searchTags[setName]

      var selected = _.find(seachArray, function(val){return val == tagName}) || []
      if(!partial || partialMatcher(tagName, partial)){
         miniList.push({item:true, type: setName, name: tagName, count:count, selected: selected.length > 0})
      }
     
    }
    miniList.sort(function(a,b){
      if(a.selected == b.selected){
        return b.count - a.count
      }
      else{
        return (b.selected ?  1: 0)-( a.selected? 1: 0)
      }
      
    })
    overall2 = overall2.concat(miniList)
  }




  return {list:overall2, filteredList:filteredList}



}

function tonumber(val){
    var v = parseFloat(val)
    if (v.toString() == val){
      return v
    }
}
