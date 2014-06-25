/**
 * Created by ssw on 2014-06-16.
 */
(function(){
    var W = window, Doc = document, Head = Doc.getElementsByTagName( "head" )[ 0 ], DkGl,
        _jsCore, _glCore, _initView, _initModel;

    //----------------------------------------------------------------------------------------------------------------------------------------------//
    // DkGl
    DkGl = W.DkGl = { Information : { name : "Dk moonstone", version : "v0.0.0.3", contact : "ssw3131@daum.net" } },

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // Detector
        (function(){
            var navi = W['navigator'], agent = navi.userAgent.toLowerCase(), platform = navi.platform.toLowerCase(), app = navi.appVersion.toLowerCase(),
                device = 'pc', browser, bv, os, osv, i,
                ie, chrome, firefox, safari, opera, naver;

            ie = function(){
                if( agent.indexOf( 'msie' ) < 0 && agent.indexOf( 'trident' ) < 0 ) return;
                if( agent.indexOf( 'iemobile' ) > -1 ) os = 'winMobile';
                return browser = 'ie', bv = agent.indexOf( 'msie 7' ) > -1 && agent.indexOf( 'trident' ) > -1 ? -1 : agent.indexOf( 'msie' ) < 0 ? 11 : parseFloat( /msie ([\d]+)/.exec( agent )[1] );
            },
                chrome = function(){
                    if( agent.indexOf( i = 'chrome' ) < 0 && agent.indexOf( i = 'crios' ) < 0 ) return;
                    return browser = 'chrome', bv = parseFloat( ( i == 'chrome' ? /chrome\/([\d]+)/ : /crios\/([\d]+)/ ).exec( agent )[1] );
                },
                firefox = function(){return agent.indexOf( 'firefox' ) < 0 ? 0 : ( browser = 'firefox', bv = parseFloat( /firefox\/([\d]+)/.exec( agent )[1] ) );},
                safari = function(){return agent.indexOf( 'safari' ) < 0 ? 0 : ( browser = 'safari', bv = parseFloat( /safari\/([\d]+)/.exec( agent )[1] ) );},
                opera = function(){
                    var i;
                    return (agent.indexOf( i = 'opera' ) < 0 && agent.indexOf( i = 'opr' ) < 0 ) ? 0 : ( browser = 'opera', bv = ( i == 'opera' ) ? parseFloat( /version\/([\d]+)/.exec( agent )[1] ) : parseFloat( /opr\/([\d]+)/.exec( agent )[1] ) );
                },
                naver = function(){return agent.indexOf( 'naver' ) < 0 ? 0 : browser = 'naver';};

            if( agent.indexOf( 'android' ) > -1 ){
                browser = os = 'android';
                if( agent.indexOf( 'mobile' ) == -1 ) browser += 'Tablet', device = 'tablet';
                else device = 'mobile';
                if( i = /android ([\d.]+)/.exec( agent ) ) i = i[1].split( '.' ), osv = parseFloat( i[0] + '.' + i[1] );
                else osv = 0;
                if( i = /safari\/([\d.]+)/.exec( agent ) ) bv = parseFloat( i[1] );
                naver() || opera() || chrome() || firefox();
            } else if( agent.indexOf( i = 'ipad' ) > -1 || agent.indexOf( i = 'iphone' ) > -1 ){
                device = i == 'ipad' ? 'tablet' : 'mobile', browser = os = i;
                if( i = /os ([\d_]+)/.exec( agent ) ) i = i[1].split( '_' ), osv = parseFloat( i[0] + '.' + i[1] );
                else osv = 0;
                if( i = /mobile\/([\S]+)/.exec( agent ) ) bv = parseFloat( i[1] );
                naver() || opera() || chrome() || firefox();
            } else {
                if( platform.indexOf( 'win' ) > -1 ){
                    os = 'win', i = 'windows nt ';
                    if( agent.indexOf( i + '5.1' ) > -1 ) osv = 'xp';
                    else if( agent.indexOf( i + '6.0' ) > -1 ) osv = 'vista';
                    else if( agent.indexOf( i + '6.1' ) > -1 ) osv = '7';
                    else if( agent.indexOf( i + '6.2' ) > -1 ) osv = '8';
                    else if( agent.indexOf( i + '6.3' ) > -1 ) osv = '8.1';
                    ie() || opera() || chrome() || firefox() || safari();
                } else if( platform.indexOf( 'mac' ) > -1 ){
                    os = 'mac',
                        i = /os x ([\d._]+)/.exec( agent )[1].replace( '_', '.' ).split( '.' ),
                        osv = parseFloat( i[0] + '.' + i[1] ),
                        opera() || chrome() || firefox() || safari();
                } else {
                    os = app.indexOf( 'x11' ) > -1 ? 'unix' : app.indexOf( 'linux' ) > -1 ? 'linux' : 0,
                        chrome() || firefox();
                }
            }

            DkGl.Detector = {
                device : device,
                browser : browser, browserVer : bv,
                os : os, osVer : osv,
                touchBool : W.ontouchstart !== undefined,
                wheelEvent : browser == "firefox" ? "DOMMouseScroll" : "mousewheel",
                requestAnimationFrame : (function(){ return  W.requestAnimationFrame || W.webkitRequestAnimationFrame || W.mozRequestAnimationFrame || W.oRequestAnimationFrame || function( $loop ){ return W.setTimeout( $loop, 16 ) }; })(),
                cancelAnimationFrame : (function(){ return W.cancelAnimationFrame || W.webkitCancelAnimationFrame || W.mozCancelAnimationFrame || W.oCancelAnimationFrame || function( $id ){ W.clearTimeout( $id ); }; })()
            };
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // jsCore
        (function(){
            var dtt = DkGl.Detector, jcRet, jcTs;
            _jsCore = {
                push : Array.prototype.push,
                slice : Array.prototype.slice,
                indexOf : Array.prototype.indexOf,
                splice : Array.prototype.splice,
                join : Array.prototype.join,
                toString : jcTs = Object.prototype.toString,
                hasOwn : Object.prototype.hasOwnProperty,
                trim : String.prototype.trim,
                replaceEventType : jcRet = dtt.device != "pc" ? { mousedown : "touchstart", mousemove : "touchmove", mouseup : "touchend" } : {},

                // addEvent
                addEvent : (function(){
                    if( dtt.device != "pc" ){
                        return function( $e, $et, $cb, $cap ){
                            if( $et == "mouseover" || $et == "mouseout" ) return;
                            $et = jcRet[ $et ] ? jcRet[ $et ] : $et,
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
                    if( dtt.device != "pc" ){
                        return function( $e, $et, $cb, $cap ){
                            if( $et == "mouseover" || $et == "mouseout" ) return;
                            $et = jcRet[ $et ] ? jcRet[ $et ] : $et,
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
                                            ++total == 1 ? $sF ? $sF() : null : null,
                                        true;
                                else return false; //trace( "Dk : list에 이미 " + $k + "값이 존재합니다." )
                            },

                            del : function( $k ){
                                // if( list[ $k ] == undefined ) return trace( "Dk : list에 " + $k + "값이 존재하지 않습니다." );
                                if( list[ $k ] == undefined ) return;
                                var t0 = list[ $k ], k;
                                list.splice( t0, 1 ), delete list[ $k ];
                                for( k in list ) list[ k ] >= t0 ? list[ k ] -= 1 : null;
                                --total ? null : $eF ? $eF() : null;
                            },

                            getList : function(){ return list; }
                        }
                    })()
                },

                // 객체의 타입이 맞는지 체크
                is : (function(){
                    var t0 = { "array" : "[object Array]", "function" : "[object Function]", "string" : "[object String]", "number" : "[object Number]", "object" : "[object Object]" };
                    return function( $t, $o ){ return $o !== undefined && $o !== null && t0[ $t ] === jcTs.call( $o ); }
                })(),

                // throw error
                throwError : function( $m ){
                    throw new Error( $m );
                }
            }
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // util
        (function(){
            DkGl.util = {
                randomHex : (function(){
                    var letters = "0123456789ABCDEF".split( "" ), mRandom = Math.random;
                    return function(){
                        var r = "#", i = 6;
                        while( i-- ){
                            r += letters[ parseInt( ( 15 + 0.99999 ) * mRandom() ) ];
                        }
                        return r;
                    }
                })(),

                hexToRGB : function( $hex ){
                    var r = {};
                    $hex = $hex.charAt( 0 ) == "#" ? $hex.substring( 1, 7 ) : $hex,
                        r.r = parseInt( $hex.substring( 0, 2 ), 16 ),
                        r.g = parseInt( $hex.substring( 2, 4 ), 16 ),
                        r.b = parseInt( $hex.substring( 4, 6 ), 16 );
                    return r;
                },

                degToRad : (function(){
                    var mPI = Math.PI;
                    return function( $deg ){
                        return $deg * mPI / 180;
                    }
                })(),

                loop : (function(){
                    var dtt = DkGl.Detector, r, list, timer, stats, raf, caf, update;

                    list = ( r = _jsCore.adManager( start, end ) ).getList(),
                        raf = dtt.requestAnimationFrame, caf = dtt.cancelAnimationFrame;

                    function start(){ timer = raf( update ); }

                    function end(){ caf( timer ); }

                    // stats
//                    if( W.Stats )
//                        stats = new Stats(), stats.setMode( 0 ), stats.domElement.style.cssText = "position : fixed; z-index : 2;", Doc.body.appendChild( stats.domElement ),
//                            update = function(){
//                                stats ? stats.begin() : null;
//
//                                var i = list.length;
//                                while( i-- ) list[ i ].value( list[ i ].key );
//                                timer = raf( update );
//
//                                stats ? stats.end() : null;
//                            }
//                    else
                    update = function(){
                        var i = list.length;
                        while( i-- ) list[ i ].value( list[ i ].key );
                        timer = raf( update );
                    }

                    return r;
                })(),

                resize : (function(){
                    var r, list, update;
                    list = ( r = _jsCore.adManager( start, end ) ).getList();

                    function start(){ _jsCore.addEvent( W, "resize", update ); }

                    function end(){ _jsCore.delEvent( W, "resize", update ); }

                    function update( $e ){
                        var i = list.length;
                        while( i-- ) list[ i ].value( list[ i ].key );
                    }

                    return r;
                })()
            }
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // loader
        (function(){
            // ajax
            function ajax( $url, $cb, $dataType ){
                var url = $url, cb = $cb, dt = $dataType, req = new XMLHttpRequest();

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
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // matrix
        (function(){
            var GLMAT_EPSILON = 0.000001,
                mAbs = Math.abs, mCos = Math.cos, mSin = Math.sin, mSqrt = Math.sqrt, mTan = Math.tan;
            DkGl.mat4 = {
                create : function(){
                    var out = new Float32Array( 16 );
                    return out[0] = 1, out[1] = 0, out[2] = 0, out[3] = 0, out[4] = 0, out[5] = 1, out[6] = 0, out[7] = 0, out[8] = 0, out[9] = 0, out[10] = 1, out[11] = 0, out[12] = 0, out[13] = 0, out[14] = 0, out[15] = 1, out;
                },

                identity : function( $out ){
                    return $out[0] = 1, $out[1] = 0, $out[2] = 0, $out[3] = 0, $out[4] = 0, $out[5] = 1, $out[6] = 0, $out[7] = 0, $out[8] = 0, $out[9] = 0, $out[10] = 1, $out[11] = 0, $out[12] = 0, $out[13] = 0, $out[14] = 0, $out[15] = 1, $out;
                },

                perspective : function( $out, $fovy, $aspect, $near, $far ){
                    var f = 1.0 / mTan( $fovy / 2 ), nf = 1 / ( $near - $far );
                    return $out[0] = f / $aspect, $out[1] = 0, $out[2] = 0, $out[3] = 0, $out[4] = 0, $out[5] = f, $out[6] = 0, $out[7] = 0, $out[8] = 0, $out[9] = 0, $out[10] = ( $far + $near ) * nf, $out[11] = -1, $out[12] = 0, $out[13] = 0, $out[14] = 2 * $far * $near * nf, $out[15] = 0, $out;
                },

                ortho : function( $out, $left, $right, $bottom, $top, $near, $far ){
                    var lr = 1 / ($left - $right), bt = 1 / ($bottom - $top), nf = 1 / ($near - $far);
                    return $out[0] = -2 * lr, $out[1] = 0, $out[2] = 0, $out[3] = 0, $out[4] = 0, $out[5] = -2 * bt, $out[6] = 0, $out[7] = 0, $out[8] = 0, $out[9] = 0, $out[10] = 2 * nf, $out[11] = 0, $out[12] = ($left + $right) * lr, $out[13] = ($top + $bottom) * bt, $out[14] = ($far + $near) * nf, $out[15] = 1, $out;
                },

                copy : function( $out, $a ){
                    return $out[0] = $a[0], $out[1] = $a[1], $out[2] = $a[2], $out[3] = $a[3], $out[4] = $a[4], $out[5] = $a[5], $out[6] = $a[6], $out[7] = $a[7], $out[8] = $a[8], $out[9] = $a[9], $out[10] = $a[10], $out[11] = $a[11], $out[12] = $a[12], $out[13] = $a[13], $out[14] = $a[14], $out[15] = $a[15], $out;
                },

                multiply : function( $out, $a, $b ){
                    var a00 = $a[0], a01 = $a[1], a02 = $a[2], a03 = $a[3], a10 = $a[4], a11 = $a[5], a12 = $a[6], a13 = $a[7], a20 = $a[8], a21 = $a[9], a22 = $a[10], a23 = $a[11], a30 = $a[12], a31 = $a[13], a32 = $a[14], a33 = $a[15], b0 = $b[0], b1 = $b[1], b2 = $b[2], b3 = $b[3];
                    return $out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30, $out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31, $out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32, $out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33, b0 = $b[4], b1 = $b[5], b2 = $b[6], b3 = $b[7], $out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30, $out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31, $out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32, $out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33, b0 = $b[8], b1 = $b[9], b2 = $b[10], b3 = $b[11], $out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30, $out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31, $out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32, $out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33, b0 = $b[12], b1 = $b[13], b2 = $b[14], b3 = $b[15], $out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30, $out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31, $out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32, $out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33, $out;
                },

                translate : function( $out, $a, $v ){
                    var x = $v[0], y = $v[1], z = $v[2], a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23;

                    if( $a === $out ){
                        $out[12] = $a[0] * x + $a[4] * y + $a[8] * z + $a[12], $out[13] = $a[1] * x + $a[5] * y + $a[9] * z + $a[13], $out[14] = $a[2] * x + $a[6] * y + $a[10] * z + $a[14], $out[15] = $a[3] * x + $a[7] * y + $a[11] * z + $a[15];
                    } else {
                        a00 = $a[0], a01 = $a[1], a02 = $a[2], a03 = $a[3], a10 = $a[4], a11 = $a[5], a12 = $a[6], a13 = $a[7], a20 = $a[8], a21 = $a[9], a22 = $a[10], a23 = $a[11],
                            $out[0] = a00, $out[1] = a01, $out[2] = a02, $out[3] = a03, $out[4] = a10, $out[5] = a11, $out[6] = a12, $out[7] = a13, $out[8] = a20, $out[9] = a21, $out[10] = a22, $out[11] = a23,
                            $out[12] = a00 * x + a10 * y + a20 * z + $a[12], $out[13] = a01 * x + a11 * y + a21 * z + $a[13], $out[14] = a02 * x + a12 * y + a22 * z + $a[14], $out[15] = a03 * x + a13 * y + a23 * z + $a[15];
                    }

                    return $out;
                },

                scale : function( $out, $a, $v ){
                    var x = $v[0], y = $v[1], z = $v[2];
                    return  $out[0] = $a[0] * x, $out[1] = $a[1] * x, $out[2] = $a[2] * x, $out[3] = $a[3] * x, $out[4] = $a[4] * y, $out[5] = $a[5] * y, $out[6] = $a[6] * y, $out[7] = $a[7] * y, $out[8] = $a[8] * z, $out[9] = $a[9] * z, $out[10] = $a[10] * z, $out[11] = $a[11] * z, $out[12] = $a[12], $out[13] = $a[13], $out[14] = $a[14], $out[15] = $a[15], $out;
                },

                rotate : function( $out, $a, $rad, $axis ){
                    var x = $axis[0], y = $axis[1], z = $axis[2], len = mSqrt( x * x + y * y + z * z ), s, c, t, a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, b00, b01, b02, b10, b11, b12, b20, b21, b22;
                    if( mAbs( len ) < GLMAT_EPSILON ) return null;
                    len = 1 / len, x *= len, y *= len, z *= len,
                        s = mSin( $rad ), c = mCos( $rad ), t = 1 - c,
                        a00 = $a[0], a01 = $a[1], a02 = $a[2], a03 = $a[3], a10 = $a[4], a11 = $a[5], a12 = $a[6], a13 = $a[7], a20 = $a[8], a21 = $a[9], a22 = $a[10], a23 = $a[11],
                        b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s, b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s, b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c,
                        $out[0] = a00 * b00 + a10 * b01 + a20 * b02, $out[1] = a01 * b00 + a11 * b01 + a21 * b02, $out[2] = a02 * b00 + a12 * b01 + a22 * b02, $out[3] = a03 * b00 + a13 * b01 + a23 * b02, $out[4] = a00 * b10 + a10 * b11 + a20 * b12, $out[5] = a01 * b10 + a11 * b11 + a21 * b12, $out[6] = a02 * b10 + a12 * b11 + a22 * b12, $out[7] = a03 * b10 + a13 * b11 + a23 * b12, $out[8] = a00 * b20 + a10 * b21 + a20 * b22, $out[9] = a01 * b20 + a11 * b21 + a21 * b22, $out[10] = a02 * b20 + a12 * b21 + a22 * b22, $out[11] = a03 * b20 + a13 * b21 + a23 * b22;
                    if( $a !== $out ) $out[12] = $a[12], $out[13] = $a[13], $out[14] = $a[14], $out[15] = $a[15];
                    return $out;
                },

                rotateX : function( $out, $a, $rad ){
                    var s = mSin( $rad ), c = mCos( $rad ), a10 = $a[4], a11 = $a[5], a12 = $a[6], a13 = $a[7], a20 = $a[8], a21 = $a[9], a22 = $a[10], a23 = $a[11];
                    if( $a !== $out ) $out[0] = $a[0], $out[1] = $a[1], $out[2] = $a[2], $out[3] = $a[3], $out[12] = $a[12], $out[13] = $a[13], $out[14] = $a[14], $out[15] = $a[15];
                    $out[4] = a10 * c + a20 * s, $out[5] = a11 * c + a21 * s, $out[6] = a12 * c + a22 * s, $out[7] = a13 * c + a23 * s, $out[8] = a20 * c - a10 * s, $out[9] = a21 * c - a11 * s, $out[10] = a22 * c - a12 * s, $out[11] = a23 * c - a13 * s;
                    return $out;
                },

                rotateY : function( $out, $a, $rad ){
                    var s = mSin( $rad ), c = mCos( $rad ), a00 = $a[0], a01 = $a[1], a02 = $a[2], a03 = $a[3], a20 = $a[8], a21 = $a[9], a22 = $a[10], a23 = $a[11];
                    if( $a !== $out ) $out[4] = $a[4], $out[5] = $a[5], $out[6] = $a[6], $out[7] = $a[7], $out[12] = $a[12], $out[13] = $a[13], $out[14] = $a[14], $out[15] = $a[15];
                    $out[0] = a00 * c - a20 * s, $out[1] = a01 * c - a21 * s, $out[2] = a02 * c - a22 * s, $out[3] = a03 * c - a23 * s, $out[8] = a00 * s + a20 * c, $out[9] = a01 * s + a21 * c, $out[10] = a02 * s + a22 * c, $out[11] = a03 * s + a23 * c;
                    return $out;
                },

                rotateZ : function( $out, $a, $rad ){
                    var s = mSin( $rad ), c = mCos( $rad ), a00 = $a[0], a01 = $a[1], a02 = $a[2], a03 = $a[3], a10 = $a[4], a11 = $a[5], a12 = $a[6], a13 = $a[7];
                    if( $a !== $out ) $out[8] = $a[8], $out[9] = $a[9], $out[10] = $a[10], $out[11] = $a[11], $out[12] = $a[12], $out[13] = $a[13], $out[14] = $a[14], $out[15] = $a[15];
                    $out[0] = a00 * c + a10 * s, $out[1] = a01 * c + a11 * s, $out[2] = a02 * c + a12 * s, $out[3] = a03 * c + a13 * s, $out[4] = a10 * c - a00 * s, $out[5] = a11 * c - a01 * s, $out[6] = a12 * c - a02 * s, $out[7] = a13 * c - a03 * s;
                    return $out;
                }
            }
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // init
        (function(){
            DkGl.init = function( $id, $shader, $callBack ){
                var check;
                check = function(){
                    switch( Doc.readyState ){
                        case"complete":
                        case"interactive":
                        case"loaded":
                            if( Doc && Doc.getElementsByTagName && Doc.getElementById && Doc.body ) _glCore.init( $id, $shader, $callBack );
                            break;
                        default:
                            setTimeout( check, 10 );
                    }
                }, check();
            }
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // glCore
        (function(){
            _glCore = {
                init : function( $id, $shader, $callBack ){
                    initShader( $shader, function(){
                        initCanvas( $id ),
                            initGl(),
                            initProgram(),
                            initBuffer(),
                            initMatrix(),

                            _initView(),
                            _initModel(),

                            $callBack();
                    } );
                },
                canvas : null,
                gl : null,
                svObj : {},
                sfObj : {},
                programObj : {},
                vboPosObj : {},
                vboIndexObj : {},
                vboTextureObj : {},
                mtrP : null,
                mtrC : null,
                children : []
            }

            //----------------------------------------------------------------------------------------------------------------------------------------------//

            function initShader( $shader, $callBack ){
                DkGl.loader.text( $shader, function( $data ){
                    Head.innerHTML += $data,
                        $callBack();
                } )
            }

            //----------------------------------------------------------------------------------------------------------------------------------------------//

            function initCanvas( $id ){
                DkGl.canvas = _glCore.canvas = Doc.getElementById( $id );
            }

            //----------------------------------------------------------------------------------------------------------------------------------------------//

            function initGl(){
                var gl, canvas = _glCore.canvas;
                _glCore.gl = gl = canvas.getContext( "webgl" ) || canvas.getContext( "experimental-webgl" ) || canvas.getContext( "webkit-3d" ) || canvas.getContext( "moz-webgl" ),
                    gl ? null : _jsCore.throwError( "DkGl : 이 브라우저에서는 WebGL은 사용이 불가능 합니다." );
                gl.enable( gl.DEPTH_TEST );
                gl.depthFunc( gl.LEQUAL )
                if( W.WebGLDebugUtils ) gl = WebGLDebugUtils.makeDebugContext( gl );
            }

            //----------------------------------------------------------------------------------------------------------------------------------------------//

            function initProgram(){
                _glCore.programObj = _jsCore.adManager();

                makeProgram( "color", "shader-v-color", "shader-f-color", [ "uMatrixP", "uMatrixMV", "uColor", "uAlpha" ], [ "aVertexPosition" ] );
                makeProgram( "texture", "shader-v-texture", "shader-f-texture", [ "uMatrixP", "uMatrixMV", "uSampler" ], [ "aVertexPosition", "aTextureCoord" ] );
                // texture2
                // sheet
            }

            function makeProgram( $name, $vs, $fs, $uArr, $aArr ){
                var gl = _glCore.gl, p, i, aStr, uStr;

                p = gl.createProgram(),
                    gl.attachShader( p, getShader( $vs, "svObj" ) ),
                    gl.attachShader( p, getShader( $fs, "sfObj" ) ),
                    gl.linkProgram( p ),
                    gl.getProgramParameter( p, gl.LINK_STATUS ) ? null : _jsCore.throwError( "DkGl : 쉐이더 초기화에 실패하였습니다" );

                i = $uArr.length;
                while( i-- )
                    uStr = $uArr[ i ], p[ uStr ] = gl.getUniformLocation( p, uStr );

                p.aArr = $aArr;
                i = $aArr.length;
                while( i-- )
                    aStr = $aArr[ i ], p[ aStr ] = gl.getAttribLocation( p, aStr );
//                        gl.enableVertexAttribArray( p[ aStr ] );

                _glCore.programObj.add( $name, p ), p.name = $name;

                return p;
            }

            function getShader( $id, $type ){
                if( _glCore[ $type ][ $id ] ) return _glCore[ $type ][ $id ];

                var gl = _glCore.gl, shader, sdScrt = document.getElementById( $id );
                if( !sdScrt ) return null;

                shader = $type == "svObj" ? gl.createShader( gl.VERTEX_SHADER ) : $type == "sfObj" ? gl.createShader( gl.FRAGMENT_SHADER ) : null,
                    gl.shaderSource( shader, sdScrt.firstChild.textContent ),
                    gl.compileShader( shader ),
                    gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ? null : _jsCore.throwError( gl.getShaderInfoLog( shader ) ),
                    _glCore[ $type ][ $id ] = shader;

                return shader;
            }

            //----------------------------------------------------------------------------------------------------------------------------------------------//

            function initBuffer(){
                var posData, indexData, textureData;

                // rect
                // posData = [ -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0 ],
                posData = [ 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0 ],
                    indexData = [ 0, 1, 2, 0, 2, 3 ],
                    textureData = [ 0, 0, 1, 0, 1, 1, 0, 1 ],
                    makeBuffer( "rect", posData, indexData, textureData );
            }

            function makeBuffer( $name, $posData, $indexData, $textureData ){
                var gl = _glCore.gl, bf;
//                var vboArr = [ "", "", "" ], sizeArr = [ "", "", "" ], numArr = [ "", "", "" ];
                bf = gl.createBuffer(),
                    _glCore.vboPosObj[ $name ] = bf,
                    bf.size = 3, bf.num = $posData.length / 3,
                    gl.bindBuffer( gl.ARRAY_BUFFER, bf ), gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( $posData ), gl.STATIC_DRAW ),

                    bf = gl.createBuffer(),
                    _glCore.vboIndexObj[ $name ] = bf,
                    bf.size = 1, bf.num = $indexData.length / 1,
                    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, bf ), gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( $indexData ), gl.STATIC_DRAW ),

                    bf = gl.createBuffer(),
                    _glCore.vboTextureObj[ $name ] = bf,
                    bf.size = 2, bf.num = $posData.length / 2,
                    gl.bindBuffer( gl.ARRAY_BUFFER, bf ), gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( $textureData ), gl.STATIC_DRAW );
            }

            //----------------------------------------------------------------------------------------------------------------------------------------------//

            function initMatrix(){
                var mat4 = DkGl.mat4;
                _glCore.mtrP = mat4.create(), _glCore.mtrC = mat4.create()
            }
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // bg
        (function(){
            DkGl.bg = function( $color ){
                var gc = _glCore, ut = DkGl.util, color = ut.hexToRGB( $color );
                gc.gl.clearColor( color.r / 256, color.g / 256, color.b / 256, 1 );
            }
            // bgImg
        })(),

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // view
        _initView = function(){
            var ut = DkGl.util, uDegToRad = ut.degToRad,
                dNow = Date.now,
                dtt = DkGl.Detector, raf = dtt.requestAnimationFrame,
                stats, render,
                gc = _glCore, gl = gc.gl, canvas = gc.canvas,
                vboPosObj = gc.vboPosObj, vboIndexObj = gc.vboIndexObj, vboTextureObj = gc.vboTextureObj,
                p, geoType, posVbo, indexVbo, textureVbo,
                mtrP = gc.mtrP,
                mat4 = DkGl.mat4,
                mtrS = mat4.create(), mtrCopy = mat4.create();

            //----------------------------------------------------------------------------------------------------------------------------------------------//

            ut.resize.add( "DkGl", resize ), resize();

            function resize(){
                log( "DkGl : resize" );
                var w, h, list, i, p;

                gl.width = w = canvas.width, gl.height = h = canvas.height,
                    gl.viewport( 0, 0, w, h ),

                    mat4.identity( mtrP ),
                    mat4.perspective( mtrP, 45, w / h, 0.1, 10000 ),
                    mat4.translate( mtrP, mtrP, [ -w / 2, h / 2, -251 / 280 * h ] ),
//                    mat4.translate( mtrP, mtrP, [ 0, 0, -251 / 280 * h ] ),
                    mat4.rotateX( mtrP, mtrP, uDegToRad( 180 ) ),
//                    mat4.scale( mtrP, mtrP, [ 1, -1, 1 ] ),

                    // uniform
                    list = gc.programObj.getList(), i = list.length;
                while( i-- )
                    p = list[ i ].value, gl.useProgram( p ), gl.uniformMatrix4fv( p.uMatrixP, false, mtrP );
            }

            //----------------------------------------------------------------------------------------------------------------------------------------------//

            ut.loop.add( "DkGl", loop );
            function loop(){
                var cTime = dNow(), oldTime = loop.oldTime;

                if( cTime - oldTime >= 16 ){
                    // animation
                    // 서드파티
                    oldTime = cTime;
                }
            }

            loop.oldTime = dNow();

            //----------------------------------------------------------------------------------------------------------------------------------------------//

            render = function(){
                var cTime = dNow();
                cTime - render.oldTime >= 16 ? ( draw(), drawMouse(), render.oldTime = cTime ) : null,
                    raf( render );
            }

            if( W.Stats )
                stats = new Stats(), stats.setMode( 0 ), stats.domElement.style.cssText = "position : fixed; z-index : 2;", Doc.body.appendChild( stats.domElement ),
                    render = (function(){
                        var oldRender = render;
                        return function(){
                            stats.begin(),
                                oldRender(),
                                stats.end();
                        }
                    })();
            render.oldTime = dNow();

            raf( render );

//            setTimeout( function(){ render = function(){} }, 1000 );

            //----------------------------------------------------------------------------------------------------------------------------------------------//

            function draw(){
                // reset
                gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT ),
                    gl.enable( gl.BLEND ),
                    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA ),

                    drawCall( gc.children );
            }

            function drawCall( $children, $mtrParent ){
                var list = $children, i, leng = list.length, sprite, material, aArr, j, geoChange = false;

                for( i = 0; i < leng; i++ ){
                    sprite = list[ i ], material = sprite.material;

                    if( p != material.program ){
                        p = material.program;

                        if( p.name == "texture" && material.texture == null ) return;

                        gl.useProgram( p );

                        aArr = p.aArr, j = aArr.length;
                        while( j-- )
                            gl.enableVertexAttribArray( p[ aArr[ j ] ] );

                        // buffer
                        if( geoType != sprite.geoType ){
                            geoChange = true;
                            geoType = sprite.geoType, posVbo = vboPosObj[ geoType ], indexVbo = vboIndexObj[ geoType ], textureVbo = vboTextureObj[ geoType ];
                        }

                        if( geoChange || p.name == "texture" ){
                            gl.bindBuffer( gl.ARRAY_BUFFER, posVbo );
                            gl.vertexAttribPointer( p.aVertexPosition, posVbo.size, gl.FLOAT, false, 0, 0 );

                            gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexVbo );

                            gl.bindBuffer( gl.ARRAY_BUFFER, textureVbo );
                            gl.vertexAttribPointer( p.aTextureCoord, textureVbo.size, gl.FLOAT, false, 0, 0 );
                            gl.activeTexture( gl.TEXTURE0 );
                            gl.uniform1i( p.samplerUniform, 0 );
                        }
                    }

                    if( p.name == "color" ){
                        gl.uniform3fv( p.uColor, [ material.r / 256, material.g / 256, material.b / 256 ] );
                        gl.uniform1f( p.uAlpha, material.alpha );
                    } else if( p.name == "texture" ){
                        gl.bindTexture( gl.TEXTURE_2D, material.texture );
                    }

                    // matrix
                    sprite.updated ? null : sprite.update();
                    mat4.copy( mtrS, sprite.mtr );
                    if( $mtrParent ) mat4.multiply( mtrS, $mtrParent, mtrS );
                    mat4.copy( mtrCopy, mtrS );
                    mat4.scale( mtrS, mtrS, [ sprite.width, sprite.height, 1 ] );
                    gl.uniformMatrix4fv( p.uMatrixMV, false, mtrS );

                    // draw
                    gl.drawElements( gl.TRIANGLES, indexVbo.num, gl.UNSIGNED_SHORT, 0 );

                    // children
                    sprite.children.length > 0 ? drawCall( sprite.children, mtrCopy ) : null;
                }
            }

            //----------------------------------------------------------------------------------------------------------------------------------------------//

            function drawMouse(){
            }
        },

        //----------------------------------------------------------------------------------------------------------------------------------------------//
        // model
        _initModel = function(){
            var ut = DkGl.util, uDegToRad = ut.degToRad,
                jc = _jsCore, jcIs = jc.is, jcTe = jc.throwError,
                gc = _glCore, gl = gc.gl, canvas = gc.canvas, children = gc.children,
                mat4 = DkGl.mat4,
                prototype, dataFunc, treeFunc;

            dataFunc = {
                src : (function(){
                    var textureObj = {};

                    return function( $src ){
                        var self = this, texture, img;
                        if( textureObj[ $src ] ) return textureObj[ $src ];

                        texture = gl.createTexture(),
                            texture.image = img,
                            img = new Image(),
                            img.onload = function(){
                                gl.bindTexture( gl.TEXTURE_2D, texture ),
                                    // gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true ),
                                    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img ),
                                    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST ),
                                    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST ),
                                    gl.bindTexture( gl.TEXTURE_2D, null ),
                                    textureObj[ $src ] = texture,
                                    self.texture = texture;
                            },
                            img.src = $src;
                    }
                })(),

                hex : function( $color ){
                    var self = this, rgb = ut.hexToRGB( $color );
                    self.r = rgb.r, self.g = rgb.g, self.b = rgb.b;
                }
            },

                treeFunc = {
                    // 자식객체 숫자
                    numChildren : function(){
                        return this.children.length;
                    },

                    // 부모객체에 자식으로 추가
                    addParent : function( $parent ){
                        var self = this, c = canvas, i;
                        if( self.parent == $parent ) return self;

                        if( self.parent == c ){
                            i = children.length;
                            while( i-- ){
                                if( children[ i ] == self ){
                                    children.splice( i, 1 );
                                    break;
                                }
                            }
                        } else {
                            self.parent ? self.parent.tr( "removeChild", self ) : null;
                        }
                        self.parent = $parent, $parent == c ? children.push( self ) : $parent.children.push( self );
                        return self;
                    },

                    // 부모객체에 자식객체 제거
                    removeParent : function( $parent ){
                        var self = this, c = canvas, i;
                        self.parent == $parent ? null : jcTe( "DkGl : 제공된 parent는 호출자의 부모이어야 합니다." );
                        if( $parent == c ){
                            self.parent = null,
                                i = children.length;
                            while( i-- ){
                                if( children[ i ] == self ){
                                    children.splice( i, 1 );
                                    break;
                                }
                            }
                        } else {
                            $parent.tr( "removeChild", self );
                        }
                        return self;
                    },

                    // 자식객체 추가
                    addChild : function( $child ){
                        var self = this;
                        $child.parent ? $child.parent.tr( "removeChild", $child ) : null,
                            $child.parent = self, self.children.push( $child );
                        return self;
                    },

                    // 자식객체 제거
                    removeChild : function( $child ){
                        var self = this, children = self.children, i = children.length;
                        $child.parent == self ? null : jcTe( "Dk : 제공된 child는 호출자의 자식이어야 합니다." );
                        while( i-- ){
                            if( children[ i ] == $child ){
                                $child.parent = null, children.splice( i, 1 );
                                break;
                            }
                        }
                        return self;
                    },

                    // 자식객체 모두 제거 or 해당 인덱스 범위 제거 (slice 개념)
                    removeChildren : function( $bIndex, $eIndex ){
                        var self = this, i, children = self.children, leng = children.length, t2;
                        ( $bIndex < 0 || $eIndex < 0 || $bIndex >= $eIndex || $bIndex >= leng ) ? jcTe( "Dk : 제공된 인덱스가 범위를 벗어났습니다." ) : null,
                            ( $bIndex == undefined ) ? $bIndex = 0 : null,
                            ( $eIndex == undefined ) ? $eIndex = leng : null,
                            t2 = children.splice( $bIndex, $eIndex - $bIndex ),
                            i = t2.length;
                        while( i-- ) t2[ i ].parent = null, children.splice( i, 1 );
                        return self;
                    }
                },

                prototype = {
                    // property
                    data : function(){
                        var self = this, func = dataFunc, a = arguments, i = a.length, k, v, r;
                        if( i == 1 )
                            return self[ a[ 0 ] ];
                        i % 2 > 0 ? jcTe( "DkGl : 파라미터 갯수는 1 또는 짝수여야 합니다" ) : null;
                        while( i-- )
                            v = a[ i-- ], k = a[ i ],
                                func[ k ] ? func[ k ].call( self, v ) : self[ k ] = v;
                        self.updated = false;
                        return self;
                    },

                    // tree
                    tr : function(){
                        var self = this, func = treeFunc, a = arguments, i = a.length, k, v, r, t0 = jcIs;
                        if( i == 1 )
                            return func[ a[ 0 ] ].call( self );
                        i % 2 > 0 ? jcTe( "DK : 파라미터 갯수는 1 또는 짝수여야 합니다" ) : null;
                        while( i-- )
                            v = a[ i-- ], k = a[ i ],
                                r = t0( "array", v ) ? func[ k ].apply( self, v ) : func[ k ].call( self, v );
                        return r;
                    },

                    // matrix
                    update : function(){
                        var self = this, mtr = self.mtr;
                        mat4.identity( mtr );
                        mat4.translate( mtr, mtr, [ self.x, self.y, self.z ] );
                        mat4.rotateX( mtr, mtr, uDegToRad( self.rotateX ) );
                        mat4.rotateY( mtr, mtr, uDegToRad( self.rotateY ) );
                        mat4.rotateZ( mtr, mtr, uDegToRad( self.rotateZ ) );
                        mat4.scale( mtr, mtr, [ self.scaleX, self.scaleY, self.scaleZ ] );
                        self.updated = true;
                    }
                },

                (function(){
                    var Sprite;

                    Sprite = function( $type ){
                        var self = this;
                        self.geoType = $type ? $type : "rect",
                            self.parent = null,
                            self.children = [],
                            self.material = DkGl.material(),

                            // data
                            self.x = 0, self.y = 0, self.z = 0,
                            self.width = 1, self.height = 1,
                            self.scaleX = 1, self.scaleY = 1, self.scaleZ = 1,
                            self.rotateX = 0, self.rotateY = 0, self.rotateZ = 0,

                            // matrix
                            self.updated = false,
                            self.mtr = mat4.create()
                    },

                        Sprite.prototype = { data : prototype.data, tr : prototype.tr, update : prototype.update },

                        //----------------------------------------------------------------------------------------------------------------------------------------------//

                        DkGl.sprite = function( $type ){
                            return new Sprite( $type );
                        }
                })(),

                (function(){
                    var ColorMaterial, TextureMaterial;

                    ColorMaterial = function(){
                        var self = this, programObj = _glCore.programObj, list = programObj.getList();
                        self.program = list[ list[ "color" ] ].value,

                            // data
                            self.r = 0, self.g = 0, self.b = 0, self.alpha = 1;
                    },

                        ColorMaterial.prototype = { data : prototype.data },

                        //----------------------------------------------------------------------------------------------------------------------------------------------//

                        TextureMaterial = function(){
                            var self = this, programObj = _glCore.programObj, list = programObj.getList();
                            self.program = list[ list[ "texture" ] ].value,

                                // data
                                self.texture = null;
                        },

                        TextureMaterial.prototype = { data : prototype.data },

                        //----------------------------------------------------------------------------------------------------------------------------------------------//

                        DkGl.material = function( $type ){
                            switch( $type ){
                                case "color" :
                                default :
                                    return new ColorMaterial();
                                case "texture" :
                                    return new TextureMaterial();
                                case "texture2" :
                                    return log( "material texture2" );
                                case "sheet" :
                                    return log( "material sheet" );
                            }
                        }
                })()
        }
})
();