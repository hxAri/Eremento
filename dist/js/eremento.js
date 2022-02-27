
/*
 * Eremento.JS v1.0.0
 *
 * @author hxAri
 * @create 26.02-2022
 * @update 27.02-2022
 * @github https://github.com/hxAri/
 *
 */
(function( global, factory ) {         
  if( typeof exports === "object" && typeof module !== "undefined" ) {
    module.exports = factory();
  } else {
    if( typeof define === "function" && define.amd ) {
      define( factory );
    } else {
      global.Eremento = factory();
    }
  }
}( this, function( Eremento = {} ) {
  
  return( Eremento = {
    object: {
      to: {
        string: function( e ) {
          return Object.prototype.toString.call( e ).replace( /\[object\s*(.*?)\]/, `$1` );
        }
      },
      is: function( e, is ) {
        return this.to.string( e ) === is;
      },
      array: function( e ) {
        return this.is( e, "Array" );
      },
      bigint: function( e ) {
        return this.is( e, "BigInt" );
      },
      number: function( e ) {
        return this.is( e, "Number" );
      },
      object: function( e ) {
        return this.is( e, "Object" );
      },
      regexp: function( e ) {
        return this.is( e, "RegExp" );
      },
      string: function( e ) {
        return this.is( e, "String" );
      },
      boolean: function( e ) {
        return this.is( e, "Boolean" );
      },
      function: function( e ) {
        return this.is( e, "Function" );
      },
      undefined: function( e ) {
        return this.is( e, "Undefined" );
      }
    },
    regexp: [
      {
        match: /\</g,
        replace: "&#60;"
      },
      {
        match: /\>/g,
        replace: "&#62;"
      },
      {
        match: /\"/g,
        replace: "&#34;"
      },
      {
        match: /\'/g,
        replace: "&#39;"
      }
    ],
    fn: {
      replace: function( s ) {
        for( let i in Eremento.regexp ) {
          s = s.replace( Eremento.regexp[i].match, Eremento.regexp[i].replace )
        }
        return s;
      },
      attribute: function( e, a ) {
        for( let i in a.attr ) {
          if( i === "innerHTML" ) {
            Eremento.fn.innerHTML( e, a.attr[i], Eremento.object.undefined( a.inner.replace ) ? true : a.inner.replace );
          } else {
            e[i] = a.attr[i];
          }
        }
        return e;
      },
      innerHTML: function( e, v, r ) {
        if( Eremento.object.array( v ) ) {
          for( let i in v ) {
            if( Eremento.object.object( v[i] ) ) {
              v[i] = Eremento.create( v[i].el, v[i] );
            }
            e.appendChild( v[i] );
          }
        } else {
          if( r ) {
            v = Eremento.fn.replace( v );
          }
          e.innerHTML = v;
        }
        return e;
      }
    },
    create: function( e, p ) {
      if( Eremento.object.array( e ) ) {
        for( let i in e ) {
          e[i] = this.create( e[i].el, e[i] );
        }
        return e;
      } else {
        return( Eremento.fn.attribute( document.createElement( e ), p ) );
      }
    }
  });
  
}));