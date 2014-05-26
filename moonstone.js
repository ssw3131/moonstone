/**
 * Created by ssw on 2014-05-26.
 */

(function(){
    var W = window, Doc = document, Head = Doc.getElementsByTagName( "head" )[ 0 ], DkGl, Detector, _core;

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
            if( W.log ) return W.log( "log가 이미 존재합니다." );
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
            DkGl.init = function( $callBack ){
                _core.addEvent( Doc, "DOMContentLoaded", function(){
                    // todo gl init
                    $callBack();
                } );
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
        })()
})();