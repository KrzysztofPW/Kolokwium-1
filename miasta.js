var deg2rad = x => x/180.0 * Math.PI

var rad2deg = x => x/Math.PI * 180

// wzór na podstawie Wikipedii
var haversine = ( r, fi1, fi2, la1, la2 ) => 2 * r * Math.asin(
	Math.sqrt(
		Math.pow(
			Math.sin( ( fi2 - fi1 ) / 2 ),
			2
		)
		+ 
		Math.cos( fi1 )
		* Math.cos( fi2 )
		* Math.pow(
			Math.sin( ( la2 - la1 ) / 2 ),
			2
		)
	)
)

// wzór wyznaczony samodzielnie
var haversine_ma = ( r, fi1, fi2, la1, la2 ) => 2 * r * Math.asin(
	0.5 * Math.sqrt(
		2 - 2 * (
			Math.cos( fi1 ) * Math.cos( fi2 ) * Math.cos( la2-la1 )
			+ Math.sin( fi1 ) * Math.sin( fi2 )
		)
	)
)

// wzór przybliżony (odwzorowanie walcowe)
var approx_dist = ( r, fi1, fi2, la1, la2 ) =>
	( (a,b) => r * Math.sqrt( a*a + b*b ) )
	(
		(fi1-fi2),
		(la1-la2) * Math.cos( 0.5 * (fi1+fi2) )
	) 

// wzór przybliżony nieużywający biblioteki matematycznej
var approx_dist2 = ( r, fi1, fi2, la1, la2 ) =>
	( (a,b) => r * approx_sqrt( a*a + b*b ) )
	(
		(fi1-fi2),
		(la1-la2) * approx_cos( 0.5 * (fi1+fi2) )
	) 

// przybliżona wartość cosinusa liczona szeregiem Taylora
var approx_cos = theta => ( 1 - 0.5 * (theta*theta)*( 1 - 0.0833333333 * theta*theta ) )

// przybliżona wartość pierwiastka wyznaczana metodą babilońską (8 kroków)
var approx_sqrt = ( x ) => [ (x<1)?0.25:4, ...new Array(8) ].reduce ( a => 0.5 * ( a + x/a ) )

var dist = ( gps1, gps2 ) => haversine(
	6371, // średni promień Ziemi w km
	deg2rad( gps1[0] ), deg2rad( gps2[0] ),
	deg2rad( gps1[1] ), deg2rad( gps2[1] )
)

var dist_ma = ( gps1, gps2 ) => haversine_ma( 
	6371, // średni promień Ziemi w km
	deg2rad( gps1[0] ), deg2rad( gps2[0] ),
	deg2rad( gps1[1] ), deg2rad( gps2[1] )
)

var dist_appr = ( gps1, gps2 ) => approx_dist( 
	6371, // średni promień Ziemi w km
	deg2rad( gps1[0] ), deg2rad( gps2[0] ),
	deg2rad( gps1[1] ), deg2rad( gps2[1] )
)

var dist_appr2 = ( gps1, gps2 ) => approx_dist2( 
	6371, // średni promień Ziemi w km
	deg2rad( gps1[0] ), deg2rad( gps2[0] ),
	deg2rad( gps1[1] ), deg2rad( gps2[1] )
)

var town_dist = ( t1, t2 ) => dist( t1.gps, t2.gps )

var town_dist_ma = ( t1, t2 ) => dist_ma( t1.gps, t2.gps )

var town_dist_appr = ( t1, t2 ) => dist_appr( t1.gps, t2.gps )

var town_dist_appr2 = ( t1, t2 ) => dist_appr2( t1.gps, t2.gps )


// DODATKOWA FUNKCJONALNOSC

var bearing = ( fi1, fi2, la1, la2 ) => Math.atan2(
	Math.sin( la2 - la1 ) * Math.cos( fi2 ),
	Math.cos( fi1 ) * Math.sin( fi2 )
	- Math.sin( fi1 ) * Math.cos( fi2 ) * Math.cos( la2 - la1 )
)

var direction = ( gps1, gps2 ) => rad2deg( bearing(
	deg2rad( gps1[0] ), deg2rad( gps2[0] ),
	deg2rad( gps1[1] ), deg2rad( gps2[1] )
) )

var town_direction = ( t1, t2 ) => direction( t1.gps, t2.gps )

var compass = x => "N NE E SE S SW W NW".split(" ")[ Math.round(((x+360)/360*8)) % 8 ]