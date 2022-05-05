/*
 * Eremento v1.0.4
 *
 * @author hxAri
 * @create 27.02-2022
 * @update 06.05-2022
 * @github https://github.com/hxAri
 *
 * All source code license under MIT.
 * Please see the MIT documentation for details.
 *
 * Copyright (c) 2022 hxAri <ari160824@gmail.com>
 */
( function( global, factory ) {
    if( typeof exports === "object" && typeof module !== "undefined" ) {
        module.exports = factory();
    } else {
        if( typeof define === "function" && define.amd ) {
            define( factory );
        } else {
            global.Eremento = factory();
        }
    }
}( this, function() {
    
    const $Error = 3;
    const $TypeError = 3517;
    const $AttributeError = 3526;
    const $ParameterError = 3534;
    const $ReferenceError = 3536;
    const $ConnectionError = 3548;
    const $UnexpectedError = 3561;
    
    function Null()
    {
        return( null );
    }
    
    function Defined( args )
    {
        return( typeof args !== "undefined" );
    }
    
    function Undefined( args )
    {
        return( typeof args === "undefined" );
    }
    
    /*
     * Get value type or match value type.
     *
     * @params Mixed $params
     * @params Function $object
     * @params Function $handler
     * @params Function $catcher
     *
     * @return Mixed
     */
    const $Type = function( params, object, handler, catcher )
    {
        var closure = {
            handler: () => typeof handler === "function" ? handler( params ) : true,
            catcher: () => typeof catcher === "function" ? catcher( params ) : false
        };
        
        if( typeof object === "function" )
        {
            return( $Type( params ) === object.name ? closure.handler() : closure.catcher() );
        } else {
            if( typeof object === "object" )
            {
                for( let i in object )
                {
                    if( $Type( params, object[i] ) )
                    {
                        return( closure.handler() );
                    }
                }
                return( closure.catcher() );
            }
        }
        return( Object.prototype.toString.call( params ).replace( /\[object\s*(.*?)\]/, `$1` ) );
    };
    
    /*
     * Display error messages by error type or level.
     *
     * @params Number $type
     * @params Object $option
     */
    const $Except = function( type, option )
    {
        if( $Type( type, Number ) && $Type( option, [ String, Object ] ) )
        {
            switch( type )
            {
                case $Error:
                    break;
                case $TypeError:
                    if( option.on && option.name && option.type && option.vtype )
                    {
                        console.error( `${option.on}: The value of the ${option.type} ${option.name} must be of type ${option.vtype}, ${$Type( option.given )} given.` );
                    }
                    break;
                case $AttributeError:
                    if( option.on && option.name )
                    {
                        if( option.type )
                        {
                            console.error( `${option.on}: Attribute .${option.name} must be of type ${option.type}, ${$Type( option.given )} given.` );
                        } else {
                            if( option.value )
                            {
                                if( $Type( option.value, Array ) )
                                {
                                    option.value = option.value.join( "|" );
                                }
                                console.error( `${option.on}: The .${option.name} attribute must have a value of /${option.value}/, ${option.given} is given.` );
                            } else {
                                console.error( `${option.on}: The .${option.name} attribute is undefined or may be deleted.` );
                            }
                        }
                    }
                    break;
                case $ParameterError:
                    if( option.on && option.name )
                    {
                        if( option.type )
                        {
                            console.error( `${option.on}: The parameter ${option.name} must be of type ${option.type}, ${$Type( option.given )} given.` );
                        } else {
                            if( option.value )
                            {
                                if( $Type( option.value, Array ) )
                                {
                                    option.value = option.value.join( "|" );
                                }
                                console.error( `${option.on}: The ${option.name} parameter must have a value of /${option.value}/, ${option.given} is given.` );
                            } else {
                                console.error( `${option.on}: The ${option.name} parameter is undefined.` );
                            }
                        }
                    }
                    break;
                case $ReferenceError:
                    if( option.on && option.name && option.type )
                    {
                        console.error( `${option.on}: The ${option.type} reference ${option.name} is undefined.` );
                    }
                    break;
                case $ConnectionError:
                    break;
                case $UnexpectedError:
                    break;
                default:
                    break;
            }
            return;
        }
        $Except( $UnexpectedError, "" );
    };
    
    /*
     * Build single element HTML.
     *
     * @params Object $params
     *
     * @return HTMLElement
     */
    function create( el )
    {
        if( $Type( el.name, String ) )
        {
            
            // Create root element.
            var root = document.createElement( el.name );
            
            // If the element has no data.
            if( $Type( el.data, Undefined ) )
            {
                el.data = {};
            }
            
            // Inject data.
            root.data = el.data;
            
            // If element has attribute.
            if( $Type( el.self, Object ) )
            {
                for( let i in el.self )
                {
                    switch( i )
                    {
                        case "data":
                        case "dataset":
                            if( $Type( el.self[i], Object ) )
                            {
                                for( let d in el.self[i] )
                                {
                                    root.dataset[d] = replace( el.self[i][d] );
                                }
                            } else {
                                $Except( $AttributeError, {
                                    on: "Element.create",
                                    name: i,
                                    type: "Object",
                                    given: el.self[i]
                                });
                            }
                            break;
                        case "innerHTML":
                            if( $Type( el.self.innerHTML, Array ) )
                            {
                                multiple( root, el.self.innerHTML );
                            } else {
                                if( $Type( el.self.innerHTML, Object ) )
                                {
                                    root.appendChild( create( el.self.innerHTML ) )
                                } else {
                                    root.innerHTML = replace( el.self.innerHTML );
                                }
                                
                            }
                            break;
                        default:
                            if( $Type( el.self[i], String ) )
                            {
                                el.self[i] = replace( el.self[i] );
                            }
                            root[i] = el.self[i];
                            break;
                    }
                }
            }
            
            return( root );
        } else {
            return( $Except( $AttributeError, {
                on: "Element.create",
                name: "name",
                type: "String",
                given: el.name
            }));
        }
    }
    
    /*
     * Build or add more than one HTML element to root.
     *
     * @params HTMLElement, Array $root
     * @params Array $params
     *
     * @return Array
     */
    function multiple( root, els )
    {
        if( $Type( els, Array ) )
        {
            for( let i in els )
            {
                root.appendChild( create( els[i] ) )
            }
            return( root );
        }
        if( $Type( root, Array ) )
        {
            return( multiple( {}, root ) );
        }
        for( let i in els )
        {
            els[i] = single( els[i] );
        }
        return( els );
    }
    
    /*
     * Replace sensitive characters.
     *
     * @params String $string
     *
     * @return String
     */
    function replace( string )
    {
        return(
            String( string )
            .replace( /\&/g, "&amp;" )
            .replace( /\</g, "&#60;" )
            .replace( /\>/g, "&#62;" )
            .replace( /\"/g, "&#34;" )
            .replace( /\'/g, "&#39;" )
        );
    }
    
    return({
        type: $Type,
        except: $Except,
        create: create,
        multiple: multiple
    });
    
}));
