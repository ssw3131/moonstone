/**
 * Created by ssw on 2014-05-26.
 */

(function(){
    var W = window, Doc = document, Head = Doc.getElementsByTagName( "head" )[ 0 ],
        DkGl, Detector, _core,
        _gl, _canvas,
        _vsObj, _fsObj, _programObj,
        _posVBO, _indexVBO, _textureVBO,
        _mtrP, _mtrMV;

    //----------------------------------------------------------------------------------------------------------------------------------------------//
    // DkGl
    DkGl = W.DkGl = { Information : { name : "Dk moonstone", version : "v0.0.0.1", contact : "ssw3131@daum.net" } },

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // Detector
        // todo 외부연동
        (function(){
            var agent = W.navigator.userAgent.toLowerCase(),
                browser , browserVersion;

            function regTest( $regExp, $testStr ){
                return  $regExp.test( $testStr )
            }

            checkBrowser()
            function checkBrowser(){
                var finded;

                function isMobile(){
                    if( regTest( /mobile/, agent ) ) return "mobile "
                    else return ""
                }

                function ie(){
                    finded = regTest( /msie/, agent )
                    if( !finded && agent.indexOf( 'trident' ) ) return browser = isMobile() + "ie" , browserVersion = 11, finded
                    else if( finded ) return browser = isMobile() + "ie" , browserVersion = /msie ([\d]+\.[\d]+)/.exec( agent )[1], finded
                }

                function chrome(){
                    var i;
                    if( agent.indexOf( i = 'chrome' ) < 0 && agent.indexOf( i = 'crios' ) < 0 ) return;
                    return browser = 'chrome', browserVersion = parseFloat( ( i == 'chrome' ? /chrome\/([\d]+)/ : /webkit\/([\d]+)/ ).exec( agent )[1] )
                }

                function firefox(){
                    finded = regTest( /firefox/, agent )
                    if( finded ) return    browser = isMobile() + "firefox", browserVersion = /firefox\/([\d]+\.[\d]+)/.exec( agent )[1], finded
                }

                function opera(){
                    finded = regTest( /opr/, agent )
                    if( finded ) return browser = isMobile() + "opera", browserVersion = /opr\/([\d]+\.[\d]+)/.exec( agent )[1], finded
                }

                function safari(){
                    finded = regTest( /safari/, agent )
                    if( finded ) return browser = isMobile() + "safari", browserVersion = /safari\/([\d]+\.[\d]+)/.exec( agent )[1], finded
                }

                return ie() || opera() || chrome() || firefox() || safari();
            }

            DkGl.Detector = Detector = {
                browser : browser, browserVersion : browserVersion,
                isMobile : browser.indexOf( "mobile" ) > -1 ? 1 : 0,
                touchBool : W.ontouchstart !== undefined,
                wheelEvent : (browser == "firefox") ? "DOMMouseScroll" : "mousewheel"
            }
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // core
        (function(){
            var dtt = Detector, cRet, cTs;
            DkGl.core = _core = {
                push : Array.prototype.push,
                slice : Array.prototype.slice,
                indexOf : Array.prototype.indexOf,
                splice : Array.prototype.splice,
                join : Array.prototype.join,
                toString : cTs = Object.prototype.toString,
                hasOwn : Object.prototype.hasOwnProperty,
                trim : String.prototype.trim,
                replaceEventType : cRet = ( dtt.touchBool ) ? { mousedown : "touchstart", mousemove : "touchmove", mouseup : "touchend" } : {},

                // addEvent
                addEvent : (function(){
                    if( dtt.touchBool ){
                        return function( $e, $et, $cb, $cap ){
                            if( $et == "mouseover" || $et == "mouseout" ) return;
                            $et = cRet[ $et ] ? cRet[ $et ] : $et,
                                $e.addEventListener( $et, $cb, $cap );
                        }
                    } else {
                        return function( $e, $et, $cb, $cap ){
                            $e.addEventListener( $et, $cb, $cap );
                        }
                    }
                })(),

                // delEvent
                delEvent : (function(){
                    if( dtt.touchBool ){
                        return function( $e, $et, $cb, $cap ){
                            if( $et == "mouseover" || $et == "mouseout" ) return;
                            $et = cRet[ $et ] ? cRet[ $et ] : $et,
                                $e.removeEventListener( $et, $cb, $cap );
                        }
                    } else {
                        return function( $e, $et, $cb, $cap ){
                            $e.removeEventListener( $et, $cb, $cap );
                        }
                    }
                })(),

                // ad manager
                adManager : function( $sF, $eF ){
                    return (function(){
                        var list = [], total = 0;

                        return {
                            add : function( $k, $v ){
                                if( list[ $k ] == undefined )
                                    return list[ list[ $k ] = list.length ] = { key : $k, value : $v },
                                            ++total == 1 ? $sF() : null,
                                        true;
                                else return false; //trace( "Dk : list에 이미 " + $k + "값이 존재합니다." )
                            },

                            del : function( $k ){
                                // if( list[ $k ] == undefined ) return trace( "Dk : list에 " + $k + "값이 존재하지 않습니다." );
                                if( list[ $k ] == undefined ) return;
                                var t0 = list[ $k ], k;
                                list.splice( t0, 1 ), delete list[ $k ];
                                for( k in list ) list[ k ] >= t0 ? list[ k ] -= 1 : null;
                                --total ? null : $eF();
                            },

                            getList : function(){ return list; }
                        }
                    })()
                },

                // 객체의 타입이 맞는지 체크
                // todo is 확장
                is : (function(){
                    var t0 = { "array" : "[object Array]", "function" : "[object Function]", "string" : "[object String]", "number" : "[object Number]", "object" : "[object Object]" };
                    return function( $t, $o ){ return $o !== undefined && $o !== null && t0[ $t ] === cTs.call( $o ); }
                })(),

                // throw error
                throwError : function( $m ){
                    throw new Error( $m );
                }
            }
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // log
        (function(){
            if( W.log ) return W.log( "DkGl : log가 이미 존재합니다." );
            var log, logArr = [], cr = _core, cJoin = cr.join, e0, e1, toggle, x = 710, y = 10, w = 800;

            e0 = Doc.createElement( "div" ),
                e0.style.cssText = "left : " + x + "px; top : " + ( y + 22 ) + "px; width : " + w + "px; height : 90%; " +
                    "position : fixed; display : block; overflow : auto; padding : 10px; background-color : #000; font : 12px/18px 돋움, sans-serif; color : #FFF; opacity : 0.8; z-index : 10000000;",
                e1 = Doc.createElement( "div" ),
                e1.style.cssText = "left : " + x + "px; top : " + y + "px; width : " + ( w + 10 ) + "px; height : 20px; " +
                    "position : fixed;display : block; padding-left : 10px; background-color : #000; font : 12px/18px 돋움, sans-serif; color : #FFF; opacity : 0.8; z-index : 10000000;",

                W.log = log = (function(){
                    return function(){
                        var a = arguments, str;
                        if( a.length > 1 )
                            str = cJoin.call( a, ',' ), logArr.splice( 0, 0, str ), console.log( str );
                        else
                            logArr.splice( 0, 0, a[ 0 ] ), console.log( a[ 0 ] );
                        toggle ? e0.innerHTML = logArr[ 0 ] + "<br>" + e0.innerHTML : null;
                    }
                })(),

                log.show = function(){
                    var body = Doc.body;
                    e0.innerHTML = cJoin.call( logArr, "<br>" ), body.appendChild( e0 ), body.appendChild( e1 ), toggle = true;
                },

                log.hide = function(){
                    var body = Doc.body;
                    body.removeChild( e0 ), body.removeChild( e1 ), toggle = false;
                }
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // init
        (function(){
            DkGl.init = function( $id, $shader, $callBack ){
                _core.addEvent( Doc, "DOMContentLoaded", function(){
                    DkGl.loader.text( $shader, function( $data ){
                        Head.innerHTML += $data,

                            initCanvas( $id ),
                            initGl(),
                            initShader(),
                            initBuffer(),
                            initMatrix(),

                            resize(),
                            DkGl.Resize.add( "DkGl", resize ),
                            DkGl.Loop.add( "DkGl", render ),
                            $callBack();
                    } );
                } );
            }

            //----------------------------------------------------------------------------------------------------------------------------------------------//
            // canvas
            function initCanvas( $id ){
                DkGl.canvas = _canvas = Doc.getElementById( $id );
            }

            //----------------------------------------------------------------------------------------------------------------------------------------------//
            // gl
            function initGl(){
                DkGl.gl = _gl = _canvas.getContext( "webgl" ) || _canvas.getContext( "experimental-webgl" ) || _canvas.getContext( "webkit-3d" ) || _canvas.getContext( "moz-webgl" );

                if( _gl ) _gl.enable( _gl.DEPTH_TEST );
                else throw new Error( "DkGl : 이 브라우저에서는 WebGL은 사용이 불가능 합니다." );
            }

            //----------------------------------------------------------------------------------------------------------------------------------------------//
            // shader
            function initShader(){
                _vsObj = {}, _fsObj = {}, _programObj = {};

                // color
                _programObj.color = makeProgram( "shader-vs-color", "shader-fs-color", [ "aVertexPosition" ], [ "uMatrixP", "uMatrixMV", "uColor" ] );
            }

            function makeProgram( $vs, $fs, $aArr, $uArr ){
                var verSd, fragSd, prg, i, aStr, uStr;
                verSd = _vsObj[ $vs ] ? _vsObj[ $vs ] : getShader( $vs ),
                    fragSd = _fsObj[ $fs ] ? _fsObj[ $fs ] : getShader( $fs ),

                    prg = _gl.createProgram(),
                    _gl.attachShader( prg, verSd ),
                    _gl.attachShader( prg, fragSd ),
                    _gl.linkProgram( prg );

                if( !_gl.getProgramParameter( prg, _gl.LINK_STATUS ) )
                    throw new Error( "DkGl : 쉐이더 초기화에 실패하였습니다" );

                _gl.useProgram( prg );

                i = $aArr.length;
                while( i-- ){
                    aStr = $aArr[ i ];
                    prg[ aStr ] = _gl.getAttribLocation( prg, aStr );
                    _gl.enableVertexAttribArray( prg[ aStr ] );
                }

                i = $uArr.length;
                while( i-- ){
                    uStr = $uArr[ i ];
                    prg[ uStr ] = _gl.getUniformLocation( prg, uStr );
                }

                return prg;
            }

            function getShader( $id ){
                var sdScrt, str = "", node, shader, type;
                sdScrt = document.getElementById( $id );
                if( !sdScrt ) return null;

                node = sdScrt.firstChild;
                while( node )
                    node.nodeType == 3 ? str += node.textContent : null, node = node.nextSibling;

                type = sdScrt.type;
                if( type == "x-shader/x-vertex" )
                    shader = _gl.createShader( _gl.VERTEX_SHADER );
                else if( type == "x-shader/x-fragment" )
                    shader = _gl.createShader( _gl.FRAGMENT_SHADER );
                else
                    return null;

                _gl.shaderSource( shader, str ),
                    _gl.compileShader( shader );

                if( !_gl.getShaderParameter( shader, _gl.COMPILE_STATUS ) ){
                    throw new Error( _gl.getShaderInfoLog( shader ) );
                    return null;
                }

                if( type == "x-shader/x-vertex" )
                    _vsObj[ $id ] = shader;
                else if( type == "x-shader/x-fragment" )
                    _fsObj[ $id ] = shader;

                return shader;
            }

            //----------------------------------------------------------------------------------------------------------------------------------------------//
            // buffer
            function initBuffer(){
                var posData, indexData, textureData;
                _posVBO = {}, _indexVBO = {}, _textureVBO = {},

                    // rect
                    posData = [ -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0 ],
                    indexData = [ 0, 1, 2, 0, 2, 3 ],
                    textureData = [ 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0 ],
                    makeBufferSet( "rect", posData, 3, indexData, 1, textureData, 2 );
            }

            function makeBufferSet( $name, $posData, $posNum, $indexData, $indexNum, $textureData, $textureNum ){
                makeBuffer( $name, _posVBO, $posData, $posNum ),
                    makeBuffer( $name, _indexVBO, $indexData, $indexNum ),
                    makeBuffer( $name, _textureVBO, $textureData, $textureNum )
            }

            function makeBuffer( $name, $type, $data, $size ){
                var bf = _gl.createBuffer();
                if( $type == _posVBO || $type == _textureVBO )
                    _gl.bindBuffer( _gl.ARRAY_BUFFER, bf ), _gl.bufferData( _gl.ARRAY_BUFFER, new Float32Array( $data ), _gl.STATIC_DRAW );
                else
                    _gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, bf ), _gl.bufferData( _gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( $data ), _gl.STATIC_DRAW );
                bf.size = $size, bf.num = $data.length / $size,
                    $type[ $name ] = bf;
            }

            //----------------------------------------------------------------------------------------------------------------------------------------------//
            // matrix
            function initMatrix(){
                _mtrP = mat4.create();
                _mtrMV = mat4.create();
            }

            //----------------------------------------------------------------------------------------------------------------------------------------------//
            // resize
            function resize(){
                _gl.width = _canvas.width,
                    _gl.height = _canvas.height,

                    mat4.perspective( 45, _gl.width / _gl.height, 0.1, 1000.0, _mtrP ),
                    _gl.viewport( 0, 0, _gl.width, _gl.height ),
                    _gl.uniformMatrix4fv( _programObj.color.uMatrixP, false, _mtrP );
            }

            //----------------------------------------------------------------------------------------------------------------------------------------------//
            // render
            function render(){

                _gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
                _gl.clear( _gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT );
                _gl.enable( _gl.BLEND );
                _gl.blendFunc( _gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA );
                mat4.identity( _mtrMV );

                var prg = _programObj.color;
                _gl.useProgram( prg );

                mat4.translate( _mtrMV, [ 0.0, 0.0, -10.0 ] );

                // pos
                _gl.bindBuffer( _gl.ARRAY_BUFFER, _posVBO[ "rect" ] );
                _gl.vertexAttribPointer( prg.aVertexPosition, _posVBO[ "rect" ].size, _gl.FLOAT, false, 0, 0 );

                // idx
                _gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, _indexVBO[ "rect" ] );

                // color
                _gl.uniform4fv( prg.uColor, [ 1.0, 0.5, 1.0, 0.5 ] );

                // uMatrixMV
                _gl.uniformMatrix4fv( prg.uMatrixMV, false, _mtrMV );

                // draw
                _gl.drawElements( _gl.TRIANGLES, _indexVBO[ "rect" ].num, _gl.UNSIGNED_SHORT, 0 );
            }
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // Loop
        (function(){
            var list, timer, stats, raf, caf, update;
            list = ( DkGl.Loop = _core.adManager( start, end ) ).getList(),

                raf = (function(){ return  W.requestAnimationFrame || W.webkitRequestAnimationFrame || W.mozRequestAnimationFrame || W.oRequestAnimationFrame || function( $loop ){ return W.setTimeout( $loop, 16 ) }; })(),
                caf = (function(){ return W.cancelAnimationFrame || W.webkitCancelAnimationFrame || W.mozCancelAnimationFrame || W.oCancelAnimationFrame || function( $id ){ W.clearTimeout( $id ); }; })()

            function start(){ timer = raf( update ); }

            function end(){ caf( timer ); }

            // stats
            if( W.Stats )
                stats = new Stats(), stats.setMode( 0 ), stats.domElement.style.cssText = "position : fixed; z-index : 2; left : 0px", Doc.body.appendChild( stats.domElement ),
                    update = function(){
                        stats ? stats.begin() : null;

                        var i = list.length;
                        while( i-- ) list[ i ].value( list[ i ].key );

                        timer = raf( update );
                        stats ? stats.end() : null;
                    }
            else
                update = function(){
                    var i = list.length;
                    while( i-- ) list[ i ].value( list[ i ].key );

                    timer = raf( update );
                }
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // Resize
        (function(){
            var list, update;
            list = ( DkGl.Resize = _core.adManager( start, end ) ).getList();

            function start(){ _core.addEvent( W, "resize", update ); }

            function end(){ _core.delEvent( W, "resize", update ); }

            function update( $e ){
                var i = list.length;
                while( i-- ) list[ i ].value( list[ i ].key );
            }
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // loader
        (function(){
            // XMLHttpRequest
            function getXHR(){
                return new XMLHttpRequest();
            }

            // TODO json parser
            // ajax
            function ajax( $url, $cb, $dataType ){
                var url = $url, cb = $cb, dt = $dataType, req = getXHR();

                // XMLHttpRequest 상태변화
                req.onreadystatechange = function(){
                    req.readyState == 4 ? req.status == 200 ?
                        cb( dt == "xml" ? req.responseXML : dt == "json" ? eval( "(" + req.responseText + ")" ) : dt == "text" ? req.responseText : null )
                        : null : null;
                },

                    req.open( "GET", url, true ),
                    req.send( null );
            }

            DkGl.loader = {
                // text 로드
                text : function( $url, $cb ){
                    ajax( $url, $cb, "text" );
                }
            }
        })()
})();