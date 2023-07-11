/*
 * Eremento v1.0.5
 *
 * @author hxAri
 * @create 27.02-2022
 * @update -
 * @github https://github.com/hxAri
 * @source https://github.com/hxAri/Eremento
 *
 * All source code license under MIT.
 * Please see the MIT documentation for details.
 *
 * Copyright (c) 2022 hxAri <hxari@proton.me>
 */
( function( global, factory )
{
	if( typeof exports === "object" &&
		typeof module !== "undefined" )
	{
		module.exports = factory();
	}
	else {
		if( typeof define === "function" && define.amd )
		{
			define( factory );
		}
		else {
			global.Eremento = factory();
		}
	}
}( this, function()
{
	/*
	 * Return if tag name is paired.
	 *
	 * @params String tag
	 *  HTML tag name
	 *
	 * @return Boolean
	 */
	const paired = tag => unpaired( tag ) === false;
	
	/*
	 * Return if tag name is unpaired.
	 *
	 * @params String tag
	 *  HTML tag name
	 *
	 * @return Boolean
	 */
	const unpaired = tag => /^(?:area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i.exec( tag ) !== null;
	
	/*
	 * Allow anything value call.
	 *
	 * @params Mixed ...kwargs
	 *
	 * @return Mixed
	 */
	function callable( ...kwargs )
	{
		// Check if function has argument passed.
		if( kwargs.length > 0 )
		{
			// Check if first argument passed is Function type.
			if( typeof kwargs[0] === "function" )
			{
				// Get function passed.
				var func = kwargs[0];
				
				// Unset function from argument passed.
				delete kwargs[0];
				
				// Return callback function.
				return( func( ...kwargs ) );
			}
			return( kwargs[0] );
		}
	};
	
	/*
	 * Replace sensitive characters.
	 *
	 * @params String $string
	 *
	 * @return String
	 */
	function replace( string )
	{
		return( String( string )
			.replace( /\&/g, "&amp;" )
			.replace( /\</g, "&#60;" )
			.replace( /\>/g, "&#62;" )
			.replace( /\"/g, "&#34;" )
			.replace( /\'/g, "&#39;" )
		);
	}
	
	/*
	 * Get value type.
	 *
	 * @params Mixed argv
	 * @params Function type
	 * @params Function handler
	 * @params Function catcher
	 *
	 * @return Mixed
	 */
	function typedef( argv, type, handler, catcher )
	{
		// Get name type of type.
		var typeName = typeof type;
		
		// Get name type of argument value.
		var argvName = typeof argv === "function" ? ( argv.name !== "" ? argv.name : "Window" ) : Object.prototype.toString.call( argv ).replace( /\[object\s*(.*?)\]/, `$1` );
		
		// Callbacks.
		var callbackHandler = () => typeof handler === "function" ? handler() : true;
		var callbackCatcher = () => typeof catcher === "function" ? catcher() : false;
		
		// If `type` is Function type.
		if( typeName === "function" )
		{
			// Get function name.
			var funcName = type.name !== "" ? type.name : "Window";
			
			// If `argv` is equal Function name.
			return( callable( argvName === funcName ? callbackHandler : callbackCatcher, argv ) );
		}
		
		// If `type` is Object type.
		else if( typeName === "object" )
		{
			// Get object name.
			var objName = Object.prototype.toString.call( type ).replace( /\[object\s*(.*?)\]/, `$1` );
			
			// If object type is Array.
			if( objName === "Array" )
			{
				for( let i in type )
				{
					// If `argv` is equals `type[i]`.
					if( typedef( argv, type[i] ) )
					{
						return( callable( callbackHandler, argv ) );
					}
				}
			}
			return( callable( argvName === objName ? callbackHandler : callbackCatcher, argv ) );
		}
		
		// If `object` is String type.
		else if( typeName === "string" )
		{
			// If `argv` is equal String value.
			return( callable( argvName === type ? callbackHandler : callbackCatcher, argv ) );
		}
		return( argvName );
	};
	
	/*
	 * Arrange or create raw html syntax.
	 *
	 * @params Array<HTMLElement|Object>|HTMLElement|Object name
	 * @params Object attributes
	 *
	 * @return String
	 *  Html raw string syntax
	 */
	function arrange( name, attributes = {} )
	{
		// If element is multiple or more than one.
		if( typedef( name, Array ) )
		{
			var elements = [];
			for( let i in name )
			{
				elements[i] = arrange( name[i].name, typedef( name[i].attributes, Object ) ? name[i].attributes : {} );
			}
			return( elements.join( "\n" ) );
		}
		
		// If element is Object type.
		else if( typedef( name, Object ) )
		{
			return( arrange( name.name, typedef( name.attributes, Object ) ? name.attributes : {} ) );
		}
		
		// If element is HTMLElement.
		else if( typedef( name ).match( /^HTML[a-zA-Z]+Element/ ) )
		{
			// Create dummy element.
			var dummy = create( "div", {} );
				dummy.appendChild( name );
			
			// Return innerHTML from dummy.
			return( dummy.innerHTML );
		}
		else {
			
			var element = `<${name}`;
			var innerHTML = "";
			
			for( let key in attributes )
			{
				// If attribute is style.
				if( key.match( /^style$/i ) )
				{
					if( typedef( attributes[key], Object ) )
					{
						// Stack styles.
						var styles = "";
						
						// Append style property.
						for( let style in attributes[key] )
						{
							styles += `\x20${style.replace( /[A-Z]/, m => "-" + m.toLowerCase() )}: ${attributes[key][style]};`;
						}
						attributes[key] = styles.trim();
					}
				}
				
				if( key.match( /^innerText$/i ) )
				{
					innerHTML = attributes[key];
					continue;
				}
				
				if( key.match( /^innerHTML$/i ) )
				{
					// If inner is Single Element Object or HTMLElement.
					if( typedef( attributes[key] ).match( /^HTML[a-zA-Z]+Element|Object/ ) ) attributes[key] = [ attributes[key] ];
					
					// If inner is Multiple Element Object.
					if( typedef( attributes[key], Array ) )
					{
						for( let i in attributes[key] )
						{
							innerHTML += arrange( attributes[key][i] );
						}
					}
					else {
						/** innerHTML += replace( attributes[key] ); **/
						innerHTML += attributes[key];
					}
					continue;
				}
				
				// If attribute is dataset.
				if( key.match( /^(?:data|dataset)$/i ) )
				{
					// Skip append if dataset is not Object.
					if( typedef( attributes[key], Object ) === false ) continue;
					
					// Append datasets.
					for( let data in attributes[key] )
					{
						element += `\x20data-${data}="${attributes[key][data]}"`;
					}
					continue;
				}
				element += `\x20${key}="${attributes[key]}"`;
			}
			element += paired( name ) ? `>${innerHTML}</${name}>` : "/>";
		}
		return( element );
	}
	
	/*
	 * Create HTMLElement.
	 *
	 * @params String name
	 *  HTML Element tag name
	 * @params Object attributes
	 *  HTML Element attributes
	 *
	 * @return HTMLElement
	 */
	function create( name, attributes = {} )
	{
		var element = document.createElement( name );
		
		// Check if attribute is Object type.
		if( typedef( attributes, Object ) )
		{
			for( let key in attributes )
			{
				var match = null;
				
				// If attribute is dataset.
				if( key.match( /^(?:data|dataset)$/i ) )
				{
					// Append if dataset is not Object.
					if( typedef( attributes[key], Object ) )
					{
						// Append datasets.
						for( let data in attributes[key] )
						{
							element.dataset[data] = attributes[key][data];
						}
					}
					continue;
				}
				
				// If attribute is single dataset.
				else if( match = /^data\-(?<data>[a-zA-Z0-9\-]+)/i.exec( key ) )
				{
					// Add single datasets.
					element.dataset[match.groups.data] = attributes[key];
					continue;
				}
				
				// If attribute is style.
				else if( key.match( /^style$/i ) )
				{
					// Only object can be sets.
					if( typedef( attributes[key], Object ) )
					{
						// Append style property.
						for( let style in attributes[key] )
						{
							element.style[style.replace( /\-[a-z]/, m => m[1].toUpperCase() )] = attributes[key][style];
						}
					}
				}
				
				// If attribute name is innerHTML.
				else if( key.match( /^innerHTML$/i ) )
				{
					// If inner is Single Element Object or HTMLElement.
					if( typedef( attributes[key] ).match( /^HTML[a-zA-Z]+Element|Object/ ) ) attributes[key] = [ attributes[key] ];
					
					// If inner is Multiple Element Object.
					if( typedef( attributes[key], Array ) )
					{
						// Append multiple elements.
						multiple( element, attributes[key] );
					}
					else {
						element.innerHTML = replace( attributes[key] );
					}
					continue;
				}
				
				// If attribute is callable.
				else if( typedef( attributes[key], [ Function, key ] ) )
				{
					// Set event listener for element.
					element.addEventListener( key, attributes[key] );
				}
				else {
					
					// Set new attribute for element.
					element.setAttribute( key, attributes[key] );
					
					// Check if attribute does not sets.
					if( element[key] !== attributes[key] )
					{
						// Re-set attribute for element.
						element[key] = attributes[key];
						element.removeAttribute( key );
					}
				}
			}
		}
		return( element );
	}
	
	/*
	 * Create multiple HTMLElement.
	 *
	 * @params HTMLElement append
	 *  Automatically append element into parent.
	 * @params Array<Object> elements
	 *  See `create` function
	 *
	 * @return Array<HTMLElement>
	 */
	function multiple( append, elements )
	{
		if( typedef( append, Array ) ) return( multiple( null, append ) );
		if( typedef( elements, Array ) )
		{
			for( let i in elements )
			{
				// Create new element.
				elements[i] = create( elements[i].name, elements[i].attributes ? elements[i].attributes : {} );
				
				// If root element is available.
				if( typedef( append ).match( /^HTML[a-zA-Z]+Element$/ ) )
				{
					append.appendChild( elements[i] );
				}
			}
		}
		return( elements );
	}
	return({
		arrange: arrange,
		create: create,
		paired: paired,
		replace: replace,
		multiple: multiple,
		unpaired: unpaired
	});
}));